const nodemailer = require("nodemailer");

exports = async function (changeEvent) {
  // ===== Config (from App Services Values/Secrets) =====
  const SMTP_HOST = context.values.get("SMTP_HOST");
  const SMTP_PORT = Number(context.values.get("SMTP_PORT"));
  const SMTP_USER = context.values.get("SMTP_USER");
  const SMTP_PASS = context.values.get("SMTP_PASS");
  const SMTP_FROM = context.values.get("SMTP_FROM");
  const SMTP_TO   = context.values.get("SMTP_TO");

  // ===== Helpers (mirrors SPAM Digest) =====
  const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  const WEEKDAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const pad2 = n => String(n).padStart(2,"0");
  function ordinal(n){ const s=["th","st","nd","rd"], v=n%100; return s[(v-20)%10]||s[v]||s[0]; }

  // Basic header/subject sanitizer (prevents CRLF injection)
  const cleanHeader = s => String(s ?? "").replace(/[\r\n]+/g, " ").slice(0, 254);

  // Returns -7 (PDT) or -8 (PST) for the given UTC date/time.
  function pacificOffsetHoursUTC(dt) {
    const y = dt.getUTCFullYear();
    function nthWeekdayOfMonth(year, monthIndex, weekday, n) {
      const first = new Date(Date.UTC(year, monthIndex, 1));
      const firstW = first.getUTCDay();
      const add = ((7 + weekday - firstW) % 7) + 7 * (n - 1);
      return new Date(Date.UTC(year, monthIndex, 1 + add));
    }
    function firstWeekdayOfMonth(year, monthIndex, weekday) {
      return nthWeekdayOfMonth(year, monthIndex, weekday, 1);
    }
    const marchSecondSunday = nthWeekdayOfMonth(y, 2, 0, 2);
    const novFirstSunday    = firstWeekdayOfMonth(y, 10, 0);
    const dstStartUTC = new Date(Date.UTC(y, 2, marchSecondSunday.getUTCDate(), 10, 0, 0));
    const dstEndUTC   = new Date(Date.UTC(y,10,    novFirstSunday.getUTCDate(),  9, 0, 0));
    return (dt >= dstStartUTC && dt < dstEndUTC) ? -7 : -8;
  }

  function pacificPartsFromUTC(dt) {
    const off = pacificOffsetHoursUTC(dt);
    const d2  = new Date(dt.getTime() + off * 3600 * 1000);
    return {
      year: d2.getUTCFullYear(),
      month: d2.getUTCMonth() + 1,
      day: d2.getUTCDate(),
      hour: d2.getUTCHours(),
      minute: d2.getUTCMinutes(),
      second: d2.getUTCSeconds(),
      dayOfWeek: d2.getUTCDay() + 1
    };
  }

  function zoneAbbrevFromParts(parts){
    const dt = new Date(Date.UTC(parts.year, parts.month-1, parts.day, parts.hour||0, parts.minute||0, parts.second||0));
    return pacificOffsetHoursUTC(dt) === -7 ? "PDT" : "PST";
  }

  function formatFromParts(parts) {
    const y = parts.year, m = parts.month, d = parts.day;
    const hour24 = parts.hour ?? 0, min = parts.minute ?? 0, sec = parts.second ?? 0;
    const hour12 = (hour24 % 12) || 12;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let weekday = parts.dayOfWeek;
    if (typeof weekday !== "number") {
      const dt = new Date(Date.UTC(y, m - 1, d, hour24, min, sec));
      weekday = dt.getUTCDay();
      return `${WEEKDAYS_SHORT[weekday]}, ${MONTHS[m]} ${d}${ordinal(d)}, ${y} @ ${pad2(hour12)}:${pad2(min)}:${pad2(sec)} ${ampm}`;
    }
    const wdIdx = (weekday - 1 + 7) % 7;
    return `${WEEKDAYS_SHORT[wdIdx]}, ${MONTHS[m]} ${d}${ordinal(d)}, ${y} @ ${pad2(hour12)}:${pad2(min)}:${pad2(sec)} ${ampm}`;
  }

  function formatShortFromParts(parts) {
    const y = parts.year, m = parts.month, d = parts.day;
    let weekday = parts.dayOfWeek;
    if (typeof weekday !== "number") {
      const dt = new Date(Date.UTC(y, m - 1, d, parts.hour ?? 0, parts.minute ?? 0, parts.second ?? 0));
      weekday = dt.getUTCDay();
      return `${WEEKDAYS_SHORT[weekday]}, ${MONTHS[m]} ${d}${ordinal(d)}`;
    }
    const wdIdx = (weekday - 1 + 7) % 7;
    return `${WEEKDAYS_SHORT[wdIdx]}, ${MONTHS[m]} ${d}${ordinal(d)}`;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function headersList(meta) {
    const headers = meta?.headers || {};
    const falsy = Object.entries(headers).filter(([, v]) => !v).map(([k]) => k);
    return falsy.length ? falsy.join(", ") : "all OK";
  }

  // ===== Pull doc fields (defensive) =====
  const doc   = changeEvent.fullDocument || {};
  const name  = doc.name ?? "";
  const email = doc.email ?? "";
  const msg   = doc.message ?? "";
  const meta  = doc.meta || {};
  const createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();

  // Pacific timestamp strings
  const createdParts = pacificPartsFromUTC(createdAt);
  const createdStr   = `${formatFromParts(createdParts)} ${zoneAbbrevFromParts(createdParts)}`;
  const subjectDate  = formatShortFromParts(createdParts);

  // Sender Metadata
  const mode         = meta.mode ?? "";
  const age          = (meta.age ?? "") + "";
  const mxOk         = meta.mxOk ? "true" : "false";
  const urlCount     = Number(meta.urlCount ?? 0);
  const lengthVal    = Number(meta.length ?? 0);
  const nonLatinOnly = meta.nonLatinOnly ? "true" : "false";
  const badHeaders   = headersList(meta);

  // SPAM scoring (log/visibility)
  const finalSpamScore  = Number(doc.final_spam_score ?? 0);
  const urlCountScore   = Number(doc.meta?.scores?.urlCount   ?? 0);
  const lengthScore     = Number(doc.meta?.scores?.length     ?? 0);
  const nonLatinScore   = Number(doc.meta?.scores?.nonLatin   ?? 0);
  const headerAnomScore = Number(doc.meta?.scores?.headerAnom ?? 0);
  const mxMissingScore  = Number(doc.meta?.scores?.mxMissing  ?? 0);

  // ===== Build HTML (table/card like digest) =====
  const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">
    <p><strong>New contact form submission received. Details below.</strong></p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;border:1px solid #4b4b4bff;border-radius:8px;">
      <tr>
        <td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">

          <p style="margin:0 0 8px 0;font-weight:bold;text-decoration:underline;">Message Details</p>
          <p style="margin:0;"><strong>Created:</strong> ${createdStr}</p>
          <p style="margin:0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>

          <p style="margin:8px 0 4px 0;font-weight:bold;text-decoration:underline;">Sender Metadata</p>
          <p style="margin:0;"><strong>mode:</strong> ${escapeHtml(mode)}</p>
          <p style="margin:0;"><strong>age:</strong> ${escapeHtml(age)}</p>
          <p style="margin:0;"><strong>mxOk:</strong> ${mxOk}</p>
          <p style="margin:0;"><strong>urlCount:</strong> ${urlCount}</p>
          <p style="margin:0;"><strong>length:</strong> ${lengthVal}</p>
          <p style="margin:0;"><strong>nonLatinOnly:</strong> ${nonLatinOnly}</p>
          <p style="margin:0 0 8px 0;"><strong>Headers:</strong> ${escapeHtml(badHeaders)}</p>

          <p style="margin:0;"><strong>Final SPAM Score:</strong> ${finalSpamScore}</p>
          <p style="margin:8px 0 4px 0;font-weight:bold;text-decoration:underline;">Component SPAM Scoring</p>
          <p style="margin:0;"><strong>urlCountScore:</strong> ${urlCountScore}</p>
          <p style="margin:0;"><strong>nonLatinScore:</strong> ${nonLatinScore}</p>
          <p style="margin:0;"><strong>lengthScore:</strong> ${lengthScore}</p>
          <p style="margin:0;"><strong>headerAnomScore:</strong> ${headerAnomScore}</p>
          <p style="margin:0 0 8px 0;"><strong>mxMissingScore:</strong> ${mxMissingScore}</p>

          <p style="margin:0 0 4px 0;font-weight:bold;text-decoration:underline;"><strong>Message</strong></p>
          <div style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(msg)}</div>

        </td>
      </tr>
    </table>
  </td></tr>
</table>`.trim();

  // ===== Send via nodemailer =====
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  const subject = `New contact on ${subjectDate} from ${cleanHeader(name) || "Unknown"}`;

  // replyTo if looks like an email (also sanitize)
  const replyTo = (typeof email === "string" && email.includes("@")) ? cleanHeader(email) : undefined;

  await transporter.sendMail({
    from: SMTP_FROM,
    to: SMTP_TO,
    ...(replyTo ? { replyTo } : {}),
    subject,
    html
  });

  return { ok: true };
};

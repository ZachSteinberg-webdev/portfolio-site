// Adds IP tracked with maskedIp (last octet zeroed out) and hasedIp (full IP address hashed and salted)

const nodemailer = require("nodemailer");

exports = async function (changeEvent) {
  // ===== Config =====
  const SMTP_HOST = context.values.get("SMTP_HOST");
  const SMTP_PORT = Number(context.values.get("SMTP_PORT"));
  const SMTP_USER = context.values.get("SMTP_USER");
  const SMTP_PASS = context.values.get("SMTP_PASS");
  const SMTP_FROM = context.values.get("SMTP_FROM");
  const SMTP_TO   = context.values.get("SMTP_TO");

  const DB_NAME = "test";
  const COLL_LEGIT = "contactformsubmissions";
  const COLL_SPAM  = "spamsubmissions";

  // ===== Date helpers (same as your digest, trimmed for brevity) =====
  const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  const WEEKDAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const pad2 = n => String(n).padStart(2,"0");
  function ordinal(n){ const s=["th","st","nd","rd"], v=n%100; return s[(v-20)%10]||s[v]||s[0]; }
  function pacificOffsetHoursUTC(dt){
    const y = dt.getUTCFullYear();
    function nthWeekdayOfMonth(year, monthIndex, weekday, n){
      const first = new Date(Date.UTC(year, monthIndex, 1));
      const firstW = first.getUTCDay();
      const add = ((7 + weekday - firstW) % 7) + 7*(n-1);
      return new Date(Date.UTC(year, monthIndex, 1 + add));
    }
    const marchSecondSunday = nthWeekdayOfMonth(y, 2, 0, 2);
    const novFirstSunday    = nthWeekdayOfMonth(y,10, 0, 1);
    const dstStartUTC = new Date(Date.UTC(y, 2, marchSecondSunday.getUTCDate(), 10, 0, 0));
    const dstEndUTC   = new Date(Date.UTC(y,10,    novFirstSunday.getUTCDate(),  9, 0, 0));
    return (dt >= dstStartUTC && dt < dstEndUTC) ? -7 : -8;
  }
  function pacificPartsFromUTC(dt){
    const off = pacificOffsetHoursUTC(dt);
    const d2  = new Date(dt.getTime() + off*3600*1000);
    return { year: d2.getUTCFullYear(), month: d2.getUTCMonth()+1, day: d2.getUTCDate(),
             hour: d2.getUTCHours(), minute: d2.getUTCMinutes(), second: d2.getUTCSeconds(),
             dayOfWeek: d2.getUTCDay() + 1 };
  }
  function formatFromParts(p){
    const y=p.year,m=p.month,d=p.day,h=p.hour??0,mi=p.minute??0,s=p.second??0;
    const h12=(h%12)||12, ampm=h>=12?"PM":"AM"; const wd=((p.dayOfWeek-1+7)%7);
    return `${WEEKDAYS_SHORT[wd]}, ${MONTHS[m]} ${d}${ordinal(d)}, ${y} @ ${pad2(h12)}:${pad2(mi)}:${pad2(s)} ${ampm}`;
  }
  function formatShortFromParts(p){
    const wd=((p.dayOfWeek-1+7)%7); return `${WEEKDAYS_SHORT[wd]}, ${MONTHS[p.month]} ${p.day}${ordinal(p.day)}`;
  }
  const escapeHtml = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  // ===== Services =====
  const svc  = context.services.get("Cluster0");
  const legit = svc.db(DB_NAME).collection(COLL_LEGIT);
  const spam  = svc.db(DB_NAME).collection(COLL_SPAM);

  // ===== Doc + Pacific timestamps =====
  const doc = changeEvent.fullDocument || {};
  const createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
  const parts = pacificPartsFromUTC(createdAt);
  const createdStr = `${formatFromParts(parts)} ${pacificOffsetHoursUTC(createdAt) === -7 ? "PDT" : "PST"}`;
  const subjectDate = formatShortFromParts(parts);

  // ===== IP fields & counts =====
  const ipNetwork = doc.meta?.client?.ipNetwork || "N/A";
  const ipHash    = doc.meta?.client?.ipHash    || "N/A";

  async function safeCount(coll, filter){
    try { return await coll.countDocuments(filter, { limit: 100000000 }); } catch { return 0; }
  }
  const [ ipNetInLegit, ipNetInSpam, ipHashInLegit, ipHashInSpam ] = await Promise.all([
    ipNetwork !== "N/A" ? safeCount(legit, { "meta.client.ipNetwork": ipNetwork }) : 0,
    ipNetwork !== "N/A" ? safeCount(spam,  { "meta.client.ipNetwork": ipNetwork }) : 0,
    ipHash    !== "N/A" ? safeCount(legit, { "meta.client.ipHash": ipHash })       : 0,
    ipHash    !== "N/A" ? safeCount(spam,  { "meta.client.ipHash": ipHash })       : 0,
  ]);

  // ===== Other fields you already include =====
  const name  = escapeHtml(doc.name ?? "");
  const email = escapeHtml(doc.email ?? "");
  const msg   = escapeHtml(doc.message ?? "");
  const meta  = doc.meta || {};
  const badHeaders = (() => {
    const headers = meta.headers || {};
    const falsy = Object.entries(headers).filter(([,v]) => !v).map(([k]) => k);
    return falsy.length ? falsy.join(", ") : "all OK";
  })();
  const finalSpamScore = Number(doc.final_spam_score ?? 0);
  const s = meta.scores || {};
  const urlCountScore   = Number(s.urlCount   ?? 0);
  const lengthScore     = Number(s.length     ?? 0);
  const nonLatinScore   = Number(s.nonLatin   ?? 0);
  const headerAnomScore = Number(s.headerAnom ?? 0);
  const mxMissingScore  = Number(s.mxMissing  ?? 0);
  const urlCount     = Number(meta.urlCount ?? 0);
  const length       = Number(meta.length   ?? 0);
  const nonLatinOnly = meta.nonLatinOnly ? "true" : "false";
  const mxOk         = meta.mxOk ? "true" : "false";
  const mode         = meta.mode ?? "";
  const age          = (meta.age ?? "") + "";

  // ===== HTML (matches your table/card style) =====
  const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">
    <p><strong>New contact form submission received. Details below.</strong></p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;border:1px solid #eee;border-radius:8px;">
      <tr><td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">

        <p style="margin:0 0 8px 0;font-weight:bold;text-decoration:underline;">Message Details</p>
        <p style="margin:0;"><strong>Created:</strong> ${createdStr}</p>
        <p style="margin:0;"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${email}</p>

        <p style="margin:8px 0 4px 0;font-weight:bold;text-decoration:underline;">Sender Metadata</p>
        <p style="margin:0;"><strong>mode:</strong> ${escapeHtml(mode)}</p>
        <p style="margin:0;"><strong>age:</strong> ${escapeHtml(age)}</p>
        <p style="margin:0;"><strong>mxOk:</strong> ${mxOk}</p>
        <p style="margin:0;"><strong>urlCount:</strong> ${urlCount}</p>
        <p style="margin:0;"><strong>length:</strong> ${length}</p>
        <p style="margin:0;"><strong>nonLatinOnly:</strong> ${nonLatinOnly}</p>
        <p style="margin:0 0 8px 0;"><strong>Headers:</strong> ${escapeHtml(badHeaders)}</p>

        <p style="margin:8px 0 4px 0;font-weight:bold;text-decoration:underline;">IP Signals</p>
        <p style="margin:0;"><strong>Masked IP (ipNetwork):</strong> ${escapeHtml(ipNetwork)}</p>
        <p style="margin:0;"><em>In contact submissions:</em> ${ipNetInLegit} &nbsp; | &nbsp; <em>In spam submissions:</em> ${ipNetInSpam}</p>
        <p style="margin:6px 0 0 0;"><strong>Hashed IP (ipHash):</strong> ${escapeHtml(ipHash)}</p>
        <p style="margin:0;"><em>In contact submissions:</em> ${ipHashInLegit} &nbsp; | &nbsp; <em>In spam submissions:</em> ${ipHashInSpam}</p>

        <p style="margin:8px 0 4px 0;font-weight:bold;text-decoration:underline;">Scoring</p>
        <p style="margin:0;"><strong>Final SPAM Score:</strong> ${finalSpamScore}</p>
        <p style="margin:0;"><strong>urlCountScore:</strong> ${urlCountScore}</p>
        <p style="margin:0;"><strong>nonLatinScore:</strong> ${nonLatinScore}</p>
        <p style="margin:0;"><strong>lengthScore:</strong> ${lengthScore}</p>
        <p style="margin:0;"><strong>headerAnomScore:</strong> ${headerAnomScore}</p>
        <p style="margin:0 0 8px 0;"><strong>mxMissingScore:</strong> ${mxMissingScore}</p>

        <p style="margin:0 0 4px 0;font-weight:bold;text-decoration:underline;"><strong>Message</strong></p>
        <div style="white-space:pre-wrap;word-break:break-word;">${msg}</div>

      </td></tr>
    </table>
  </td></tr>
</table>`.trim();

  // ===== Send =====
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  const subject = `New contact on ${subjectDate} from ${doc.name || "Unknown"}`;
  const replyTo = (typeof doc.email === "string" && doc.email.includes("@")) ? doc.email : undefined;

  await transporter.sendMail({ from: SMTP_FROM, to: SMTP_TO, ...(replyTo ? { replyTo } : {}), subject, html });
  return { ok: true };
};
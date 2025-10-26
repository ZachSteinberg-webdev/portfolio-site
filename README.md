Personal Portfolio Site

This is my production-grade personal portfolio website.  
It's intentionally small and fast, and it's deployed as a live production service (Express on Heroku + MongoDB Atlas + Cloudflare) — but it includes the kinds of security, abuse mitigation, reliability, and observability patterns you'd normally expect from a “real” app, not just a static portfolio.

---

## High-Level Overview

**Live stack**

- **Node.js / Express** web app
- **EJS** server-rendered views
- **MongoDB Atlas (Mongoose)** for persistence
- **Heroku** for hosting the Node.js app
- **Cloudflare** in front for caching / bot filtering / IP forwarding
- **Helmet** for security headers & Content Security Policy
- **Vanilla JS** on the client, with a no-JS fallback for accessibility

**Key features**

- Accessible, no-JavaScript fallback for all critical functionality
- Secure contact form with layered anti-spam defenses (no CAPTCHA)
- Privacy-aware abuse tracking (no raw IPs stored)
- Per-client rate limiting and permanent dedupe of repeated submissions
- Silent spam sink: bots always get “success,” but never reach me
- Automated daily SPAM digest email
- Automated real-time “new contact” email for legit submissions
- Session-based thank-you page to prevent abuse
- Server-side scoring & metadata for every submission for later triage
- CSP via Helmet to limit what the browser is allowed to execute

**Why this matters**  
Even though this is “just my portfolio,” the contact form behaves like a real production intake surface:

- It resists bots.
- It doesn't annoy humans.
- It preserves useful forensic signals (like recurring networks) without storing raw IP addresses.
- It gives me daily visibility into attempts.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Contact Form Flow](#contact-form-flow)
3. [Security & Abuse Resistance](#security--abuse-resistance)
   - [1. Rate Limiting](#1-rate-limiting)
   - [2. Permanent Deduping](#2-permanent-deduping)
   - [3. Stealth Spam Sink](#3-stealth-spam-sink)
   - [4. Content Scoring](#4-content-scoring)
   - [5. IP Privacy / Repeat Abuser Tracking](#5-ip-privacy--repeat-abuser-tracking)
   - [6. User Response Strategy](#6-user-response-strategy)
   - [7. Storage & Alerting](#7-storage--alerting)
   - [8. Security Headers / CSP](#8-security-headers--csp)
4. [Operational Notes](#operational-notes)
   - [Environment Variables / Secrets](#environment-variables--secrets)
   - [Cloudflare / Heroku / trust-proxy](#cloudflare--heroku--trust-proxy)
   - [Indexes in MongoDB](#indexes-in-mongodb)
   - [TTL / retention](#ttl--retention)
5. [What Makes This Interesting](#what-makes-this-interesting)

---

## Tech Stack

**Runtime / Server**

- **Node.js + Express**
  - Handles routing and middleware.
  - Uses `express-rate-limit` for abuse throttling.
  - Uses `express-session` with `connect-mongo` for session-backed redirects.

**Views**

- **EJS templates**
  - Most pages are server-rendered.
  - The contact form is present on the main page, not on a separate route.
  - JS progressively enhances it (AJAX submission) but the form also works without JS.

**Client-side**

- Minimal vanilla JavaScript (e.g. `contact.js`).
- AJAX path (`fetch('/contact', ...)`) and graceful no-JS form path are both supported.

**Database**

- **MongoDB Atlas**, accessed with **Mongoose** models:
  - `contactformsubmissions`: legit messages
  - `spamsubmissions`: rejected / suspicious traffic
  - `submissionfingerprints`: to detect duplicate submissions
- Atlas is also used for scheduled and trigger-based functions (Atlas Triggers).

**Infra**

- **Heroku**: runs the Node.js web server.
- **Cloudflare**: sits in front of Heroku. Helps with caching, provides the client IP via `cf-connecting-ip`, and can do request filtering.
- **Helmet**: sets security headers including CSP.

**Email notifications**

- The site does **not** rely on a local cron or background worker.
- Instead, email notifications are sent directly from **MongoDB Atlas Triggers** using `nodemailer` (SMTP with an app password).

---

## Contact Form Flow

The `/contact` POST route handles both:

- JavaScript-enabled submissions (`application/json`)
- No-JS fallback submissions (`application/x-www-form-urlencoded`)

Core steps:

1. **Rate limiting**: Only 1 submission per "client fingerprint" per hour (see below for what “client fingerprint” means).
2. **Permanent dedupe**: If the _same person_ has already submitted the _same message_, I silently accept but don't store/alert again.
3. **Spam screens**: Honeypot field, timing analysis, signature validation, JS handshake, header sanity.
4. **Scoring**: I compute a structured spam score bundle for observability.
5. **Storage**:
   - If considered legit: write to `contactformsubmissions`.
   - If considered spam/invalid: write to `spamsubmissions`.
6. **Response to the browser**:
   - Always polite and “successful.”
   - For no-JS users: redirect to a thank-you page gated by a short-lived session flag.

Result: Humans get through and get a nice UX. Bots think they got through. I still get signal.

---

## Security & Abuse Resistance

### 1. Rate Limiting

- I use `express-rate-limit` on `/contact` to enforce “1 submission per hour.”
- The **key** for rate limiting isn't just `req.ip`.

  - I build a “client fingerprint” that combines:
    - normalized IP/subnet (with IPv6 subnet masking),
    - `User-Agent`,
    - `Accept-Language`,
    - and `Accept` headers.
  - That fingerprint is hashed, so normal people behind shared networks (coffee shop WiFi, office VPN, etc.) don't instantly block each other unless they're literally acting the same.

- In production, I also support an override so I can test the live form without waiting an hour:

  - I set a secret env var like `CONTACT_TEST_NAME`.
  - If a submission comes in with `name === CONTACT_TEST_NAME`, the limiter `skip`s that request.
  - That bypass only applies in production, and only for that secret tester name. Everyone else still gets the normal limit.

- If the limiter fires:
  - For AJAX requests, in production, I respond `204 No Content` and show a friendly “please wait one hour before submitting the form again.” Bots don’t get a useful signal.
  - For non-JS form posts, I redirect with a `?status=rate_limited` flag so the UI can render a banner.

This prevents simple floods.

---

### 2. Permanent Deduping

Even if you're under the rate limit, you still only get to “really” contact me once per unique message.

How it works:

1. I canonicalize the incoming `(name, email, message)`:

   - Normalize Unicode.
   - Lowercase.
   - Collapse whitespace.
   - Strip Gmail `+tag`s and ignored dots.
   - For the message body, remove whitespace so `"hello   "` and `"hello"` hash the same.

2. I make a JSON array like:

   `[canonName, canonEmail, canonMsg]`

3. I SHA-256 hash that array and try to insert it into the `submissionfingerprints` collection, which has a unique index on that hash.

Outcome:

- If the insert succeeds, this is the first time I've seen this exact `(name + email + message)` trio. Continue.
- If MongoDB throws `E11000 duplicate key`, this is a repeat.
  - I **pretend success to the browser**.
  - I **do not** insert another record into `contactformsubmissions`.
  - I **do not** email myself again.

This completely destroys the “paste the same spam 100 times” pattern. It also prevents me from getting blasted with my own test messages while I'm debugging.

---

### 3. Stealth Spam Sink

Submissions are inspected for obvious bot behavior:

- **Honeypot field**  
  Each render injects a hidden input with a random name like `hp_3ec2ee94846b`. Real users never see it. Bots tend to fill every `<input>`.  
  If that field is non-empty, it's spam.

- **Minimum fill time**  
  The form includes a timestamp `t`. If the form comes back too quickly (for example, <4 seconds), I assume automation.  
  Bots that instantly POST are caught here.

- **Expired token**  
  That same timestamp has a max allowed age (stricter for AJAX than for plain form).  
  Super old tokens get treated as “expired / replay.”

- **HMAC signature**  
  The client also sends a signature `sig = HMAC(ip|t)` using a server secret.  
  If `sig` doesn't match what the server calculates for the client's IP and the timestamp, it's suspicious.

- **JavaScript handshake (for AJAX)**  
  The browser JS sets `js_ready = 1` before POSTing.  
  A headless bot hitting `/contact` as JSON usually won't.

- **Header sanity snapshot**  
  I record if the `User-Agent` length looks plausible, whether `Accept` looks like a real browser, whether `Sec-Fetch-*` headers are reasonable, etc.  
  Those aren’t hard-block rules (false positives exist), but they feed into scoring.

If a submission trips spam flags:

- I write it to the `spamsubmissions` collection (with metadata, scores, IP network/hash).
- I reply `200`/success-ish on the frontend. The bot “thinks” it got through.
- I don't send myself a “new contact” alert.  
  (But I _do_ see it in the daily SPAM digest email — see below.)

For no-JS users with an _expired_ token (not malicious, just slow), I redirect them with a status like `?status=expired` instead of silently junking them.

---

### 4. Content Scoring

Every submission (legit and spam) gets an internal score bundle, strictly for observation/triage:

- `urlCount`: How many `http(s)://` links are in the body?
- `length`: How long is the message?
- `nonLatinOnly`: Does the body contain no Latin letters at all?
- `headerAnom`: Did the request headers look like a real browser?
- `mxMissing`: Does the sender email domain actually publish MX records?

Each of those signals gets a weight.  
I sum them, clamp the result to 1–100, and store it as `final_spam_score`.

This score is **not** used to block humans live. It's stored with the submission so I can quickly sort/read it later.

---

### 5. IP Privacy / Repeat Abuser Tracking

I want to recognize repeat abusers and “same network keeps hitting me” patterns.  
I do **not** want to store raw IP addresses.

For each submission, I derive and store:

1. **`ipNetwork` (masked network)**

   - For IPv4: I zero out the last octet and append `/24`.  
     Example: `203.0.113.42` → `203.0.113.0/24`.
   - For IPv6: I zero out the lower 64 bits and append `/64`.  
     Example:  
     `2001:db8:1234:5678:abcd:ef12:3456:7890` → `2001:db8:1234:5678::/64`.
   - This groups submissions from “the same neighborhood” (same office, same VPN exit, same hosting block) without storing a full address.

2. **`ipHash` (salted HMAC of the exact IP)**
   - I compute `HMAC_SHA256(secretSalt, rawIp)`.
   - I store only the hex digest, not the IP.
   - This lets me say “this _exact_ source has contacted me 6 times / spammed me 12 times” without ever being able to reverse that hash back into the IP.

These live under:

    meta.client.ipNetwork
    meta.client.ipHash

in both `contactformsubmissions` and `spamsubmissions`.

**Indexes:**  
I create MongoDB indexes on both fields so I can do fast lookups and counts:

    db.contactformsubmissions.createIndex({ "meta.client.ipNetwork": 1 })
    db.contactformsubmissions.createIndex({ "meta.client.ipHash": 1 })
    db.spamsubmissions.createIndex({ "meta.client.ipNetwork": 1 })
    db.spamsubmissions.createIndex({ "meta.client.ipHash": 1 })

Those make it cheap for reporting code (like Atlas Triggers) to ask:

- “How often has this subnet sent legit messages?”
- “How often has this exact IP hash shown up in spam?”

Importantly:

- I never store or email myself the raw IP address.
- I only ever see the masked `/24` or `/64` and the salted hash.

---

### 6. User Response Strategy

There are two paths: AJAX (JS-enabled) and no-JS.

**AJAX path**

- The frontend JS does `fetch('/contact', ...)` with JSON.
- On success:
  - It clears the visible fields.
  - It updates the submit button text to a success message.
- If rate-limited in production, the server responds `204`, and the client updates the button text to "Please wait one hour before submitting the form again."

**No-JS path**

- The browser does a normal HTML form POST.
- On success, the server:
  - Sets `req.session.justContactedAt = Date.now()`,
  - Then `303` redirects to `/thank-you`.
- The `/thank-you` route only renders the thank-you message if that session flag was _just_ set (short window). Otherwise it redirects back home.
  - That means random GETs to `/thank-you` from bots won’t show “Thank you, I got your message,” unless they actually just submitted the form.

**Spam / rejected path**

- Bots/bad submissions also typically see a “success”-looking response (in production).
- I don't tell them "blocked as spam."
- They stop adapting.

This is intentional. The less signal I give an attacker, the less they tune their bot.

---

### 7. Storage & Alerting

#### Collections:

- `contactformsubmissions`

  - Legit messages that made it through.
  - Includes `name`, `email`, `message`, and a `meta` object with:
    - submission mode (`ajax` vs `form`),
    - token age,
    - header sanity snapshot,
    - MX result,
    - content scores,
    - network info (`meta.client.ipNetwork` / `ipHash`),
    - `final_spam_score`.

- `spamsubmissions`

  - Messages rejected by honeypot / invalid sig / etc.
  - Similar structure, plus a `flags` object that records _why_ it was flagged (`honeypot`, `tooFast`, `badSig`, etc.).

- `submissionfingerprints`
  - Just  
    `{ fp: <sha256 hash of canonicalized (name,email,message)> }`
  - Has a unique index so the same content can't flood me repeatedly.

#### MongoDB Atlas Triggers

I use **Atlas Triggers** (serverless functions running inside MongoDB) + `nodemailer` to send email alerts. There are two kinds:

1. **Real-time "New Contact" Alert**

   - Triggered on insert into `contactformsubmissions`.
   - Emails me immediately.
   - The email includes:
     - Message details (name, email, message, timestamp in my local time zone).
     - The `final_spam_score` and component scores.
     - Headers/metadata.
     - IP intelligence:
       - Masked IP network (`ipNetwork`)
       - How many times that network has shown up in legit submissions vs spam submissions
       - Hashed IP (`ipHash`)
       - How many times that exact hash has shown up in legit vs spam
   - This is how I spot "this might actually be legit" vs "this is just polite-looking spam from the same source I've seen 12 times."

2. **Daily SPAM Digest**
   - Scheduled trigger (runs every morning in my timezone via Atlas's scheduler).
   - Queries every `spamsubmissions` doc created in the last 24 hours.
   - Builds an HTML email that includes, for each spam attempt:
     - Timestamp in my timezone
     - Submitted name/email/message
     - All scoring breakdowns
     - Honeypot / signature / tooFast flags
     - IP network and hash, plus how often those appear elsewhere
   - If there were **no** spam attempts in the last 24h, it emails:  
     "No new SPAM emails received in the last 24 hours."

This gives me visibility without me having to open MongoDB manually every day.

---

### 8. Security Headers / CSP

The app uses `helmet` to set security headers, including a custom Content Security Policy (`Content-Security-Policy`) tuned for this site.

Highlights:

- Only allow scripts from my own origin.
- Block inline `<script>` unless explicitly allowed (or unless a nonce is applied).
- Disallow loading fonts/scripts/styles from random CDNs.
- SVGs are served as static `<img src="/.../file.svg">`, not inline `<svg>...</svg>`, so I don't need to allow `unsafe-inline` styles for them.
- Set `Cache-Control: no-store` on sensitive responses like POST `/contact`, so intermediaries (including Cloudflare) won't accidentally cache private data.

This reduces the site's attack surface (XSS, data leakage, etc.) even though it's “just a portfolio.”

---

## Operational Notes

### Environment Variables / Secrets

Key env vars (examples/intent):

- `MONGO_URI`: MongoDB Atlas connection string.
- `SESSION_SECRET`: Secret used by `express-session` for signing cookies.
- `FORM_HMAC_SECRET`: Secret used to sign `(ip|timestamp)` so that forged submissions can be detected.
- `CONTACT_FORM_MIN_FILL_TIME_MS`: Minimum time (ms) between render and submit to consider it human.
- `CONTACT_FORM_MAX_AGE_AJAX_MS`: Max allowed token age for JS submissions.
- `CONTACT_FORM_MAX_AGE_FORM_MS`: Max allowed token age for no-JS form submissions.
- `CONTACT_FORM_RATE_LIMITER_WINDOW_MS`: Rate limit window (ms), e.g. 3600000 for 1 hour.
- `CONTACT_FORM_RATE_LIMITER_MAX_IN_WINDOW`: How many submissions per window (usually 1).
- `RATE_LIMIT_IPV6_SUBNET`: How aggressively to mask IPv6 for rate limit keys (e.g. `/64`).
- `IP_HASH_SALT`: Secret used to HMAC the raw IP into `meta.client.ipHash`.
- `CONTACT_TEST_NAME`: Secret tester name that bypasses rate limiting (production only).
- SMTP credentials (host, port, user, pass, from, to) are stored as Values/Secrets in MongoDB Atlas App Services for the trigger code that sends email.

### Cloudflare / Heroku / `trust proxy`

- The app runs behind Cloudflare (and then Heroku), so Express can't just trust `req.ip` blindly.
- I call `app.set('trust proxy', 2)` in production so Express will respect `cf-connecting-ip` / `x-forwarded-for` headers and give me the actual client IP instead of Cloudflare's edge IP.
- On the server, I derive `ipNetwork` and `ipHash` from that resolved client IP, but I never store the raw IP itself.

### Indexes in MongoDB

To make the reporting emails fast (and to keep Atlas Triggers cheap), I index the IP summary fields:

    db.contactformsubmissions.createIndex({ "meta.client.ipNetwork": 1 })
    db.contactformsubmissions.createIndex({ "meta.client.ipHash": 1 })
    db.spamsubmissions.createIndex({ "meta.client.ipNetwork": 1 })
    db.spamsubmissions.createIndex({ "meta.client.ipHash": 1 })

Those indexes let me quickly answer questions like:

- "How many spam messages in the last 24h came from this masked /24?"
- "Has this exact IP hash ever sent a legitimate message?"

Without the indexes, Atlas Triggers would have to full-scan the collections every time they build the email.

### TTL / Retention

Right now, spam stays in `spamsubmissions` indefinitely.  
If/when that grows large, I can add a TTL index (e.g. expire after 90 days) so older `spamsubmissions` documents automatically roll off. I intentionally did **not** enable TTL yet so I have historical data for tuning, but it’s an easy future toggle.

---

## What Makes This Interesting

This repo isn't just “here’s my portfolio.” It's a working example of how I think about production surfaces:

- **No CAPTCHA / low-friction UX**  
  Real humans don’t have to prove they’re not bots, solve puzzles, or find traffic lights in a grid of blurry images.

- **Defense in depth**  
  I'm not relying on one trick. I layer:

  - honeypot
  - timing
  - token age
  - signed HMAC of `(ip|timestamp)`
  - header sanity
  - JS handshake
  - rate limiting
  - permanent dedupe
  - and silent sink behavior

  Each layer either quietly drops garbage or feeds into observability.

- **Privacy-aware telemetry**  
  I track repeat abusive sources using masked subnets and salted hashes, not raw IP addresses.  
  That gives me operational awareness (is this the same spammer?) without collecting more personal data than I actually need.

- **Operational visibility**  
  I get:

  - immediate email alerts for new legit submissions (with context),
  - a daily spam digest with scoring and network intelligence,
  - and I can cross-check “did this network ever send a real message?” right inside those emails.

- **Graceful fallbacks**  
  The entire thing works with or without JavaScript:

  - With JS: AJAX submit, inline button feedback.
  - Without JS: classic form POST, 303 redirect to a gated `/thank-you`.
  - Both paths go through the same anti-spam checks on the server.

- **Cloudflare + Heroku + Atlas + Helmet**  
  I'm treating this like a deployed service, not a toy. It sits behind a CDN, understands proxy IP forwarding, uses server-side session flags to avoid spoofed “thank you” pages, locks down CSP, and pushes telemetry emails from Atlas itself (so I don’t need a background worker app).

In other words: this is a personal site that behaves like production software.

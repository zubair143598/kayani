# Kayani Towing Service

Next.js App Router / TypeScript website, using the supplied English and Arabic content. Custom vector logo and truck illustration are in `public/`. The original HTML is untouched.

## Run locally

Requires Node.js 20.19+ (Node.js 22 or 24 recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3017. Run `npm run build` then `npm start` for production. Use a Node-capable Next.js host; static export cannot run the contact API.

## Configure contact delivery

An uncommitted `.env.local` template is included. Fill in:

- `MONGODB_URI`: your MongoDB URI, including a database name such as `kayani_towing_service`. Allow the deployment server in your MongoDB network access settings.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`: your SMTP provider settings. Gmail defaults are supplied (port 465, secure true). For port 587 set secure false; STARTTLS is negotiated.
- `SMTP_USER`, `SMTP_PASS`: your SMTP login. For Gmail, enable 2-step verification and create a Google App Password. Use that app password, not your normal login password.
- `SMTP_FROM`: your verified sender address, usually the same as SMTP_USER.
- `SITE_URL`: the exact site origin, such as https://your-domain.com (no path). Restart the server after changing environment variables.

The recipient is fixed server-side to **md.zubair33759@gmail.com**. MongoDB credentials alone do not enable email. Keep secrets out of Git and never use NEXT_PUBLIC_ variables for them.

## Contact flow

`POST /api/contact` in `src/app/api/contact/route.ts` validates and limits the JSON body, checks browser origin, applies a persistent limit of three submissions per email per 15-minute window, and stores the enquiry with Mongoose. Nodemailer then emails its details, with the visitor's address as Reply-To. Email acceptance by SMTP is reported as success; inbox placement depends on the provider. Missing configuration returns 503. Failed email returns 502 with `saved: true`; the UI directs the visitor to call/WhatsApp. Records have `pending`, `sent`, or `failed` email status. There is no automatic resend job; inspect failed records operationally.

The honeypot and email rate limit are baseline abuse controls, not a substitute for deployment-level rate limiting or CAPTCHA if the public form is targeted. The API does not expose stored enquiries. Set an appropriate retention policy for contact records.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

English/Arabic language selection persists locally. Anchor links scroll smoothly; reduced-motion preferences disable smooth scrolling and animations. Phone and WhatsApp links retain their native actions. Google Fonts have local system fallbacks.

Reference documentation: [Next.js route handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [Mongoose connections](https://mongoosejs.com/docs/connections.html), [Nodemailer SMTP](https://nodemailer.com/smtp).

## Verification in this session

Production compilation, TypeScript validation and static generation passed. Three automated tests passed, including mocked SMTP success/failure, database persistence, origin checks, request limits and validation. Live MongoDB and SMTP were not tested because credentials are not supplied. Browser visual verification was blocked by the session's preview launch approval policy.

The environment restricts child processes. Checks used `node work/run-tests.cjs`, `node node_modules/typescript/bin/tsc --noEmit`, and a production build with `LOCAL_CHECK_THREADS=1`. The optional environment setting switches Next.js to thread workers and the TypeScript API checker without skipping checks. Standard npm commands are provided for your own terminal.

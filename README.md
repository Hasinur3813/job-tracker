# চাকরি ট্র্যাকার (Chakri Tracker)

A calm, Bengali-first job application tracker. Keep every government and
private-sector application — deadlines, portal credentials, salary and status —
in one place.

## Features

- **Dashboard** — greeting, live stats, next-deadline highlight, search, sort and filters.
- **Deadline intelligence** — Bengali dates and color-coded urgency (`আজই শেষ দিন`, `৩ দিন বাকি · জরুরি`, `মেয়াদ শেষ`).
- **Application detail** — at-a-glance info card, inline status change, portal login vault, notes.
- **File attachments** — attach PDFs or images while adding/editing a job, then view and download them later. Uploads use signed Cloudinary requests and per-user folders.
- **Google sign-in** and **email/password** auth, plus a user-enumeration-safe password reset flow.
- **Portal credentials vault** — per-field copy and show/hide, only for government applications.
- **PWA manifest**, responsive layouts, accessible forms, Bengali validation messages.

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
Firebase Auth + Firestore · react-hook-form + Zod · motion · lucide-react ·
react-hot-toast.

> This project uses a newer Next.js release with breaking changes. Read the
> bundled guides in `node_modules/next/dist/docs/` before changing framework code.

## Getting started

```bash
npm install
cp .env.example .env      # fill in your Firebase web-app values
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore project id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender id |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics id (optional) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata (optional) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (server only) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret — server only, never expose to the browser |
| `CLOUDINARY_FOLDER` | Folder prefix for uploaded files (defaults to `job-tracker`) |

## Firebase setup

1. **Create a project** and add a web app; copy the config into `.env`.
2. **Authentication → Sign-in method**: enable **Email/Password** and **Google**.
3. **Authentication → Settings → Authorized domains**: add `localhost` and your
   production domain (e.g. `your-app.web.app`).
4. **Password reset email**: review *Authentication → Templates → Password reset*.
   The generated link returns users to the app; they can then sign in with the new password.
5. **Firestore rules**: create the database, then paste [`firestore.rules`](./firestore.rules)
   into *Firestore Database → Rules* and publish, or run
   `firebase deploy --only firestore:rules`. It restricts every user to their
   own `users/{uid}/**` documents.

Signing in with Google (or email/password) creates or updates a
`users/{uid}/profile/main` profile containing the display name, email, photo
URL, providers, and last login time. The app reads `users/{uid}/jobs` with a
single unfiltered collection subscription and sorts/filters on the client, so no
composite index is needed.

## Cloudinary setup (job attachments)

1. Create a Cloudinary account and copy the cloud name, API key, and API secret
   into `.env` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
   `CLOUDINARY_API_SECRET`.
2. Set `CLOUDINARY_FOLDER` to your preferred root prefix (for example
   `job-tracker` or `rs-decor`).

The browser never receives the Cloudinary API secret. It asks
`app/api/attachments/sign` for a short-lived signature, verifies the Firebase
session, and uploads a **private** asset directly to Cloudinary. Files are stored
under `<CLOUDINARY_FOLDER>/users/<uid>`. Viewing and downloading use
`app/api/attachments/link`, which verifies the Firebase session, checks the
file belongs to the caller, and returns a signed link that expires after 15
minutes. This keeps PDFs private and works even when public PDF/ZIP delivery is
disabled. The delete route only accepts file ids inside the caller's own folder;
removing a job (or removing an attachment while editing) also deletes the file
from Cloudinary on a best-effort basis.

## Security notes

- Authentication is handled by Firebase; each user can only read and write their
  own profile and job documents under `users/{uid}`.
- Portal credentials are stored **as entered** in the user's private Firestore
  document. They are **not** end-to-end encrypted — never share them, and only
  store credentials you own.
- Attachments are stored as private Cloudinary assets. The browser only receives
  short-lived signed download links after Firebase authentication; it never
  receives the API secret. A shared signed link works until it expires, so treat
  generated links as sensitive. Files are not end-to-end encrypted at rest.
- Data is scoped per account; deleting the account does not automatically delete
  its Firestore documents. Remove `users/{uid}` and their Cloudinary folder
  manually if needed.

## Scripts

```bash
npm run dev      # Turbopack dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Project structure

```
app/
  api/attachments/      signed Cloudinary upload, link + delete
  auth/                 login, register, forgot-password
  dashboard/            stats, search, filters, job grid
  job/new, job/[id]     create, detail, edit
  components/
    auth/ brand/ dashboard/ job/ layout/ ui/
lib/
  cloudinary/           server-only config, signatures, token verification
  constants/            category + status configs
  contexts/             AuthContext (email, Google, reset)
  firebase/             config + Bengali error mapping
  hooks/                useAuth, useJobs, useJobMutations
  types/                JobAttachment type
  utils/                attachments, Bengali digits, deadlines, clipboard, navigation
  validation/           Zod job schema
```

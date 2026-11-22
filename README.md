# চাকরি ট্র্যাকার (Chakri Tracker)

A calm, Bengali-first job application tracker. Keep every government and
private-sector application — deadlines, portal credentials, salary and status —
in one place.

## Features

- **Dashboard** — greeting, live stats, next-deadline highlight, search, sort and filters.
- **Deadline intelligence** — Bengali dates and color-coded urgency (`আজই শেষ দিন`, `৩ দিন বাকি · জরুরি`, `মেয়াদ শেষ`).
- **Application detail** — at-a-glance info card, inline status change, portal login vault, notes.
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

## Firebase setup

1. **Create a project** and add a web app; copy the config into `.env`.
2. **Authentication → Sign-in method**: enable **Email/Password** and **Google**.
3. **Authentication → Settings → Authorized domains**: add `localhost` and your
   production domain (e.g. `your-app.web.app`).
4. **Password reset email**: review *Authentication → Templates → Password reset*.
   The generated link returns users to the app; they can then sign in with the new password.
5. **Firestore rules**: create the database, then paste [`firestore.rules`](./firestore.rules)
   into *Firestore Database → Rules* and publish. It restricts every user to
   their own `users/{uid}/**` documents.

The app reads `users/{uid}/jobs` with a single unfiltered collection
subscription and sorts/filters on the client, so no composite index is needed.

## Security notes

- Authentication is handled by Firebase; each user can only read and write their
  own documents under `users/{uid}`.
- Portal credentials are stored **as entered** in the user's private Firestore
  document. They are **not** end-to-end encrypted — never share them, and only
  store credentials you own.
- Data is scoped per account; deleting the account does not automatically delete
  its Firestore documents. Remove `users/{uid}` manually if needed.

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
  auth/                 login, register, forgot-password
  dashboard/            stats, search, filters, job grid
  job/new, job/[id]     create, detail, edit
  components/
    auth/ brand/ dashboard/ job/ layout/ ui/
lib/
  constants/            category + status configs
  contexts/             AuthContext (email, Google, reset)
  firebase/             config + Bengali error mapping
  hooks/                useAuth, useJobs, useJobMutations
  utils/                Bengali digits, deadlines, clipboard, navigation
  validation/           Zod job schema
```

# Firebase Setup — meraki-92e3f

The storefront is wired for Firebase Authentication and Firestore. It stays
fully usable while the project is unconfigured: `/men` and `/women` fall back to
the bundled catalog and the Client drawer shows a setup notice.

## Current status

| Piece | State |
| --- | --- |
| Web app `meraki-web` | Registered (`1:835729962666:web:59f675bf3660f484db02d3`) |
| `.env.local` web config | Written |
| Firestore `products` | Seeded — 8 documents (4 MEN / 4 WOMEN) |
| Firestore rules | Deployed to `projects/meraki-92e3f/releases/cloud.firestore` |
| Authentication providers | **Not provisioned yet** — see below |

## 1. Web app config

The app was registered through the Management API and the resulting config was
written to `.env.local`. To repeat or refresh it:

```powershell
npm run register:web-app
```

`NEXT_PUBLIC_*` values are inlined at build time, so rebuild after changing
`.env.local`.

## 2. Enable Authentication providers (remaining step)

Firebase Authentication is not provisioned for this project yet. Every Identity
Toolkit admin endpoint returns `CONFIGURATION_NOT_FOUND`, and the programmatic
initialization endpoint refuses with:

```
BILLING_NOT_ENABLED : Identity Platform feature requires billing to be enabled.
```

Enabling Authentication from the Console does **not** require billing, so this
one step must be done in the UI:

1. Firebase Console → **Authentication** → **Get started**.
2. **Email/Password** → enable.
3. **Google** → enable, choose a support email.
4. **Phone** → enable. Phone sign-in needs reCAPTCHA and, in some regions, the
   Blaze plan.
5. **Authentication → Settings → Authorized domains** — `localhost` is present
   by default; add the production domain.

After the Console provisions Auth, the Client drawer flows work immediately; no
code or config changes are needed. Until then the app reports
`auth/operation-not-allowed` in the drawer.

## 3. Firestore and rules

The rules make `products` world-readable and writable only by the Admin SDK,
and keep `users/{uid}` private to its owner. Deploy them with the service
account (the Firebase CLI account currently lacks project access):

```powershell
npm run deploy:rules
```

The script uses the Firebase Rules API directly because `firebase deploy` needs
`serviceusage.services.use`, which the service account does not have.

## 4. Seed the catalog

Generate a service account key: **Project settings** → **Service accounts** →
**Generate new private key**. Store it outside the repository and point the seed
script at it:

```dotenv
FIREBASE_SERVICE_ACCOUNT_KEY="C:\path\to\meraki-92e3f-service-account.json"
```

Preview, then write:

```powershell
npm run seed:products -- --dry-run
npm run seed:products
```

The script upserts the 8 products from `lib/collection.ts` into the `products`
collection using their existing IDs, so `/canvas` outfit links keep working.
It is idempotent — re-running it updates the same documents.

## 5. Restart

```powershell
npm run build
npm run start
```

`/men` and `/women` show `· LIVE` next to the collection label when the data
comes from Firestore. `· LOCAL` means the bundled fallback is in use.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run register:web-app` | Create/reuse the `meraki-web` app and write `.env.local` |
| `npm run deploy:rules` | Deploy `firestore.rules` via the Rules API |
| `npm run seed:products` | Upsert `lib/collection.ts` into Firestore `products` |

All three read `FIREBASE_SERVICE_ACCOUNT_KEY` from `.env.local`. Keep the key
file out of version control — `.gitignore` already covers
`*firebase-adminsdk*.json` and `meraki-92e3f-*.json`.

## CLI access

The currently signed-in Firebase CLI account (`komahudu@gmail.com`) receives
`403 PERMISSION_DENIED` for `meraki-92e3f`. The service-account scripts above
work around it for management, rules, and seeding. To use the CLI directly,
either grant that account access to the project or sign in with the owning
account:

```powershell
npx -y firebase-tools@latest login --reauth
```

Quick Firebase env helper

This file shows how to create Vercel-ready environment variable values from a
Firebase service account JSON file you downloaded.

1) Place your downloaded JSON somewhere safe (for example `backend/service-account.json`).

2) Run the helper script to print two options:

```bash
cd backend
node encode-firebase-env.js ../bloomoraskin-7c32e-firebase-adminsdk-fbsvc-4fa8c94b87.json
```

Output includes:
- A single-line JSON string suitable for `FIREBASE_ADMIN_CREDENTIALS`.
- Individual fields for `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (with newlines escaped as `\n`).

3) In your Vercel dashboard (project → Settings → Environment Variables) add either:
- Key: `FIREBASE_ADMIN_CREDENTIALS` → Value: (paste the full JSON string printed by the script)

OR

- Keys:
  - `FIREBASE_PROJECT_ID` → value printed by the script
  - `FIREBASE_CLIENT_EMAIL` → value printed by the script
  - `FIREBASE_PRIVATE_KEY` → value printed by the script (ensure `\n` sequences are preserved)

Security notes
- Never commit the JSON or the `.env` containing secrets to version control.
- Use Vercel environment variables (or a secrets manager) to store these values.

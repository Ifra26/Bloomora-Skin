const admin = require('firebase-admin');
const fs = require('fs');

function getFirebaseCredential() {
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    const raw = process.env.FIREBASE_ADMIN_CREDENTIALS;
    const parsed = JSON.parse(raw);
    return admin.credential.cert(parsed);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return admin.credential.applicationDefault();
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });
  }

  throw new Error(
    'Firebase credentials not configured. Set FIREBASE_ADMIN_CREDENTIALS, GOOGLE_APPLICATION_CREDENTIALS, or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.'
  );
}

admin.initializeApp({
  credential: getFirebaseCredential()
});

const firestore = admin.firestore();

module.exports = { admin, firestore };

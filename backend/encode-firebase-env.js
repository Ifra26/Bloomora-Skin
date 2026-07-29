const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node encode-firebase-env.js <path-to-service-account.json>');
  process.exit(1);
}

const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
if (!fs.existsSync(abs)) {
  console.error('File not found:', abs);
  process.exit(1);
}

const raw = fs.readFileSync(abs, 'utf8');
let obj;
try {
  obj = JSON.parse(raw);
} catch (err) {
  console.error('Invalid JSON:', err.message);
  process.exit(1);
}

// Minified JSON value for FIREBASE_ADMIN_CREDENTIALS
const adminCreds = JSON.stringify(obj);

// PRIVATE KEY escaped for FIREBASE_PRIVATE_KEY (replace newlines with \n)
const privateKeyEscaped = (obj.private_key || '').replace(/\n/g, '\\n');

console.log('\n--- FIREBASE_ADMIN_CREDENTIALS (paste whole value into Vercel) ---\n');
console.log(adminCreds);

console.log('\n--- Or use individual env vars (paste values into Vercel) ---\n');
console.log(`FIREBASE_PROJECT_ID=${obj.project_id}`);
console.log(`FIREBASE_CLIENT_EMAIL=${obj.client_email}`);
console.log(`FIREBASE_PRIVATE_KEY=${privateKeyEscaped}`);

console.log('\n--- Notes ---');
console.log('- Do NOT commit these secrets to your git repository.');
console.log('- In Vercel, add the appropriate environment variables under the project settings.');
console.log('- Use the minified JSON for `FIREBASE_ADMIN_CREDENTIALS` or the individual fields shown above.');
console.log('');

import admin from "firebase-admin";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // load from .env file, optional if you want

// Your Firebase service account info from environment variables or direct JSON here
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com",
};

// Initialize Firebase Admin app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const expiresAt = new Date("2025-10-18T00:00:00Z").getTime();
const createdAt = Date.now();

function generateToken(length = 12) {
  return crypto.randomBytes(length).toString("hex");
}

async function saveToken(tableId) {
  const token = generateToken();
  const createdAt = Date.now(); // move inside here

  const tokenData = {
    createdAt,
    expiresAt,
    used: false,
  };

  await admin.database().ref(`tokens/${tableId}/${token}`).set(tokenData);

  console.log(`Token ${token} saved for table ${tableId} with expiry at ${new Date(expiresAt).toISOString()}`);
  return token;
}


// Run the generate and save for table1
saveToken("table1").catch(console.error);

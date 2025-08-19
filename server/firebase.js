// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-key.json"); // path to downloaded key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://presentation3d-12c49-default-rtdb.firebaseio.com/" // replace with your DB URL
});

const db = admin.database(); // Realtime Database
// OR for Firestore: const db = admin.firestore();

module.exports = db;

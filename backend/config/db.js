const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "surewalk link" // TODO: Replace with link
  });

const db = admin.firestore();
const auth = admin.auth();
const rtdb = admin.database();

module.exports = {
    admin,
    db,
    auth,
    rtdb
};


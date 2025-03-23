const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sure-walk-webapp.firebaseio.com"
  });

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
    admin,
    db,
    auth
};
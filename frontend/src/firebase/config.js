// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDM1JIyUWxKevhB4mKZ24cnZzfEXmSr90Q",
  authDomain: "sure-walk-webapp.firebaseapp.com",
  projectId: "sure-walk-webapp",
  storageBucket: "sure-walk-webapp.firebasestorage.app",
  messagingSenderId: "703291158701",
  appId: "1:703291158701:web:85a79ad99bac6832a51624",
  measurementId: "G-EZ1SJ7NRZ3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up RecaptchaVerifier
  function setupRecaptcha(containerOrId) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerOrId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    return window.recaptchaVerifier;
  }

  // Sign in with phone number
  async function signInWithPhone(phoneNumber, appVerifier) {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async function verifyOtp(otp) {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      // Check if user exists in database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // New user, set default role as rider
        await setDoc(doc(db, 'users', user.uid), {
          phoneNumber: user.phoneNumber,
          role: 'rider',
          createdAt: new Date(),
        });
        setUserRole('rider');
      } else {
        setUserRole(userDoc.data().role);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Log out
  function logout() {
    return signOut(auth);
  }

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Get user role from database
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    setupRecaptcha,
    signInWithPhone,
    verifyOtp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
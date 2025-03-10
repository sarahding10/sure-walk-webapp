import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  function setupRecaptcha(containerId) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible'
    });
    return recaptchaVerifier;
  }

  async function signInWithPhone(phoneNumber, recaptchaVerifier) {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    setConfirmationResult(confirmation);
    return confirmation;
  }

  async function verifyOtp(otp) {
    if (!confirmationResult) throw new Error('No confirmation result found');
    return await confirmationResult.confirm(otp);
  }

  // Create or update user profile in Firestore
  async function updateUserProfile(userData) {
    if (!currentUser) throw new Error('No authenticated user');
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new user
      await setDoc(userRef, {
        phoneNumber: currentUser.phoneNumber,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return userRef;
  }

  // Get user profile from Firestore
  async function getUserProfile() {
    if (!currentUser) return null;
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    
    return null;
  }

  const value = {
    currentUser,
    setupRecaptcha,
    signInWithPhone,
    verifyOtp,
    updateUserProfile,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
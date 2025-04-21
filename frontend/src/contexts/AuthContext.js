import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged,
  updateProfile
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
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Fetch the user profile from the backend
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If profile doesn't exist yet, that's ok
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function fetchWithAuth(endpoint, options = {}) {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const token = await currentUser.getIdToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response.json();
  }
  
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
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(userRef, {
        phoneNumber: currentUser.phoneNumber,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  
    // ✅ Also update Firebase Auth profile
    await updateProfile(currentUser, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });
  
    // Optionally re-fetch Firestore profile into context state
    const updatedProfile = await getUserProfile();
    setUserProfile(updatedProfile);
  
    return updatedProfile;
  }
  

  // Get user profile from Firestore
  async function getUserProfile() {
    if (!currentUser) return null;
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    console.log('User snapshot:', userSnap.data());
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    
    return null;

    // try {
    //   const response = await fetchWithAuth('/auth/profile');
    //   return response.userProfile;
    // } catch (error) {
    //   console.error('Error fetching user profile:', error);
    //   return null;
    // }
  }

  async function getPreviousRides() {
    return await fetchWithAuth('/rider/rides');
  }
  
  async function createRideRequest(pickupLocation, dropoffLocation) {
    return await fetchWithAuth('/rider/request', {
      method: 'POST',
      body: JSON.stringify({
        pickupLocation,
        dropoffLocation
      })
    });
  }
  
  async function getRiderStatus() {
    return await fetchWithAuth('/rider/status');
  }
  
  async function cancelRide(rideId) {
    return await fetchWithAuth(`/rider/cancel/${rideId}`, {
      method: 'DELETE'
    });
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    setupRecaptcha,
    signInWithPhone,
    verifyOtp,
    updateUserProfile,
    getUserProfile,
    // Add ride-related functions
    getPreviousRides,
    createRideRequest,
    getRiderStatus,
    cancelRide
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider, hasValidFirebaseKeys } from '../config/firebase';
import { MOCK_CURRENT_USER } from '../services/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [phoneConfirmation, setPhoneConfirmation] = useState(null);

  const generateTag = () => Math.floor(1000 + Math.random() * 9000).toString();

  const ensureUserProfile = async (user, additionalData = {}) => {
    if (!hasValidFirebaseKeys) return MOCK_CURRENT_USER;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const existingData = userSnap.data();
        await updateDoc(userDocRef, { online: true });
        const updatedUser = { uid: user.uid, ...existingData, online: true };
        setCurrentUser(updatedUser);
        return updatedUser;
      } else {
        const baseName = user.displayName || user.email?.split('@')[0] || user.phoneNumber || 'Aura User';
        const newUserData = {
          uid: user.uid,
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          displayName: baseName,
          username: baseName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          tag: generateTag(),
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          bio: 'vibing on Aura ✨',
          status: 'In the flow ☕',
          online: true,
          createdAt: new Date().toISOString(),
          ...additionalData
        };
        await setDoc(userDocRef, newUserData);
        setCurrentUser(newUserData);
        return newUserData;
      }
    } catch (err) {
      console.warn('Firestore profile sync note:', err);
      const fallbackUser = {
        uid: user.uid,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        displayName: user.displayName || 'Aura User',
        username: 'aura_user',
        tag: '8888',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        bio: 'vibing on Aura ✨',
        status: 'In the flow ☕',
        online: true,
      };
      setCurrentUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    if (!hasValidFirebaseKeys) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureUserProfile(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Email Sign Up
  const signupWithEmail = async (email, password, displayName) => {
    setAuthError(null);
    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });
      const profile = await ensureUserProfile(res.user, { displayName });
      return profile;
    } catch (err) {
      if (err.code === 'auth/api-key-not-valid' || err.message.includes('api-key')) {
        setAuthError('Firebase API key missing. Create a .env file with your Firebase credentials or click Demo Mode below.');
      } else {
        setAuthError(err.message);
      }
      throw err;
    }
  };

  // 2. Email Login
  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const profile = await ensureUserProfile(res.user);
      return profile;
    } catch (err) {
      if (err.code === 'auth/api-key-not-valid' || err.message.includes('api-key')) {
        setAuthError('Firebase API key missing. Create a .env file with your Firebase credentials or click Demo Mode below.');
      } else {
        setAuthError(err.message);
      }
      throw err;
    }
  };

  // 3. Google Sign-In
  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await ensureUserProfile(res.user);
      return profile;
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          setAuthError('Pop-up window was blocked by your browser.');
        }
      } else if (err.code === 'auth/api-key-not-valid' || err.message.includes('api-key')) {
        setAuthError('Firebase API key missing. Create a .env file with your Firebase credentials or click Demo Mode below.');
      } else {
        setAuthError(err.message);
      }
      throw err;
    }
  };

  // 4. Facebook Sign-In
  const loginWithFacebook = async () => {
    setAuthError(null);
    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      const profile = await ensureUserProfile(res.user);
      return profile;
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, facebookProvider);
          return;
        } catch (redirectErr) {
          setAuthError('Pop-up window was blocked by your browser.');
        }
      } else if (err.code === 'auth/api-key-not-valid' || err.message.includes('api-key')) {
        setAuthError('Firebase API key missing. Create a .env file with your Firebase credentials or click Demo Mode below.');
      } else {
        setAuthError(err.message);
      }
      throw err;
    }
  };

  // 5. Setup Invisible Recaptcha
  const setupRecaptcha = (containerId = 'recaptcha-container') => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {},
      });
    }
    return window.recaptchaVerifier;
  };

  // 6. Send Phone OTP
  const sendPhoneOtp = async (phoneNumber) => {
    setAuthError(null);
    if (!hasValidFirebaseKeys) {
      setPhoneConfirmation({ confirm: async () => MOCK_CURRENT_USER });
      return;
    }
    try {
      const verifier = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setPhoneConfirmation(confirmationResult);
      return confirmationResult;
    } catch (err) {
      if (err.code === 'auth/api-key-not-valid' || err.message.includes('api-key')) {
        setAuthError('Firebase API key missing. Create a .env file with your Firebase credentials or click Demo Mode below.');
      } else {
        setAuthError(err.message);
      }
      throw err;
    }
  };

  // 7. Verify Phone OTP
  const verifyPhoneOtp = async (otpCode) => {
    setAuthError(null);
    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }
    if (!phoneConfirmation) {
      throw new Error('No phone OTP confirmation request found.');
    }
    try {
      const res = await phoneConfirmation.confirm(otpCode);
      const profile = await ensureUserProfile(res.user);
      setPhoneConfirmation(null);
      return profile;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Enter Demo Sandbox Mode
  const enterDemoSandbox = () => {
    setCurrentUser(MOCK_CURRENT_USER);
  };

  // Sign Out
  const logout = async () => {
    if (currentUser?.uid && hasValidFirebaseKeys) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { online: false });
      } catch (e) {}
      await firebaseSignOut(auth);
    }
    setCurrentUser(null);
  };

  // Update User Profile
  const updateUserProfile = async (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    if (currentUser?.uid && hasValidFirebaseKeys) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
      } catch (err) {
        console.error('Failed to update profile in Firestore:', err);
      }
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    phoneConfirmation,
    hasValidFirebaseKeys,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    sendPhoneOtp,
    verifyPhoneOtp,
    enterDemoSandbox,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

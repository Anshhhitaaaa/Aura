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
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

  // Helper to ensure a unique username in Firestore
  const generateUniqueUsername = async (rawName, userTag) => {
    let base = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15) || 'user';
    if (base.length < 3) base = `user_${base}`;

    const candidate = `${base}_${userTag}`;
    return candidate;
  };

  const formatAuthError = (err) => {
    const code = err?.code || '';
    if (code === 'auth/user-not-found') {
      return 'No account found with this email/username. Please check your spelling or Sign Up.';
    }
    if (code === 'auth/wrong-password') {
      return 'Incorrect password. Please double-check your password.';
    }
    if (code === 'auth/invalid-credential') {
      return 'Invalid login details. Please check your email/username and password.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please Sign In instead.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/weak-password') {
      return 'Password must be at least 6 characters long.';
    }
    if (code === 'auth/api-key-not-valid' || err.message?.includes('api-key')) {
      return 'Firebase API key missing. Create a .env file with your Firebase credentials or click Demo Mode below.';
    }
    return err.message || 'An error occurred during authentication.';
  };

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
        const userTag = generateTag();
        const baseName = additionalData.displayName || user.displayName || user.email?.split('@')[0] || user.phoneNumber || 'Aura User';
        
        let finalUsername = additionalData.username 
          ? additionalData.username.toLowerCase().replace(/[^a-z0-9_]/g, '')
          : await generateUniqueUsername(baseName, userTag);

        const newUserData = {
          uid: user.uid,
          email: (user.email || '').toLowerCase().trim(),
          phoneNumber: user.phoneNumber || '',
          displayName: baseName,
          username: finalUsername,
          tag: userTag,
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
        email: (user.email || '').toLowerCase().trim(),
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

  // 1. Email Sign Up with Unique Username Check
  const signupWithEmail = async (emailInput, password, displayName, customUsername) => {
    setAuthError(null);
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanUsername = customUsername ? customUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') : '';

    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }

    try {
      // Check username availability in Firestore if provided
      if (cleanUsername) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', cleanUsername));
        const snap = await getDocs(q);
        if (!snap.empty) {
          throw new Error(`Username @${cleanUsername} is already taken. Please choose a different username.`);
        }
      }

      const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (displayName) {
        await updateProfile(res.user, { displayName });
      }
      const profile = await ensureUserProfile(res.user, { 
        displayName, 
        username: cleanUsername || undefined 
      });
      return profile;
    } catch (err) {
      setAuthError(formatAuthError(err));
      throw err;
    }
  };

  // 2. Email or Username Login
  const loginWithEmail = async (identifierInput, password) => {
    setAuthError(null);
    const cleanInput = identifierInput.trim();

    if (!hasValidFirebaseKeys) {
      setCurrentUser(MOCK_CURRENT_USER);
      return MOCK_CURRENT_USER;
    }

    try {
      let targetEmail = cleanInput.toLowerCase();

      // If user entered a username instead of an email address
      if (!cleanInput.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', cleanInput.toLowerCase()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          targetEmail = snap.docs[0].data().email;
        } else {
          throw new Error(`No account found with username @${cleanInput}. Please check your spelling.`);
        }
      }

      const res = await signInWithEmailAndPassword(auth, targetEmail, password);
      const profile = await ensureUserProfile(res.user);
      return profile;
    } catch (err) {
      setAuthError(formatAuthError(err));
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
      } else {
        setAuthError(formatAuthError(err));
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
      } else {
        setAuthError(formatAuthError(err));
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
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber.trim(), verifier);
      setPhoneConfirmation(confirmationResult);
      return confirmationResult;
    } catch (err) {
      setAuthError(formatAuthError(err));
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
      const res = await phoneConfirmation.confirm(otpCode.trim());
      const profile = await ensureUserProfile(res.user);
      setPhoneConfirmation(null);
      return profile;
    } catch (err) {
      setAuthError(formatAuthError(err));
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

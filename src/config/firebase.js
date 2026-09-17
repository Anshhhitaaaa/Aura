import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Retrieve environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

export const hasValidFirebaseKeys = Boolean(
  apiKey && 
  apiKey !== 'your-api-key-here' &&
  projectId && 
  projectId !== 'your-project-id'
);

const firebaseConfig = {
  apiKey: apiKey || 'dummy-api-key-for-init',
  authDomain: authDomain || 'dummy-project.firebaseapp.com',
  projectId: projectId || 'dummy-project',
  storageBucket: storageBucket || 'dummy-project.firebasestorage.app',
  messagingSenderId: messagingSenderId || '123456789',
  appId: appId || '1:123456789:web:dummy',
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const isDemoMode = !hasValidFirebaseKeys;

export { 
  app, 
  auth, 
  db, 
  storage, 
  googleProvider, 
  facebookProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
};

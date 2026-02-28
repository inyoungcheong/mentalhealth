import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCqmjaUUYCXYfLYOMozI757i7qkVXR3GeQ',
  authDomain: 'tarotjourney-6763a.firebaseapp.com',
  projectId: 'tarotjourney-6763a',
  storageBucket: 'tarotjourney-6763a.firebasestorage.app',
  messagingSenderId: '908367334498',
  appId: '1:908367334498:web:d89a1fb887621cb991153b',
  measurementId: 'G-6MEKJDX23P',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'asia-northeast3'); // Seoul region
export const googleProvider = new GoogleAuthProvider();

try {
  getAnalytics(app);
} catch (e) {
  // analytics not available in all environments
}

export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqmjaUUYCXYfLYOMozI757i7qkVXR3GeQ",
  authDomain: "tarotjourney-6763a.firebaseapp.com",
  projectId: "tarotjourney-6763a",
  storageBucket: "tarotjourney-6763a.firebasestorage.app",
  messagingSenderId: "908367334498",
  appId: "1:908367334498:web:d89a1fb887621cb991153b",
  measurementId: "G-6MEKJDX23P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export for use in other modules
export { app, analytics };

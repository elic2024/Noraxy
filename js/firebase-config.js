// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACvUA9GfQr7_aPTMF5KbvDsFo2K8OpS-s",
  authDomain: "norax-61cdd.firebaseapp.com",
  projectId: "norax-61cdd",
  storageBucket: "norax-61cdd.firebasestorage.app",
  messagingSenderId: "721581923399",
  appId: "1:721581923399:web:8a136d6f8f440e24f96562",
  measurementId: "G-B8FY7YL20S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

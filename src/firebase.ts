import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "carla-v5.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://carla-v5-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carla-v5",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "carla-v5.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "118871134461",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:118871134461:web:38b6aafe0e008cce7aae94",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-M79XLT7KLX"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

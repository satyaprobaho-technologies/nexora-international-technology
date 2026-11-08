import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWRbAimzUIPJj936YkA2XM0RZcIjQRzsE",
  authDomain: "nexora-technology.firebaseapp.com",
  projectId: "nexora-technology",
  storageBucket: "nexora-technology.firebasestorage.app",
  messagingSenderId: "854593864836",
  appId: "1:854593864836:web:c7eeff4f0dbb561da46ed1",
  measurementId: "G-9E0RKCQELC",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_EMAIL = "computer26training@gmail.com";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGLNoXM1vPGHVdj34H0wkvk5HjXIaoojM",
  authDomain: "calenda-rent-a-car.firebaseapp.com",
  projectId: "calenda-rent-a-car",
  storageBucket: "calenda-rent-a-car.firebasestorage.app",
  messagingSenderId: "70773825564",
  appId: "1:70773825564:web:e0a9d59deea36092033fd9",
  measurementId: "G-W21G02EKRV",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "niwas-finder.firebaseapp.com",
  projectId: "niwas-finder",
  storageBucket: "niwas-finder.appspot.com",
  messagingSenderId: "960462067232",
  appId: "1:960462067232:web:00aced5f95054017948e45"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
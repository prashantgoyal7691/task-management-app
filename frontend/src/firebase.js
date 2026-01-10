import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7pL7GnoWMCiunnrIE29OWWaYlT1F116o",
  authDomain: "task-management-app-fae5c.firebaseapp.com",
  projectId: "task-management-app-fae5c",
  storageBucket: "task-management-app-fae5c.firebasestorage.app",
  messagingSenderId: "611833740476",
  appId: "1:611833740476:web:121070f05e81e35ca7a4b9",
  measurementId: "G-S17F9QSVTG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
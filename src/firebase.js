import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm254AFkzr2XMnLodTV2A2ih6cTRswrjE",
  authDomain: "expensetrackeradmin-e38e7.firebaseapp.com",
  projectId: "expensetrackeradmin-e38e7",
  storageBucket: "expensetrackeradmin-e38e7.firebasestorage.app",
  messagingSenderId: "453665772259",
  appId: "1:453665772259:web:a8515445dad4c447a42bd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

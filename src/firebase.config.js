// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHxiVxTF94Cl71AaUz2kUHbkhNgV71_IE",
  authDomain: "house-martketplace.firebaseapp.com",
  projectId: "house-martketplace",
  storageBucket: "house-martketplace.appspot.com",
  messagingSenderId: "322634184984",
  appId: "1:322634184984:web:513d374869830ee326466d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

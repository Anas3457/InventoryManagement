// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUbTu7fVmcjGUnA11vurbUe1iRxeXmNEw",
  authDomain: "inventory-management-beeb8.firebaseapp.com",
  projectId: "inventory-management-beeb8",
  storageBucket: "inventory-management-beeb8.appspot.com",
  messagingSenderId: "656820259863",
  appId: "1:656820259863:web:f5611b1aa457a37212e052",
  measurementId: "G-MDMSR7LPW0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}

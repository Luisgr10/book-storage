import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALWO6YaYcefKul_Y8Wh4pt2loHvlXEAQg",
  authDomain: "pt-kindle-clone.firebaseapp.com",
  projectId: "pt-kindle-clone",
  storageBucket: "pt-kindle-clone.appspot.com",
  messagingSenderId: "614967430643",
  appId: "1:614967430643:web:4ad24c2788ab0596071686"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);


export default appFirebase;
export { auth, db };
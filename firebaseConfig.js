// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export default appFirebase;
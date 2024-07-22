import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";


// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};


// Inicialización de Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inicialización de Auth
let auth;
if (Platform.OS === "web") {
  // Web
  auth = getAuth(appFirebase);
} else {
  // Mobile
  auth = initializeAuth(appFirebase, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicialización de Firestore y Storage
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default appFirebase;
export { auth, db, storage };

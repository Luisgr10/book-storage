import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALWO6YaYcefKul_Y8Wh4pt2loHvlXEAQg",
  authDomain: "pt-kindle-clone.firebaseapp.com",
  projectId: "pt-kindle-clone",
  storageBucket: "pt-kindle-clone.appspot.com",
  messagingSenderId: "614967430643",
  appId: "1:614967430643:web:4ad24c2788ab0596071686"
};

// Inicialización de Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inicialización de Auth
let auth;
if (Platform.OS === 'web') {
  // Web
  auth = getAuth(appFirebase);
} else {
  // Mobile
  auth = initializeAuth(appFirebase, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Inicialización de Firestore y Storage
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default appFirebase;
export { auth, db, storage };

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import appFirebase from './firebaseConfig';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const auth = initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default auth;

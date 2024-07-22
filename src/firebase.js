// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB8rwkexoFAQUmd4fBllHd4lvAeT07uWxA",
  authDomain: "iadocs-5f7f9.firebaseapp.com",
  projectId: "iadocs-5f7f9",
  storageBucket: "iadocs-5f7f9.appspot.com",
  messagingSenderId: "85034084860",
  appId: "1:85034084860:web:4e4fa3d66258b53c1a2a79",
  measurementId: "G-1824434KVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics };

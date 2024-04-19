// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGLy0CYGZ4JJbF392imiCUhfdW4PSiUjg",
  authDomain: "personal-finance-tracker-9bd5e.firebaseapp.com",
  projectId: "personal-finance-tracker-9bd5e",
  storageBucket: "personal-finance-tracker-9bd5e.appspot.com",
  messagingSenderId: "680194134503",
  appId: "1:680194134503:web:396e22d08b969081c92d42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
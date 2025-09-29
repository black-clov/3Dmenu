import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmAPwcGxzwCcA_P3BsScbgr8dkyV_MhiQ",
  authDomain: "reviewsapp-7d227.firebaseapp.com",
  projectId: "reviewsapp-7d227",
  storageBucket: "reviewsapp-7d227.firebasestorage.app",
  messagingSenderId: "152077799950",
  appId: "1:152077799950:web:61e2558aac31a6699d625f",
  measurementId: "G-LNQ4LPCQ1N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

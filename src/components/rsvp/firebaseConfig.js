// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your own Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyBm0Hx2BOgz98gSZhEmbcg-eDr18T-J9gU",
    authDomain: "maria-12472.firebaseapp.com",
    projectId: "maria-12472",
    storageBucket: "maria-12472.firebasestorage.app",
    messagingSenderId: "281498126699",
    appId: "1:281498126699:web:0010a908106de9e352a42e",
    measurementId: "G-MDC6MKHFLH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

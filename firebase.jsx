// Firebase configuration and initialization for CampusLink
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDZAZq0_MUr4npguYMijnMNuinN2Rd9jIY",
    authDomain: "campusservice-77f8a.firebaseapp.com",
    projectId: "campusservice-77f8a",
    storageBucket: "campusservice-77f8a.firebasestorage.app",
    messagingSenderId: "508503416182",
    appId: "1:508503416182:web:2d465665f45296d67b2e57",
    measurementId: "G-T60R043MQ9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 
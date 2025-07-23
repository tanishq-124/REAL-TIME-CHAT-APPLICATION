// src/hooks/useFirebase.js
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const useFirebase = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Replace with your Firebase config
        const firebaseConfig = {
          apiKey: process.env.REACT_APP_FIREBASE_KEY,
          authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
          messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER,
          appId: process.env.REACT_APP_FIREBASE_APPID
        };

        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestore);
        setAuth(firebaseAuth);

        await signInAnonymously(firebaseAuth);

        onAuthStateChanged(firebaseAuth, (user) => {
          setUserId(user?.uid || crypto.randomUUID());
          setLoading(false);
        });
      } catch (err) {
        setError("Firebase initialization failed.");
        setLoading(false);
      }
    };
    init();
  }, []);

  return { db, auth, userId, loading, error, setError };
};

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
    const initializeFirebase = async () => {
      try {
        // Replace with your Firebase keys or use .env for security
        const firebaseConfig = window.firebaseConfig || {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_PROJECT.firebaseapp.com",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_PROJECT.appspot.com",
          messagingSenderId: "YOUR_SENDER_ID",
          appId: "YOUR_APP_ID"
        };

        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestore);
        setAuth(firebaseAuth);

        await signInAnonymously(firebaseAuth);

        onAuthStateChanged(firebaseAuth, (user) => {
          setUserId(user ? user.uid : crypto.randomUUID());
          setLoading(false);
        });
      } catch (err) {
        console.error("Firebase init error:", err);
        setError("Chat initialization failed.");
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  return { db, auth, userId, loading, error, setError };
};

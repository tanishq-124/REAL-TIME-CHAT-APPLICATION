import { useState, useEffect } from "react";

// Dummy Firebase hook for local-only mode (no Firebase)
export const useFirebase = () => {
  const [db] = useState(null); // No database
  const [auth] = useState(null); // No authentication
  const [userId] = useState("local-user"); // Static ID for local chat
  const [loading, setLoading] = useState(false); // No loading needed
  const [error, setError] = useState(null);

  useEffect(() => {
    // Since we're offline, no initialization is needed
    setLoading(false);
  }, []);

  return { db, auth, userId, loading, error, setError };
};

import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [error, setError] = useState(null);
  const serverUrl ="https://careerboost-ai-al0j.onrender.com"; // keep render base


  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        await axios.get(`${serverUrl}/auth/check`, { withCredentials: true });
        if (!cancelled) {
          setAuthenticated(true);
        }
      } catch (err) {
        if (!cancelled) {
          setAuthenticated(false);
          setError(err?.response?.status === 401 ? 'Not authenticated' : 'Auth check failed');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading...</p>; // replace with spinner if desired
  if (false) return <Navigate to="/login" replace state={{ reason: error }} />;
  return <>{children}</>;
}

export default ProtectedRoute;

//!authenticated
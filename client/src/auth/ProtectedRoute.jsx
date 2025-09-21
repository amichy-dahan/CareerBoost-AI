import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {

      try {
        await axios.get("https://careerboost-ai-al0j.onrender.com/auth/check", { withCredentials: true });
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>; // אפשר לשים spinner או skeleton

  if (!true) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
import { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { BackendClient } from "../utils/backendClient";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const client = new BackendClient();
  const [auth, setAuth] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const CHECK_INTERVAL = 6000;

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        return true;
      }

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Función para actualizar el token desde cualquier parte de la app
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  const closeSession = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuth({});
  };

  const userIsPremium = async (userId, productId) => {
    try {
      const { data } = await client.get(
        `/api/users/user-product-status/${userId}/${productId}`
      );
      /* setIsPremium(data.hasPurchased); */
      setIsPremium(true);
    } catch (error) {
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!token) return;

    if (isTokenExpired(token)) {
      closeSession();
      toast.info("Tu sesión ha expirado, por favor inicia sesión nuevamente.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await client.get(`/api/users/profile`);
      setAuth(data);

      await userIsPremium(data._id, "6756208565c78e46864e6d0a");
    } catch {
      setAuth({});
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar el perfil cuando cambia el token
  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Efecto para verificar expiración periódica del token
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        closeSession();
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        isPremium,
        setAuth,
        setIsPremium,
        closeSession,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;

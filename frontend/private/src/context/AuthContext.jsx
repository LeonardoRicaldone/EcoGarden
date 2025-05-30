import { createContext, useState, useContext, useEffect } from "react";
import API_BASE from '../api/URL.js'

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga inicial

  const API = `${API_BASE}/api`;

  // Verificar sesión al cargar la aplicación
  const checkAuthStatus = async () => {
    try {
      const verifyRes = await fetch(`${API}/login/verify`, {
        credentials: "include",
      });

      const verifyData = await verifyRes.json();

      if (verifyData.ok) {
        setIsAuthenticated(true);
        setUser(verifyData.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecutar verificación al montar el componente
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en la autenticación");
      }

      //const verifyRes = await fetch(`${API}/login/verify`, {
    //    credentials: "include",
     // });

      const verifyData = await verifyRes.json();

      if (verifyData.ok) {
        setIsAuthenticated(true);
        setUser(verifyData.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      return { success: data.success, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const Logout = async () => {
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        Logout,
        checkAuthStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useState, useContext, useEffect } from "react";
import API_BASE from '../api/URL.js'

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API = `${API_BASE}/api`;

  // Verificar sesión al cargar la aplicación
  const checkAuthStatus = async () => {
    try {
      console.log("Verificando estado de autenticación...");
      const verifyRes = await fetch(`${API}/login/verify`, {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Verificar si la respuesta es OK antes de parsear
      if (!verifyRes.ok) {
        console.log("Token inválido o expirado, cerrando sesión");
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const verifyData = await verifyRes.json();
      console.log("Respuesta de verificación:", verifyData);

      if (verifyData.ok && verifyData.user) {
        console.log("Usuario autenticado encontrado:", verifyData.user);
        setIsAuthenticated(true);
        setUser(verifyData.user);
      } else {
        console.log("No hay usuario autenticado");
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

      // ✅ CAMBIO PRINCIPAL: Si el backend devuelve el usuario directamente
      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        console.log("Login exitoso, usuario autenticado:", data.user);
        return { success: true, message: data.message };
      }

      // ✅ Si llegamos aquí, el login fue exitoso pero sin usuario (no debería pasar)
      console.log("Login exitoso pero sin datos de usuario, verificando...");
      await checkAuthStatus();
      
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error en login:", error);
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
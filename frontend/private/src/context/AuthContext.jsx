import { createContext, useState, useContext, useEffect } from "react";
import API_BASE from '../api/URL.js'

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  const API = `${API_BASE}/api`;

  // Función para obtener headers con token
  const getAuthHeaders = () => {
    const token = authToken || localStorage.getItem("authToken");
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Función para limpiar el estado de autenticación
  const clearAuthState = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setAuthToken(null);
  };

  // Verificar sesión al cargar la aplicación
  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Verificando estado de autenticación...");
      
      // PRIMERO: Intentar cargar token desde localStorage
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");
      
      if (!savedToken) {
        console.log("❌ No hay token guardado");
        setIsLoading(false);
        return;
      }

      // Establecer el token en el estado antes de hacer la petición
      setAuthToken(savedToken);
      
      const verifyRes = await fetch(`${API}/login/verify`, {
        method: 'GET',
        credentials: "include", // Para cookies
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedToken}` // Usar el token de localStorage
        }
      });

      console.log("📡 Status de verificación:", verifyRes.status);

      if (!verifyRes.ok) {
        console.log("❌ Token inválido o expirado, limpiando sesión");
        clearAuthState();
        return;
      }

      const verifyData = await verifyRes.json();
      console.log("✅ Respuesta de verificación:", verifyData);

      if (verifyData.success && verifyData.user) {
        console.log("🎉 Usuario autenticado encontrado:", verifyData.user);
        setIsAuthenticated(true);
        setUser(verifyData.user);
        
        // Actualizar token si viene uno nuevo en la respuesta
        if (verifyData.token && verifyData.token !== savedToken) {
          localStorage.setItem("authToken", verifyData.token);
          setAuthToken(verifyData.token);
        }
        
        // Actualizar información del usuario
        localStorage.setItem("user", JSON.stringify(verifyData.user));
      } else {
        console.log("❌ Respuesta de verificación inválida");
        clearAuthState();
      }
    } catch (error) {
      console.error("💥 Error verificando autenticación:", error);
      
      // En caso de error de red, intentar restaurar desde localStorage
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");
      
      if (savedToken && savedUser) {
        console.log("💾 Restaurando sesión desde localStorage debido a error de red");
        try {
          const parsedUser = JSON.parse(savedUser);
          setAuthToken(savedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error("Error parsing saved user:", parseError);
          clearAuthState();
        }
      } else {
        clearAuthState();
      }
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
      setIsLoading(true);
      
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Para cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔐 Respuesta de login:", data);

      if (!response.ok) {
        throw new Error(data.message || "Error en la autenticación");
      }

      if (data.success && data.user) {
        // Guardar token si viene en la respuesta
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          setAuthToken(data.token);
        }
        
        // Guardar información del usuario
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setIsAuthenticated(true);
        setUser(data.user);
        console.log("✅ Login exitoso, usuario autenticado:", data.user);
        return { success: true, message: data.message };
      }

      throw new Error("Respuesta de login inválida");
      
    } catch (error) {
      console.error("💥 Error en login:", error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const Logout = async () => {
    try {
      setIsLoading(true);
      
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Limpiar datos locales y estado
      clearAuthState();
      setIsLoading(false);
    }
  };

  // Función helper para hacer peticiones autenticadas
  const authFetch = async (url, options = {}) => {
    const token = authToken || localStorage.getItem("authToken");
    
    const defaultOptions = {
      credentials: "include",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers // Los headers personalizados van al final para sobrescribir si es necesario
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // Si es 401, el token probablemente expiró
      if (response.status === 401) {
        console.log("🔒 Token expirado, cerrando sesión");
        clearAuthState();
        // Opcional: redirigir al login
        window.location.href = '/login';
      }
      
      return response;
    } catch (error) {
      console.error("Error en petición autenticada:", error);
      throw error;
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    Logout,
    checkAuthStatus,
    authFetch,
    authToken,
    API
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
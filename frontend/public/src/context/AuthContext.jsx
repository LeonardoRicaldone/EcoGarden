import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Exporta el contexto directamente
export const AuthContext = createContext();

// Exporta el Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Login = async (email, password) => {
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return false;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar token en localStorage como respaldo
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Configurar datos del usuario (solo clientes)
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        lastname: data.user.lastname,
        telephone: data.user.telephone
      };

      setUser(userData);
      setIsLoggedIn(true);
      
      toast.success(data.message || "Inicio de sesión exitoso.");
      return { 
        success: true, 
        user: userData 
      };

    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Credenciales incorrectas. Por favor, intenta de nuevo.");
      
      localStorage.removeItem('authToken');
      setUser(null);
      setIsLoggedIn(false);
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (clientData) => {
    const { name, lastname, telephone, email, password } = clientData;

    if (!name || !lastname || !telephone || !email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return false;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/clients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lastname, telephone, email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error en el registro');
      }

      toast.success(data.message || "Registro exitoso. Puedes iniciar sesión ahora.");
      return { 
        success: true, 
        client: data.client 
      };

    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.message || "Error en el registro. Por favor, intenta de nuevo.");
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const logOut = async () => {
    try {
      // Llamar al endpoint de logout
      const response = await fetch('http://localhost:4000/api/login/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(data.message || "Sesión cerrada exitosamente.");
        }
      }
    } catch (error) {
      console.log('Error en logout del servidor:', error);
    }

    // Limpiar estado local independientemente del resultado del servidor
    localStorage.removeItem('authToken');
    setUser(null);
    setIsLoggedIn(false);
    
    return true;
  };

  const verifyToken = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/login/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Solo manejar datos de clientes
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          lastname: data.user.lastname,
          telephone: data.user.telephone
        };

        setUser(userData);
        setIsLoggedIn(true);
        return true;
      } else {
        // Token inválido o expirado
        localStorage.removeItem('authToken');
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsLoggedIn(false);
      return false;
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      await verifyToken();
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        setUser,
        Login, 
        register,
        logOut, 
        verifyToken,
        isLoggedIn, 
        setIsLoggedIn,
        isLoading,
        checkAuthStatus,
        // Datos de fácil acceso
        auth: {
          isAuthenticated: isLoggedIn,
          email: user?.email || '',
          userId: user?.id || null,
          userName: user?.name || '',
          userFullName: user ? `${user.name} ${user.lastname}` : ''
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
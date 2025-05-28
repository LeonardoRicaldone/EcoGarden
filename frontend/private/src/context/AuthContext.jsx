import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API = "http://localhost:4000/api";

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

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const Logout = async () => {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
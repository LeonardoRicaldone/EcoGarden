// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado después de la verificación, redirigir al login
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

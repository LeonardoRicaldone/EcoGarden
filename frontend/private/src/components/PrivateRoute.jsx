// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = () => {
  const { authCokie } = useAuth();
  return authCokie ? <Outlet /> : <Navigate to="/" />;
};

import React from "react";
import "./Nav.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast"; // 👈 importa toast

const Nav = () => {
  const location = useLocation();
  const { Logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Logout();
    toast.success("Sesión cerrada correctamente"); // 👈 toast al cerrar sesión
    navigate("/");
  };

  return (
    <>
      <aside className="sidebar">
        <div className="logo">🌱 EcoGarden</div>

        <div className="nav-section">GENERAL</div>

        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link">
            <i className="material-icons icon">home</i> Dashboard
            {location.pathname === '/' && <span>☘️</span>}
          </NavLink>

          <NavLink to="/products" className="nav-link">
            <i className="material-icons icon">inventory_2</i> Products
            {location.pathname === '/products' && <span>☘️</span>}
          </NavLink>

          <NavLink to="/sales" className="nav-link">
            <i className="material-icons icon">local_mall</i> Sales
            {location.pathname === '/sales' && <span>☘️</span>}
          </NavLink>

          <NavLink to="/employees" className="nav-link">
            <i className="material-icons icon">badge</i> Employees
            {location.pathname === '/employees' && <span>☘️</span>}
          </NavLink>

          <NavLink to="/analytics" className="nav-link">
            <i className="material-icons icon">bar_chart</i> Analytics
            {location.pathname === '/analytics' && <span>☘️</span>}
          </NavLink>

          <NavLink to="/ratings" className="nav-link">
            <i className="material-icons icon">star</i> Ratings
            {location.pathname === '/ratings' && <span>☘️</span>}
          </NavLink>

          <div className="nav-section">SUPPORT AND SETTINGS</div>

          <NavLink to="/settings" className="nav-link">
            <i className="material-icons icon">settings</i> Settings
            {location.pathname === '/settings' && <span>☘️</span>}
          </NavLink>

          {/* Botón de cerrar sesión */}
          <button onClick={handleLogout} className="nav-link logout-button">
            <i className="material-icons icon">logout</i> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};
//🌿
export default Nav;
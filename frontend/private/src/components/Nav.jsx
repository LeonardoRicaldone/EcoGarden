import React, { useState, useEffect } from "react";
import "./Nav.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { Logout } = useAuth();
  const navigate = useNavigate();

  // Detectar si es móvil/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false); // Cerrar menú si se hace más grande la pantalla
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Cerrar menú al hacer clic en un enlace (solo en móvil)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await Logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón hamburguesa - Solo visible en móvil/tablet */}
      {isMobile && (
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className="material-icons">
            {isOpen ? 'close' : 'menu'}
          </i>
        </button>
      )}

      {/* Overlay para cerrar menú en móvil */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobile ? (isOpen ? 'open' : 'closed') : ''}`}>
        <div className="logo">🌱 EcoGarden</div>

        <div className="nav-section">GENERAL</div>

        <nav className="nav">
          <NavLink 
            to="/dashboard" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">home</i> Dashboard
            {location.pathname === '/dashboard' && <span>☘️</span>}
          </NavLink>

          <NavLink 
            to="/products" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">inventory_2</i> Products
            {location.pathname === '/products' && <span>☘️</span>}
          </NavLink>

          <NavLink 
            to="/sales" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">local_mall</i> Sales
            {location.pathname === '/sales' && <span>☘️</span>}
          </NavLink>

          <NavLink 
            to="/employees" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">badge</i> Employees
            {location.pathname === '/employees' && <span>☘️</span>}
          </NavLink>

          <NavLink 
            to="/analytics" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">bar_chart</i> Analytics
            {location.pathname === '/analytics' && <span>☘️</span>}
          </NavLink>

          <NavLink 
            to="/ratings" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">star</i> Ratings
            {location.pathname === '/ratings' && <span>☘️</span>}
          </NavLink>

          <div className="nav-section">SUPPORT AND SETTINGS</div>

          <NavLink 
            to="/settings" 
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="material-icons icon">settings</i> Settings
            {location.pathname === '/settings' && <span>☘️</span>}
          </NavLink>

          <button onClick={handleLogout} className="nav-link logout-button">
            <i className="material-icons icon">logout</i> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Nav;
import React from "react";
import "./Nav.css"
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Nav = () => {

  
    // Para simular useLocation en este ejemplo
    const location = { pathname: window.location.pathname };
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
  
    // Función para manejar cambios en el tamaño de la ventana
    useEffect(() => {
      const checkSize = () => {
        if (window.innerWidth <= 768) {
          setIsMobile(true);
          setIsOpen(false);
        } else {
          setIsMobile(false);
          setIsOpen(true);
        }
      };
  
      // Verificar tamaño al montar el componente
      checkSize();
      
      // Agregar event listener para cambios de tamaño
      window.addEventListener('resize', checkSize);

          // Limpieza del event listener
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Toggle para mostrar/ocultar el sidebar en móvil
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


    

    return(



        <>

<div className="sidebar-container">
      {/* Botón hamburguesa para móvil */}
      {isMobile && (
        <button 
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      )}
        
        

<aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
  <div class="logo">🌱 EcoGarden</div>

  <div class="nav-section">GENERAL</div>

  <nav class="nav">
        <NavLink to="/" className="nav-link">
        <i class="icon">🏠</i> Dashboard
        {location.pathname === '/' && <span> ☘️</span>}
        </NavLink>

        <NavLink to="/products" className="nav-link">
          <i className="icon">📦</i> Products
          {location.pathname === '/products' && <span> ☘️</span>}
        </NavLink>

        <NavLink to="/orders" className="nav-link">
          <i className="icon">🛒</i> Orders
          {location.pathname === '/orders' && <span> ☘️</span>}
        </NavLink>

        <NavLink to="/analytics" className="nav-link">
          <i className="icon">📊</i> Analytics
          {location.pathname === '/analytics' && <span> ☘️</span>}
        </NavLink>

        <NavLink to="/ratings" className="nav-link">
          <i className="icon">⭐</i> Ratings
          {location.pathname === '/ratings' && <span> ☘️</span>}
        </NavLink>

        <div className="nav-section">SUPPORT AND SETTINGS</div>

        {/*<NavLink to="/support" className="nav-link">
          <i className="icon">🛟</i> Support
          {location.pathname === '/support' && <span> ☘️</span>}
        </NavLink>*/}

        <NavLink to="/settings" className="nav-link">
          <i className="icon">⚙️</i> Settings
          {location.pathname === '/settings' && <span> ☘️</span>}
        </NavLink>
  </nav>
</aside>

        
        </div>
        </>

    )
  }

//🌿
export default Nav;
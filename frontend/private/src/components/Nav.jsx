import React from "react";
import "./Nav.css"
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Nav = () => {

    const location = useLocation();
      


    return(



        <>


<aside className="sidebar">
  <div class="logo">🌱 EcoGarden</div>

  <div class="nav-section">GENERAL</div>

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
  <button  className="nav-link logout-button">
    <i className="material-icons icon">logout</i> Logout
  </button>

</nav>
</aside>


        
        
        </>

    )

}
//🌿
export default Nav;
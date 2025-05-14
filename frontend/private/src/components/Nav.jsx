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


        
        
        </>

    )

}
//🌿
export default Nav;
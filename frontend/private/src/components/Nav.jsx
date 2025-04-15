import React from "react";
import "./Nav.css"

const Nav = () => {

    return(

        <>

<aside class="sidebar">
  <div class="logo">🌱 EcoGarden</div>

  <div class="nav-section">GENERAL</div>

  <nav class="nav">
    <a href="/" class="nav-link active">
      <i class="icon">🏠</i> Dashboard
    </a>
    <a href="/products" class="nav-link">
      <i class="icon">📦</i> Products
    </a>
    <a href="/orders" class="nav-link">
      <i class="icon">🛒</i> Orders
    </a>
    <a href="/analytics" class="nav-link">
      <i class="icon">📊</i> Analytics
    </a>
    <a href="/ratings" class="nav-link">
      <i class="icon">⭐</i> Ratings
    </a>

    <div class="nav-section">SUPPORT AND SETTINGS</div>

    <a href="/support" class="nav-link">
      <i class="icon">🛟</i> Support
    </a>
    <a href="/settings" class="nav-link">
      <i class="icon">⚙️</i> Settings
    </a>
  </nav>
</aside>
        
        
        </>

    )

}

export default Nav;
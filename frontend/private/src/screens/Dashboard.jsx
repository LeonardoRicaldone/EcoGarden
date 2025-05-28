import React from 'react';
import "./Dashboard.css"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const Dashboard = () => {

    const location = useLocation();

  useEffect(() => {
    if (location.state?.fromLogin) {
      toast.success("¡Inicio de sesión exitoso!");
      // Limpiar el estado para que no muestre el toast otra vez si se recarga
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

    return (

        <>

<div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2 className="greeting-text">Good Morning,</h2>
          <h1 className="user-name">Marvin Gutiérrez Coto</h1>
        </div>
        <div className="header-right">
          <div className="time">11:31 AM</div>
          <div className="date">Saturday, November 11, 2025 📆</div>
          <div className="user-info">
            <img src="https://avatars.githubusercontent.com/u/139492302?v=4" alt="avatar" className="avatar" />
            <div>
              <p className="user-fullname">Marvin Coto</p>
              <p className="user-email">marvinjaviercoto@ecogarden.com</p>
            </div>
            <button className="settings-button">⚙️</button>
          </div>
        </div>
      </div>

      <div className="cards-container">
        <img src="https://media.istockphoto.com/id/576892122/es/foto/camino-en-el-bosque.jpg?s=612x612&w=0&k=20&c=ZPTXqHkGLSS14nbdtJUewERi3TK0a2BAT60cYOgthbc=" alt="Forest" className="banner-img" />
        <div className="card">
          <h3 className="card-title">118.73 mill.</h3>
          <p className="card-subtitle">Ganancias totales</p>
        </div>
        <div className="card">
          <h3 className="card-title">700</h3>
          <p className="card-subtitle">Número de productos</p>
        </div>
        <div className="card">
          <h3 className="card-title">68 mil</h3>
          <p className="card-subtitle">Cantidad de ventas</p>
        </div>
      </div>

      <h2 className="welcome-text">Welcome Administrator!</h2>

      <div className="image-container-dash">
        <img
          src="https://plus.unsplash.com/premium_photo-1661962492248-a0b5fb53538c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGxhbnRhY2klQzMlQjNufGVufDB8fDB8fHww"
          alt="Field of flowers"
          className="main-img"
        />
      </div>
    </div>
        
        </>
    )

}

export default Dashboard;
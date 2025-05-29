import React, { useEffect, useState } from 'react';
import "./Dashboard.css"
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import useDashboardData from '../components/Dashboard/hooks/useDashboardData';

const Dashboard = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Hook personalizado para datos del dashboard
  const {
    totalRevenue,
    totalProducts,
    totalSales,
    loading,
    error,
    formatNumber,
    formatCurrency,
    refreshDashboardData
  } = useDashboardData();

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  // Toast de bienvenida
  useEffect(() => {
    if (location.state?.fromLogin) {
      toast.success("¡Inicio de sesión exitoso!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Función para formatear la fecha
  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Función para formatear la hora
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Función para obtener saludo según la hora
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,";
  };

  // Mostrar loading o error si es necesario
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message" style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <p>Error al cargar los datos: {error}</p>
          <button 
            onClick={refreshDashboardData}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2 className="greeting-text">{getGreeting()}</h2>
          <h1 className="user-name">Marvin Gutiérrez Coto</h1>
        </div>
        <div className="header-right">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)} 📆</div>
          <div className="user-info">
            <img 
              src="https://avatars.githubusercontent.com/u/139492302?v=4" 
              alt="avatar" 
              className="avatar" 
            />
            <div>
              <p className="user-fullname">Marvin Coto</p>
              <p className="user-email">marvinjaviercoto@ecogarden.com</p>
            </div>
            <button 
              className="settings-button"
              onClick={refreshDashboardData}
              title="Actualizar datos"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      <div className="cards-container">
        <img 
          src="https://media.istockphoto.com/id/576892122/es/foto/camino-en-el-bosque.jpg?s=612x612&w=0&k=20&c=ZPTXqHkGLSS14nbdtJUewERi3TK0a2BAT60cYOgthbc=" 
          alt="Forest" 
          className="banner-img" 
        />
        
        <div className="card">
          <h3 className="card-title">
            {loading ? (
              <span style={{ color: '#6b7280' }}>Cargando...</span>
            ) : (
              `$${formatNumber(totalRevenue)}`
            )}
          </h3>
          <p className="card-subtitle">Ganancias totales</p>
        </div>
        
        <div className="card">
          <h3 className="card-title">
            {loading ? (
              <span style={{ color: '#6b7280' }}>Cargando...</span>
            ) : (
              formatNumber(totalProducts)
            )}
          </h3>
          <p className="card-subtitle">Número de productos</p>
        </div>
        
        <div className="card">
          <h3 className="card-title">
            {loading ? (
              <span style={{ color: '#6b7280' }}>Cargando...</span>
            ) : (
              formatNumber(totalSales)
            )}
          </h3>
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
  );
};

export default Dashboard;
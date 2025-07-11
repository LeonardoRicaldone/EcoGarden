import React from 'react';
import './Settings.css';
import Header from '../components/Header';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import settingField from "../../public/settingField.png";

const Settings = () => {

  const { Logout } = useAuth();

  const handleLogout = async () => {
    await Logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
    if (isMobile) {
      setIsOpen(false);
    }
  };

    return (

      

        <>


<div className="productos-container">
      <Header title={"Settings"}/>

      <div className="config-content">
        <div className="user-section">
          <div className="user-card">
            <div className="user-header">
              <h3>Tu cuenta</h3>
              
            </div>
            <img
              className="user-image"
              src="https://s.yimg.com/ny/api/res/1.2/P954onZk0dBh.NtVM71NoQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MA--/https://s.yimg.com/os/en-AU/homerun/y7.newidea/d0048687d4851f23d33076fa8fb1f83b"
              alt="Usuario"
            />
            <div className="user-infoSet">
              <strong>Ryan Gosling</strong>
              <p>Correo: ryangosling@ecogarden.com</p> 
              <p>Contraseña: ************</p> 
              <p>Rol: Administrador</p>
              <p>Creación: 26/02/25</p> 
            </div>
          </div>

          

          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>

        <div className="settings-section">
          <div className="setting-item">
            <p>Modo Oscuro</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <p>
              <span className="icon">🌐</span> Idioma: Español
            </p>
          </div>

          <div className="setting-item">
            <p>
              <span className="icon">📍</span> Ubicación: San Salvador
            </p>
          </div>

          

          <div className="image-box large">
            <img
              src={settingField}
              alt="Campo de tulipanes"
            />
          </div>
        </div>
      </div>
    </div>
    

        
        </>
        
    )
}

export default Settings;
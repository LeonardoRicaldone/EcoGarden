import React from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  return (
    
<div className="page-container">
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <div className="logoLogin">
              <img src={logo} alt="EcoGarden Logo" className="logoLogin-img" />
              <h1>EcoGarden</h1>
            </div>
            <h2>Bienvenido de vuelta</h2>
            <p className="login-subtitle">Inicia sesión para acceder a tu cuenta</p>
          </div>

          <button className="google-button">
            <FaGoogle className="google-icon" /> {/* Icono de Google */}
            Continuar con Google
          </button>

          <div className="divider">
            <span>o inicia con tu correo</span>
          </div>

          <form className="login-form">
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input 
                type="email" 
                id="email"
                placeholder="correo@gmail.com" 
                className="login-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password"
                placeholder="••••••••" 
                className="login-input"
              />
            </div>

            <div className="login-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Recordarme</label>
              </div>
              <a href="/login" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="submit-button">
              Iniciar sesión
            </button>
          </form>

          <div className="register-section">
            <p>¿No tienes una cuenta? <a href="/register" className="register-link">Regístrate aquí</a></p>
          </div>
        </div>

        <div className="login-right">
          <div className="image-overlay"></div>
          <img 
            src="https://cdn.pixabay.com/photo/2019/03/16/03/37/plants-4058406_960_720.jpg" 
            alt="Plantas naturales" 
            className="background-img"
          />
        </div>
      </div>
    </div>
 </div>
  );
};

export default Login;
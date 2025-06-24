import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Usar el AuthContext
  const { 
    Login: loginUser, 
    logOut, 
    user, 
    isLoggedIn, 
    isLoading,
    auth 
  } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(formData.email, formData.password);
    
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      }
      
      // Redirigir a home
      navigate('/');
    }
    // Los errores ya se manejan en el AuthContext con toast
  };

  const handleLogout = async () => {
    const success = await logOut();
    if (success) {
      localStorage.removeItem('rememberLogin');
      navigate('/'); // Redirigir a home
    }
  };

  // Si el usuario está logueado, mostrar perfil
  if (isLoggedIn && user) {
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
                <h2>Bienvenido de vuelta, {user.name}</h2>
              </div>

              <div className="profile-section">
                <FaUserCircle className="profile-icon" size={80} />
                <div className="profile-info">
                  <p><strong>Nombre:</strong> {auth.userFullName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Teléfono:</strong> {user.telephone}</p>
                </div>
              </div>

              <button 
                onClick={handleLogout} 
                className="submit-button logout-button"
                disabled={isLoading}
              >
                <FaSignOutAlt /> {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
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
  }

  // Formulario de login
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

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder="correo@gmail.com" 
                  className="login-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password"
                  name="password"
                  placeholder="••••••••" 
                  className="login-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="login-options">
              
                <Link to="/forgot-password" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="register-section">
              <p>¿No tienes una cuenta? <Link to="/register" className="register-link">Regístrate aquí</Link></p>
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
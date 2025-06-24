import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import { FaGoogle, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Verificar si hay sesión al cargar el componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/check-session', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserData(data.user);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };
    
    checkSession();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      // Guardar datos del usuario
      setIsLoggedIn(true);
      setUserData(data.user);
      
      if (rememberMe) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      // Redirigir o recargar la página
      window.location.reload();
      
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem('userData');
      window.location.reload();
      
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  if (isLoggedIn && userData) {
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
                <h2>Bienvenido de vuelta, {userData.name}</h2>
              </div>

              <div className="profile-section">
                <FaUserCircle className="profile-icon" size={80} />
                <div className="profile-info">
                  <p><strong>Nombre:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  {/* Agrega más campos según tu modelo de usuario */}
                </div>
              </div>

              <button 
                onClick={handleLogout} 
                className="submit-button logout-button"
              >
                <FaSignOutAlt /> Cerrar sesión
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

            <button className="google-button" onClick={handleGoogleLogin}>
              <FaGoogle className="google-icon" />
              Continuar con Google
            </button>

            <div className="divider">
              <span>o inicia con tu correo</span>
            </div>

            {error && <div className="error-message" style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

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
                <div className="remember-me">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Recordarme</label>
                </div>
                <a href="/forgot-password" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar sesión'}
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
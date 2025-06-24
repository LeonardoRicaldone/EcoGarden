import React, { useState } from 'react';
import './Register.css';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    telephone: '',
    email: '',
    password: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  // Verificar si viene de términos y condiciones
  const initialTermsAccepted = location.state?.termsAccepted || false;

  React.useEffect(() => {
    if (initialTermsAccepted) {
      setTermsAccepted(true);
    }
  }, [initialTermsAccepted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de términos y condiciones
    if (!termsAccepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    // Validación de campos vacíos
    if (!formData.name || !formData.lastname || !formData.telephone || 
        !formData.email || !formData.password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    // Validación de contraseña
    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Llamar al registro del contexto
    const result = await register(formData);
    
    if (result.success) {
      // Registro exitoso - redirigir al login
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Ahora puedes iniciar sesión.',
          email: formData.email 
        }
      });
    }
    // Los errores se manejan automáticamente en el contexto con toast
  };



  return (
    <div className="page-container">
      <div className="register-container">
        <div className="register-left">
          <img
            src="https://cdn.pixabay.com/photo/2019/04/25/06/59/sunflowers-4154152_960_720.jpg"
            alt="EcoGarden flor"
            className="register-image"
          />
          <div className="logo-overlay">
            <img src={logo} alt="EcoGarden Logo" className="logo-image" />
            <span>EcoGarden</span>
          </div>
        </div>

        <div className="register-right">
          <h1 className="register-title">¡Bienvenido!<br />Comencemos con tu registro.</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <input 
                type="text" 
                name="name"
                placeholder="Nombre" 
                className="register-input half-width" 
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input 
                type="text" 
                name="lastname"
                placeholder="Apellido" 
                className="register-input half-width" 
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            
            <input 
              type="tel" 
              name="telephone"
              placeholder="Teléfono" 
              className="register-input" 
              value={formData.telephone}
              onChange={handleChange}
              required
            />
            
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              className="register-input" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <input 
              type="password" 
              name="password"
              placeholder="Contraseña (mínimo 6 caracteres)" 
              className="register-input" 
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="terms"
                className="terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="termsConditions">
                Acepto <Link to="/TermsConditions" state={{ returnTo: '/register' }}>términos y condiciones</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading || !termsAccepted}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="already-account">
            ¿Ya estás registrado? <Link to="/login">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
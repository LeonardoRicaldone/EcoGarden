import React, { useState, useEffect } from 'react';
import './Register.css';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();

  // Verificar si viene de términos y condiciones
  const initialTermsAccepted = location.state?.termsAccepted || false;

  useEffect(() => {
    if (initialTermsAccepted) {
      setTermsAccepted(true);
    }
  }, [initialTermsAccepted]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      lastname: '',
      telephone: '',
      email: '',
      password: ''
    },
    mode: 'onBlur'
  });

  // Validaciones
  const validations = {
    name: {
      required: 'El nombre es requerido',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      },
      pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El nombre solo puede contener letras'
      }
    },
    lastname: {
      required: 'El apellido es requerido',
      minLength: {
        value: 2,
        message: 'El apellido debe tener al menos 2 caracteres'
      },
      pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El apellido solo puede contener letras'
      }
    },
    telephone: {
      required: 'El teléfono es requerido',
      pattern: {
        value: /^[\+]?[(]?[\d\s\-\(\)]{8,}$/,
        message: 'Formato de teléfono inválido'
      }
    },
    email: {
      required: 'El correo electrónico es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de correo electrónico inválido'
      }
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  };

  // Manejar envío del formulario
  const onSubmit = async (formData) => {
    // Validación de términos y condiciones
    if (!termsAccepted) {
      // El error se manejará visualmente en el checkbox
      return;
    }

    // Llamar al registro del contexto
    const result = await registerUser(formData);
    
    if (result.success) {
      // Limpiar formulario
      reset();
      setTermsAccepted(false);
      
      if (result.needsVerification) {
        // Redirigir a la página de verificación de email
        navigate('/verify-email', { 
          state: { 
            email: formData.email,
            clientName: formData.name
          }
        });
      } else {
        // Registro exitoso sin verificación - redirigir al login
        navigate('/login', { 
          state: { 
            message: 'Registro exitoso. Ahora puedes iniciar sesión.',
            email: formData.email 
          }
        });
      }
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-row">
              <div className="input-container half-width">
                <input 
                  type="text" 
                  {...register('name', validations.name)}
                  placeholder="Nombre" 
                  className={`register-input half-width ${errors.name ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>
              
              <div className="input-container half-width">
                <input 
                  type="text" 
                  {...register('lastname', validations.lastname)}
                  placeholder="Apellido" 
                  className={`register-input half-width ${errors.lastname ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.lastname && (
                  <span className="error-message">{errors.lastname.message}</span>
                )}
              </div>
            </div>
            
            <div className="input-container">
              <input 
                type="tel" 
                {...register('telephone', validations.telephone)}
                placeholder="Teléfono" 
                className={`register-input ${errors.telephone ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.telephone && (
                <span className="error-message">{errors.telephone.message}</span>
              )}
            </div>
            
            <div className="input-container">
              <input 
                type="email" 
                {...register('email', validations.email)}
                placeholder="Correo electrónico" 
                className={`register-input ${errors.email ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>
            
            <div className="input-container">
              <input 
                type="password" 
                {...register('password', validations.password)}
                placeholder="Contraseña (mínimo 6 caracteres)" 
                className={`register-input ${errors.password ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className={`checkbox-container ${!termsAccepted && Object.keys(errors).length === 0 && watch('name') ? 'error' : ''}`}>
              <input
                type="checkbox"
                id="terms"
                className="terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="termsConditions">
                Acepto <Link to="/TermsConditions" state={{ returnTo: '/register' }}>términos y condiciones</Link>
              </label>
              {!termsAccepted && Object.keys(errors).length === 0 && watch('name') && (
                <span className="error-message">Debes aceptar los términos y condiciones</span>
              )}
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading || !termsAccepted || Object.keys(errors).length > 0}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="already-account">
            ¿Ya estás registrado? <Link to="/login">Inicia sesión</Link>
          </div>

          <div className="verification-info">
            <p className="verification-note">
              📧 Después del registro, recibirás un correo para verificar tu cuenta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
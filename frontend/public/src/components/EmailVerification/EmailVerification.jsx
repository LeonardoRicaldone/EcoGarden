import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import './EmailVerification.css';

const EmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos para reenvío
  const [canResend, setCanResend] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener email del estado de navegación
  const email = location.state?.email || '';
  const clientName = location.state?.clientName || '';

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: {
      verificationCode: ''
    },
    mode: 'onChange'
  });

  // Contador regresivo para reenvío
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Formatear tiempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Validaciones
  const validations = {
    verificationCode: {
      required: 'El código de verificación es requerido',
      pattern: {
        value: /^[A-Z0-9]{6}$/,
        message: 'El código debe tener exactamente 6 caracteres alfanuméricos'
      }
    }
  };

  // Manejar verificación del código
  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:4000/api/clients/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode: data.verificationCode }),
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        
        // Limpiar formulario
        reset();
        
        // Redirigir al login después de verificación exitosa
        navigate('/login', {
          state: {
            message: 'Email verificado exitosamente. Ahora puedes iniciar sesión.',
            email: email
          }
        });
      } else {
        toast.error(result.message || 'Código de verificación inválido');
      }

    } catch (error) {
      console.error('Error verificando código:', error);
      toast.error('Error al verificar el código. Intenta de nuevo.');
    }
  };

  // Reenviar código de verificación
  const handleResendCode = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      const response = await fetch('http://localhost:4000/api/clients/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setTimeLeft(120); // Reiniciar contador
        setCanResend(false);
        reset(); // Limpiar código anterior
      } else {
        toast.error(data.message || 'Error reenviando código');
      }

    } catch (error) {
      console.error('Error reenviando código:', error);
      toast.error('Error al reenviar el código. Intenta de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  // Función para formatear el código mientras el usuario escribe
  const formatVerificationCode = (value) => {
    // Solo permitir letras y números, convertir a mayúsculas, máximo 6 caracteres
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  };

  return (
    <div className="page-container">
      <div className="verification-container">
        <div className="verification-left">
          <img
            src="https://cdn.pixabay.com/photo/2019/04/25/06/59/sunflowers-4154152_960_720.jpg"
            alt="EcoGarden verification"
            className="verification-image"
          />
          <div className="logo-overlay">
            <span>EcoGarden</span>
          </div>
        </div>

        <div className="verification-right">
          <div className="verification-content">
            <h1 className="verification-title">
              Verifica tu correo electrónico
            </h1>
            
            <div className="verification-info">
              <p className="verification-description">
                Hemos enviado un código de verificación de 6 caracteres a:
              </p>
              <p className="email-display">{email}</p>
              {clientName && (
                <p className="welcome-text">¡Bienvenido, {clientName}!</p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="verification-form">
              <div className="code-input-container">
                <input
                  type="text"
                  {...register('verificationCode', {
                    ...validations.verificationCode,
                    onChange: (e) => {
                      const formattedValue = formatVerificationCode(e.target.value);
                      e.target.value = formattedValue;
                    }
                  })}
                  placeholder="Ingresa el código (6 caracteres)"
                  className={`verification-input ${errors.verificationCode ? 'error' : ''}`}
                  maxLength="6"
                  disabled={isSubmitting}
                />
                <small className="input-hint">
                  El código contiene letras y números
                </small>
                {errors.verificationCode && (
                  <span className="error-message">{errors.verificationCode.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || watch('verificationCode')?.length !== 6}
                className="verify-button"
              >
                {isSubmitting ? 'Verificando...' : 'Verificar Código'}
              </button>
            </form>

            <div className="resend-section">
              <p className="resend-text">
                ¿No recibiste el código?
              </p>
              
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="resend-button"
                >
                  {isResending ? 'Reenviando...' : 'Reenviar código'}
                </button>
              ) : (
                <p className="countdown-text">
                  Puedes solicitar un nuevo código en: {formatTime(timeLeft)}
                </p>
              )}
            </div>

            <div className="verification-footer">
              <Link to="/register" className="back-link">
                ← Volver al registro
              </Link>
              <span className="divider">•</span>
              <Link to="/login" className="login-link">
                ¿Ya tienes cuenta verificada? Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaEnvelope, FaLock, FaKey, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import usePasswordRecovery from '../hooks/usePasswordRecovery';
import './PasswordRecovery.css';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Hooks de recuperación de contraseña
  const {
    currentStep,
    loading,
    maskedEmail,
    requestCode,
    verifyCode,
    setNewPasswordRequest,
    resetProcess,
    goToPreviousStep,
    requestNewCode,
  } = usePasswordRecovery();

  // React Hook Form para Paso 1 (Email)
  const emailForm = useForm({
    defaultValues: { email: '' },
    mode: 'onBlur'
  });

  // React Hook Form para Paso 2 (Código)
  const codeForm = useForm({
    defaultValues: { code: '' },
    mode: 'onChange'
  });

  // React Hook Form para Paso 3 (Contraseñas)
  const passwordForm = useForm({
    defaultValues: { 
      newPassword: '', 
      confirmPassword: '' 
    },
    mode: 'onBlur'
  });

  // Validaciones
  const validations = {
    email: {
      required: 'El correo electrónico es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de correo electrónico inválido'
      }
    },
    code: {
      required: 'El código es requerido',
      pattern: {
        value: /^\d{5}$/,
        message: 'El código debe tener exactamente 5 dígitos'
      }
    },
    newPassword: {
      required: 'La nueva contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    confirmPassword: {
      required: 'Confirma tu contraseña',
      validate: (value, formValues) => {
        return value === formValues.newPassword || 'Las contraseñas no coinciden';
      }
    }
  };

  // Manejadores de cada paso
  const handleEmailSubmit = async (data) => {
    await requestCode(data.email);
  };

  const handleCodeSubmit = async (data) => {
    await verifyCode(data.code);
  };

  const handlePasswordSubmit = async (data) => {
    const result = await setNewPasswordRequest(data.newPassword, data.confirmPassword);
    if (result.success) {
      // Después de 3 segundos, redirigir al login
      setTimeout(() => {
        navigate('/Login');
      }, 3000);
    }
  };

  const handleGoToLogin = () => {
    navigate('/Login');
  };

  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
            <div className="step-circle">
              {currentStep > step ? '✓' : step}
            </div>
            <span className="step-label">
              {step === 1 && 'Email'}
              {step === 2 && 'Código'}
              {step === 3 && 'Contraseña'}
              {step === 4 && 'Completado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="step-content">
      <div className="step-icon">
        <FaEnvelope />
      </div>
      <h2>Recuperar Contraseña</h2>
      <p>Ingresa tu correo electrónico y te enviaremos un código de verificación.</p>
      
      <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="recovery-form">
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            {...emailForm.register('email', validations.email)}
            placeholder="tu-email@ejemplo.com"
            className={emailForm.formState.errors.email ? 'error' : ''}
            disabled={loading}
          />
          {emailForm.formState.errors.email && (
            <span className="error-text">{emailForm.formState.errors.email.message}</span>
          )}
        </div>
        
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Código'}
        </button>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <div className="step-icon">
        <FaKey />
      </div>
      <h2>Verificar Código</h2>
      <p>
        Hemos enviado un código de 5 dígitos a <strong>{maskedEmail}</strong>
      </p>
      
      <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)} className="recovery-form">
        <div className="input-group">
          <label htmlFor="code">Código de Verificación</label>
          <input
            type="text"
            id="code"
            {...codeForm.register('code', {
              ...validations.code,
              onChange: (e) => {
                // Solo permitir números y limitar a 5 dígitos
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                codeForm.setValue('code', value);
              }
            })}
            placeholder="12345"
            maxLength="5"
            className={`code-input ${codeForm.formState.errors.code ? 'error' : ''}`}
            disabled={loading}
          />
          {codeForm.formState.errors.code && (
            <span className="error-text">{codeForm.formState.errors.code.message}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="primary-btn" 
          disabled={loading || codeForm.watch('code')?.length !== 5}
        >
          {loading ? 'Verificando...' : 'Verificar Código'}
        </button>
        
        <div className="step-actions">
          <button type="button" onClick={goToPreviousStep} className="secondary-btn">
            <FaArrowLeft /> Cambiar Email
          </button>
          
          <button type="button" onClick={requestNewCode} className="link-btn">
            ¿No recibiste el código? Reenviar
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-icon">
        <FaLock />
      </div>
      <h2>Nueva Contraseña</h2>
      <p>Crea una nueva contraseña segura para tu cuenta.</p>
      
      <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="recovery-form">
        <div className="input-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              {...passwordForm.register('newPassword', validations.newPassword)}
              placeholder="Mínimo 6 caracteres"
              className={passwordForm.formState.errors.newPassword ? 'error' : ''}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordForm.formState.errors.newPassword && (
            <span className="error-text">{passwordForm.formState.errors.newPassword.message}</span>
          )}
        </div>
        
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              {...passwordForm.register('confirmPassword', validations.confirmPassword)}
              placeholder="Confirma tu nueva contraseña"
              className={passwordForm.formState.errors.confirmPassword ? 'error' : ''}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordForm.formState.errors.confirmPassword && (
            <span className="error-text">{passwordForm.formState.errors.confirmPassword.message}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="primary-btn" 
          disabled={loading || !passwordForm.formState.isValid}
        >
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
        
        <div className="step-actions">
          <button type="button" onClick={goToPreviousStep} className="secondary-btn">
            <FaArrowLeft /> Cambiar Código
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-content success">
      <div className="step-icon success">
        <FaCheckCircle />
      </div>
      <h2>¡Contraseña Actualizada!</h2>
      <p>Tu contraseña ha sido cambiada exitosamente.</p>
      <p className="redirect-message">
        Serás redirigido al login en unos segundos...
      </p>
      
      <div className="step-actions">
        <button onClick={handleGoToLogin} className="primary-btn">
          Ir al Login Ahora
        </button>
        
        <button onClick={resetProcess} className="secondary-btn">
          Recuperar Otra Cuenta
        </button>
      </div>
    </div>
  );

  return (
    <div className="password-recovery-container">
      <div className="recovery-card">
        {/* Header */}
        <div className="recovery-header">
          <Link to="/Login" className="back-link">
            <FaArrowLeft /> Volver al Login
          </Link>
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">EcoGarden</span>
          </div>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Content */}
        <div className="recovery-content">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="recovery-footer">
          <p>
            ¿Recordaste tu contraseña? <Link to="/Login">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
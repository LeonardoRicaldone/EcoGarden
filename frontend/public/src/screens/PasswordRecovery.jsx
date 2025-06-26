import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    email,
    code,
    newPassword,
    confirmPassword,
    maskedEmail,
    requestCode,
    verifyCode,
    setNewPasswordRequest,
    resetProcess,
    goToPreviousStep,
    requestNewCode,
    setEmail,
    setCode,
    setNewPassword,
    setConfirmPassword,
  } = usePasswordRecovery();

  // Formularios para cada paso
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejadores de cada paso
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      return;
    }
    await requestCode(formData.email);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      return;
    }
    await verifyCode(formData.code);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      return;
    }
    const result = await setNewPasswordRequest(formData.newPassword, formData.confirmPassword);
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
      
      <form onSubmit={handleEmailSubmit} className="recovery-form">
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="tu-email@ejemplo.com"
            required
            disabled={loading}
          />
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
      
      <form onSubmit={handleCodeSubmit} className="recovery-form">
        <div className="input-group">
          <label htmlFor="code">Código de Verificación</label>
          <input
            type="text"
            id="code"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="12345"
            maxLength="5"
            required
            disabled={loading}
            className="code-input"
          />
        </div>
        
        <button type="submit" className="primary-btn" disabled={loading || formData.code.length !== 5}>
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
      
      <form onSubmit={handlePasswordSubmit} className="recovery-form">
        <div className="input-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              minLength="6"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              required
              disabled={loading}
              minLength="6"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <span className="error-text">Las contraseñas no coinciden</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="primary-btn" 
          disabled={loading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 6}
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
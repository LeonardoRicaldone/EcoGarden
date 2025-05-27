import React, { useState, useEffect } from 'react';

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  autoClose = true, 
  duration = 4000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getAlertStyles = () => {
    const baseStyles = {
      success: {
        bg: 'linear-gradient(135deg, #10b981, #059669)',
        icon: '✅',
        shadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
      },
      error: {
        bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
        icon: '❌',
        shadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
      },
      warning: {
        bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
        icon: '⚠️',
        shadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
      },
      info: {
        bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        icon: 'ℹ️',
        shadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
      }
    };
    return baseStyles[type] || baseStyles.success;
  };

  const alertStyles = getAlertStyles();

  if (!isVisible) return null;

  return (
    <div 
      className="custom-alert-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onClick={handleClose}
    >
      <div 
        className="custom-alert-content"
        style={{
          background: alertStyles.bg,
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          maxWidth: '500px',
          width: '90%',
          color: 'white',
          textAlign: 'center',
          boxShadow: alertStyles.shadow,
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-20px)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efecto de brillo animado */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shine 2s infinite',
            zIndex: 1
          }}
        />
        
        {/* Contenido */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Icono animado */}
          <div 
            style={{
              fontSize: '3.5rem',
              marginBottom: '1rem',
              animation: 'bounce 1s ease-in-out',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          >
            {alertStyles.icon}
          </div>

          {/* Título */}
          <h2 
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 0.5rem 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {title}
          </h2>

          {/* Mensaje */}
          <p 
            style={{
              fontSize: '1.1rem',
              margin: '0 0 1.5rem 0',
              opacity: 0.95,
              lineHeight: '1.4'
            }}
          >
            {message}
          </p>

          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: 'white',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ✨ Entendido
          </button>
        </div>

        {/* Partículas decorativas */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '1.5rem',
            opacity: 0.3,
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          ✨
        </div>
        <div 
          style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            fontSize: '1.2rem',
            opacity: 0.3,
            animation: 'float 3s ease-in-out infinite reverse'
          }}
        >
          ⭐
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

// Componente de Confirmación Personalizado
const CustomConfirm = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [isOpen]);

  const handleCancel = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onCancel();
    }, 300);
  };

  const handleConfirm = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onConfirm();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="custom-confirm-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onClick={handleCancel}
    >
      <div 
        className="custom-confirm-content"
        style={{
          background: 'linear-gradient(135deg, #1f2937, #374151)',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          maxWidth: '500px',
          width: '90%',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-20px)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(239, 68, 68, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efecto de partículas */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '1.2rem',
            opacity: 0.4,
            animation: 'float 2s ease-in-out infinite'
          }}
        >
          💭
        </div>
        <div 
          style={{
            position: 'absolute',
            bottom: '15px',
            left: '20px',
            fontSize: '1rem',
            opacity: 0.4,
            animation: 'float 3s ease-in-out infinite reverse'
          }}
        >
          ⚠️
        </div>

        {/* Contenido */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Icono principal */}
          <div 
            style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              animation: 'pulse 2s infinite',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          >
            🤔
          </div>

          {/* Título */}
          <h2 
            style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              margin: '0 0 1rem 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              color: '#f9fafb'
            }}
          >
            {title}
          </h2>

          {/* Mensaje */}
          <p 
            style={{
              fontSize: '1.1rem',
              margin: '0 0 2rem 0',
              opacity: 0.9,
              lineHeight: '1.5',
              color: '#e5e7eb'
            }}
          >
            {message}
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleConfirm}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              🗑️ {confirmText}
            </button>

            <button
              onClick={handleCancel}
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #4b5563, #374151)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
              }}
            >
              ↩️ {cancelText}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    </div>
  );
};

// Hook personalizado para manejar las alertas
export const useCustomAlert = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  const showAlert = (type, title, message) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirm = ({ title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
    return new Promise((resolve) => {
      setConfirm({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirm(prev => ({ ...prev, isOpen: false }));
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setConfirm(prev => ({ ...prev, isOpen: false }));
          if (onCancel) onCancel();
          resolve(false);
        }
      });
    });
  };

  const closeConfirm = () => {
    setConfirm(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (title, message) => showAlert('success', title, message);
  const showError = (title, message) => showAlert('error', title, message);
  const showWarning = (title, message) => showAlert('warning', title, message);
  const showInfo = (title, message) => showAlert('info', title, message);

  return {
    alert,
    confirm,
    showAlert,
    closeAlert,
    showConfirm,
    closeConfirm,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    AlertComponent: () => (
      <>
        <CustomAlert
          isOpen={alert.isOpen}
          onClose={closeAlert}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />
        <CustomConfirm
          isOpen={confirm.isOpen}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
          title={confirm.title}
          message={confirm.message}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
        />
      </>
    )
  };
};

export default CustomAlert;
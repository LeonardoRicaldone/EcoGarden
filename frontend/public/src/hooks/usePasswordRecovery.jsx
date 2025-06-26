import { useState } from 'react';
import { toast } from 'react-hot-toast';

const usePasswordRecovery = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const API_BASE = 'http://localhost:4000/api/passwordRecovery';

  // Paso 1: Solicitar código
  const requestCode = async (emailValue) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/request-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(emailValue);
        setMaskedEmail(data.email || emailValue);
        setCurrentStep(2);
        toast.success('Código enviado a tu correo electrónico');
        return { success: true, data };
      } else {
        toast.error(data.message || 'Error al enviar el código');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error requesting code:', error);
      toast.error('Error de conexión. Inténtalo nuevamente.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código
  const verifyCode = async (codeValue) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code: codeValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setCode(codeValue);
        setCurrentStep(3);
        toast.success('Código verificado correctamente');
        return { success: true, data };
      } else {
        toast.error(data.message || 'Código incorrecto');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('Error de conexión. Inténtalo nuevamente.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Establecer nueva contraseña
  const setNewPasswordRequest = async (password, confirmPass) => {
    try {
      // Validaciones del frontend
      if (password !== confirmPass) {
        toast.error('Las contraseñas no coinciden');
        return { success: false, error: 'Las contraseñas no coinciden' };
      }

      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return { success: false, error: 'Contraseña muy corta' };
      }

      setLoading(true);
      
      const response = await fetch(`${API_BASE}/new-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewPassword(password);
        setConfirmPassword(confirmPass);
        setCurrentStep(4);
        toast.success('Contraseña actualizada correctamente');
        return { success: true, data };
      } else {
        toast.error(data.message || 'Error al actualizar la contraseña');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error setting new password:', error);
      toast.error('Error de conexión. Inténtalo nuevamente.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar el proceso
  const resetProcess = () => {
    setCurrentStep(1);
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setMaskedEmail('');
    setLoading(false);
  };

  // Volver al paso anterior
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Solicitar nuevo código (cuando expira)
  const requestNewCode = async () => {
    return await requestCode(email);
  };

  return {
    // Estados
    currentStep,
    loading,
    email,
    code,
    newPassword,
    confirmPassword,
    maskedEmail,
    
    // Acciones
    requestCode,
    verifyCode,
    setNewPasswordRequest,
    resetProcess,
    goToPreviousStep,
    requestNewCode,
    
    // Setters para formularios
    setEmail,
    setCode,
    setNewPassword,
    setConfirmPassword,
  };
};

export default usePasswordRecovery;
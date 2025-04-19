import './Register.css';
import { FaGoogle } from 'react-icons/fa';

const Register = () => {
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
            EcoGarden
          </div>
        </div>

        <div className="register-right">
          <h1 className="register-title">¡Bienvenido!<br />Comencemos con tu registro.</h1>

          <div className="input-row">
            <input type="text" placeholder="Nombre" className="register-input half-width" />
            <input type="text" placeholder="Apellido" className="register-input half-width" />
          </div>
          <input type="text" placeholder="Teléfono" className="register-input" />
          <input type="email" placeholder="Correo electrónico" className="register-input" />
          <input type="password" placeholder="Contraseña" className="register-input" />

          <div className="checkbox-container">
          <input type="checkbox" id="terms" className="terms-checkbox" />
          <label htmlFor="terms" className="termsConditions">Acepto <a href="/terms-conditions">términos y condiciones</a></label>
          </div>

          <button className="register-button">Registrarse</button>

          <div className="already-account">
            ¿Ya estás registrado? <a href="/login">Inicia sesión</a>
          </div>

          <div className="google-divider">o</div>

          <button className="google-register-button">
            <FaGoogle className="google-icon" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
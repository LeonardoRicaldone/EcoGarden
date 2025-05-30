import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./Login.css";
import sunflower from "../../public/sunflowers.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    try {
      const result = await login(email, password);
      console.log("Resultado login:", result);

      if (!result.success) {
        // Mostrar el mensaje específico del servidor o uno genérico
        toast.error("Credenciales incorrectas");
        console.log("Credenciales incorrectas", result);
        return;
      }

      if (result.success) {
        
        
        // Esperar un poco para que se vea el toast
        setTimeout(() => {
          navigate("/dashboard", { state: { fromLogin: true, showSuccessToast: true } });
        }, 500);
      }
    } catch (error) {
      console.error("Error inesperado en login:", error);
      toast.error("Error al iniciar sesión. Intente nuevamente.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="contenedor-principal-Login">
      <div id="DivPrincipal-Login">
        <div className="logo-contenedor">
          <img src="src/img/logo.png" alt="Logo EcoGarden" />
          <h3>EcoGarden</h3>
          <br />
        </div>
        <br />
        <h5>Inicia sesión con tu cuenta</h5>
        <br />
        <button className="google-btn">
          <span className="google-icon">G</span>
          <span className="google-text">Google</span>
        </button>
        <br />
        <div className="separator">o correo y contraseña</div>
        <br />

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Correo Electrónico
          </label>
          <input
            type="text"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <a href="https://youtu.be/tQN9hdPNVS4?si=T9NAuKCSqhZ0_kCT">Recuperar</a>
          </p>
          <br />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>

      <Toaster toastOptions={{ duration: 2000 }} />

      <div className="imagen-lateral">
        <img src={sunflower} alt="Fondo" />
      </div>
    </div>
  );
};

export default Login;
import Imput from "../components/Imput"
import Button from "../components/Button"
import './Login.css';
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, Login, logout, authCokie, setAuthCokie } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }
    const result = await Login(email, password);

    if (!result.success) {
      toast.error(result.message || "Credenciales incorrectas.");
      return;
    }
    
    navigate('/dashboard');
    
  };

useEffect(() => {
  const token = Cookies.get('authToken');
  console.log(token, 'authToken desde cookie');
}, []);

    return (
        
        <>

        <div className="contenedor-principal-Login">

        <div id="DivPrincipal-Login">

        <div className="logo-contenedor">
        <img src="src/img/logo.png" alt="" />
        <h3>EcoGarden</h3> <br />
        </div> <br />

        <h5>Inicia sesión con tu cuenta</h5>

        <br />

        <button class="google-btn">
        <span class="google-icon">G</span>
        <span class="google-text">Google</span>
        </button>

        <br />

        <div class="separator">o correo y contraseña</div> <br />
        
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Correo Electrónico
            </label>
              <input
              type="text"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> <br />

            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /> <br />

        <p>¿Olvidaste tu contraseña? <a href="https://youtu.be/tQN9hdPNVS4?si=T9NAuKCSqhZ0_kCT">Recuperar</a> </p> <br />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Iniciar Sesión
          </button>

        </div>
        <Toaster
          toastOptions={{
            duration: 2000,
          }}
        />

        <div class="imagen-lateral">
        <img src="src/img/sunflowers.png" alt="Fondo" />
        </div>


        </div>



        </>
    )
}

export default Login;
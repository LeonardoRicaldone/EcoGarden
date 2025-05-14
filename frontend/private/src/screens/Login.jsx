import Imput from "../components/Imput"
import Button from "../components/Button"
import './Login.css';

const Login = () => {

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
        

        <Imput label={"Correo electrónico"} placeholder={"Escribe tu correo electrónico"}/> <br />

        <Imput label={"Contraseña"} placeholder={"Escribe tu contraseña"} type={"password"}/>  <br />

        <p>¿Olvidaste tu contraseña? <a href="https://youtu.be/tQN9hdPNVS4?si=T9NAuKCSqhZ0_kCT">Recuperar</a> </p>

        <Button text="Iniciar Sesión"/>

        </div>

        <div class="imagen-lateral">
        <img src="src/img/sunflowers.png" alt="Fondo" />
        </div>


        </div>



        </>
    )
}

export default Login;
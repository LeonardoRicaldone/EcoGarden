import Imput from "./Imput"
import Button from "./Button"
import './PasswordRecovery.css';

const FirstUserForm = () => {

    return (
        
        <>

        <div className="contenedor-principal-PassWordRecovery">

        <div id="DivPrincipal-PassWordRecovery">

        <div className="logo-contenedor">
        <img src="src/img/logo.png" alt="" />
        <h3>EcoGarden</h3> <br />
        </div> <br />

        <h5>Recuperación de contraseña</h5>

        <br />

        <Imput label={"Escribe el código que fue enviado a tu correo"} placeholder={"X X X X"} type={"Number"}/> <br /> 



        <Button text="Siguiente"/>

        <button class="bottom-left-button">Regresar</button>

        </div>

        <div class="imagen-lateral">
        <img src="src/img/valley.png" alt="Fondo" />
        </div>


        </div>



        </>
    )
}


export default FirstUserForm;
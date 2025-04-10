import Imput from "./Imput"
import './FirstUserForm.css';

const FirstUserForm = () => {

    return (
        
        <>

        <div className="contenedor-principal">

        <div id="DivPrincipal">

        <div className="logo-contenedor">
        <img src="src/img/logo.png" alt="" />
        <h3>EcoGarden</h3> <br />
        </div> <br />

        <h5>¡Bienvenido Administrador de EcoGarden!</h5>
        <h5>Registra el primer usuario de tu sistema</h5> 

        <br />

       

        <Imput label={"Nombre"} placeholder={"Escribe tu nombre"}/> <br />

        <Imput label={"Apellido"} placeholder={"Escribe tu apellido"}/> <br />

        <Imput label={"Teléfono"} placeholder={"Escribe tu número de teléfono"}/> <br />

        <Imput label={"Correo electrónico"} placeholder={"Escribe tu correo electrónico"}/> <br />

        <Imput label={"Contraseña"} placeholder={"Escribe tu contraseña"} type={"password"}/> <br />


        <div class="form-check" >
        <input class="form-check-input" type="checkbox" value="" id="checkDefault"/>
        <label class="form-check-label" for="checkDefault">Acepto <a href="https://youtu.be/tQN9hdPNVS4?si=T9NAuKCSqhZ0_kCT">Terminos y condiciones</a></label>
        </div> <br />

        <button class="btn-registrar">Registrarse</button>

        </div>

        <div class="imagen-lateral">
        <img src="src/img/forest.png" alt="Fondo" />
        </div>


        </div>



        </>
    )
}
//https://youtu.be/igDpFxg60qU?si=LileRhVDsO_JAu9B

export default FirstUserForm;
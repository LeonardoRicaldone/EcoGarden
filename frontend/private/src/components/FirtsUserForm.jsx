import Imput from "./Imput"

const FirtsUserForm = () => {

    return (
        
        <>

        <img src="src/img/logo.png" alt="" /> 
        <h3>EcoGarden</h3> <br />

        <h6>¡Bienvenido Administrador de EcoGarden!</h6>
        <h6>Registra el primer usuario de tu sistema</h6> 

        <br />

       

        <Imput label={"Nombre"} placeholder={"Escribe tu nombre"}/> <br />

        <Imput label={"Apellido"} placeholder={"Escribe tu apellido"}/> <br />

        <Imput label={"Teléfono"} placeholder={"Escribe tu número de teléfono"}/> <br />

        <Imput label={"Correo electrónico"} placeholder={"Escribe tu correo electrónico"}/> <br />

        <Imput label={"Contraseña"} placeholder={"Escribe tu contraseña"} type={"password"}/> 

        

        


        </>
    )
}

export default FirtsUserForm;
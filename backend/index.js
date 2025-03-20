
import dotenv from "dotenv";

dotenv.config();

import { config } from "./src/config.js";


//importamos lo que exportamos en el app que creamos en app.js
import app from "./app.js";
//importamos la base de datos 
import "./database.js"

//creo una funcion
//se conecta al servidor en el puerto seleccionado
async function main() {

   //const port = ;
   app.listen(config.server.port);
   console.log("server on port" + config.server.port);

}

//ejecuta la funcion
main();
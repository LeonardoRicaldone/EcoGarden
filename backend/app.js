//express es un servidor que me dara una red

//importo todo lo de la libreria de express
import express from "express";
import administratorsRoutes from "./src/routes/administrators.js";
import favoritesRoutes from "./src/routes/favorites.js"


//crear constante que es igual a la libreria que importe
const app = express();

//Que acepte datos de json
app.use(express.json());

//Definir las rutas de las funciones que tendra la pagina web
app.use("/api/administrators", administratorsRoutes);
app.use("/api/favorites", favoritesRoutes);

//exporto la constante para poder usar express en otros archivos
export default app;
//ESCRIBIR UNA LINEA ADICIONAL EN EL package.json hasta arriba   [  "type": "module",  ] es la linea y tambien en scripts "dev": "nodemon index.js"

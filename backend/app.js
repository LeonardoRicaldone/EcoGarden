//express es un servidor que me dara una red

//importo todo lo de la libreria de express
import express from "express";
import categoriesRoutes from "./src/routes/categories.js";
import ratingsRoutes from "./src/routes/ratings.js";
import administratorsRoutes from "./src/routes/administrators.js"
import clientsRoutes from "./src/routes/clients.js"
import favoritesRoutes from "./src/routes/favorites.js"
import productsRoutes from "./src/routes/products.js"
import salesRoutes from "./src/routes/sales.js"
import shopingCartRoutes from "./src/routes/shopingCart.js"





//crear constante que es igual a la libreria que importe
const app = express();

//Que acepte datos de json
app.use(express.json());

//Definir las rutas de las funciones que tendra la pagina web
app.use("/api/categories", categoriesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/administrators", administratorsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/shopingCart", shopingCartRoutes);




//exporto la constante para poder usar express en otros archivos
export default app;
//ESCRIBIR UNA LINEA ADICIONAL EN EL package.json hasta arriba   [  "type": "module",  ] es la linea y tambien en scripts "dev": "nodemon index.js"

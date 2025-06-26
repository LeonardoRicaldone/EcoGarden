//express es un servidor que me dara una red
import cors from "cors";

//importo todo lo de la libreria de express
import express from "express";
import categoriesRoutes from "./src/routes/categories.js";
import ratingsRoutes from "./src/routes/ratings.js";
import employeesRoutes from "./src/routes/employees.js"
import clientsRoutes from "./src/routes/clients.js"
import favoritesRoutes from "./src/routes/favorites.js"
import productsRoutes from "./src/routes/products.js"
import salesRoutes from "./src/routes/sales.js"
import shoppingCartRoutes from "./src/routes/shoppingCart.js"
import loginRoutes from "./src/routes/login.js"
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js"

import cookieParser from "cookie-parser";
/*import { validateAuthToken } from "../src/middlewares/ValidateAuthToken.js";*/

import contactRoutes from './src/routes/contactRoutes.js';

//crear constante que es igual a la libreria que importe
const app = express();

app.use(
    cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

//Que acepte datos de json
app.use(express.json());

//Que postman acepte guardar cookies
app.use(cookieParser());

//Definir las rutas de las funciones que tendra la pagina web
app.use("/api/categories", categoriesRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/shoppingCart", shoppingCartRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);
app.use('/api/contact', contactRoutes);

//exporto la constante para poder usar express en otros archivos
export default app;
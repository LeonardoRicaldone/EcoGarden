import express from "express";
import favoritesController from "../controllers/favoritesController.js";
//Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();
 
router.route("/")
.get(favoritesController.getFavorites)
.post(favoritesController.createFavorites)
 
router.route("/:id")
.put(favoritesController.updateFavorites)
.delete(favoritesController.deleteFavorites)
 
export default router;
import express from "express";
import shoppingCartController from "../controllers/shoppingCartController.js";

//Router nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(shoppingCartController.getShoppingCart)
.post(shoppingCartController.createShoppingCart)

router.route("/:id")
.put(shoppingCartController.updateShoppingCart)
.delete(shoppingCartController.deleteShoppingCart);

export default router;
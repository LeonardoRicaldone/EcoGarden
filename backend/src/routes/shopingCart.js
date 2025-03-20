import express from "express";
import shopingCartController from "./controllers/shopingCartController.js";

//Router nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(shopingCartController.getShopingCart)
.post(shopingCartController.createShopingCart)

router.route("/:id")
.put(shopingCartController.updateShopingCart)
.delete(shopingCartController.deleteShopingCart);

export default router;
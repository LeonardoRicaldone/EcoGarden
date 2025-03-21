import express from "express";
import administratorsController from "../controllers/administratorsController.js";
//Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(administratorsController.getAdministrators)
.post(administratorsController.createAdministrators)

router.route("/:id")
.put(administratorsController.updateAdministrators)
.delete(administratorsController.deleteAdministrators)

export default router;
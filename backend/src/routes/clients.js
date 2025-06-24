import express from "express";
import clientsController from "../controllers/clientsController.js";
import registerClientsController from "../controllers/registerClientsController.js";

//Router nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(clientsController.getClients)
.post(clientsController.createClients)

router.route("/:id")
.put(clientsController.updateClients)
.delete(clientsController.deleteClients);

router.post("/register", registerClientsController.register);

export default router;
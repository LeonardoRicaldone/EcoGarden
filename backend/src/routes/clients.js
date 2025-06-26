import express from "express";
import clientsController from "../controllers/clientsController.js";
import registerClientsController from "../controllers/registerClientsController.js";

const router = express.Router();

router.route("/")
.get(clientsController.getClients)
.post(clientsController.createClients)

router.route("/:id")
.put(clientsController.updateClients)
.delete(clientsController.deleteClients);

// Ruta para registro de cliente
router.post("/register", registerClientsController.register);

// Ruta para verificar código de email
router.post("/verify-email", registerClientsController.verifyCodeEmail);

// Ruta para reenviar código de verificación
router.post("/resend-verification", registerClientsController.resendVerificationCode);

export default router;
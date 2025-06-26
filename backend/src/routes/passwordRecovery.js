import { Router } from "express";
import passwordRecoveryController from "../controllers/passwordRecovery.js";

const router = Router();

// POST - Solicitar código de recuperación
router.post("/request-code", passwordRecoveryController.requestCode);

// POST - Verificar código de recuperación
router.post("/verify-code", passwordRecoveryController.verifyCode);

// POST - Establecer nueva contraseña
router.post("/new-password", passwordRecoveryController.newPassword);

export default router;
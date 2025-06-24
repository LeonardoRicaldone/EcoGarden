import express from "express"
import loginController from "../controllers/loginController.js";
import { validateAuthToken } from "../middlewares/ValidateAuthToken.js"; 

const router = express.Router();

router.post("/", loginController.login);

router.get("/verify", loginController.verify);

router.post("/logout", validateAuthToken(), loginController.logout);

router.post("/logout", loginController.logout);

export default router;
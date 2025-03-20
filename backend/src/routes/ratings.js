import express from "express";
import ratingsController from "../controllers/ratingsController.js";
//Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(ratingsController.getRatings)
.post(ratingsController.createRatings)

router.route("/:id")
.put(ratingsController.updateRatings)
.delete(ratingsController.deleteRatings)

export default router;


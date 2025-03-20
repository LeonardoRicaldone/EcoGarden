import express from "express";
import categoriesController from "../controllers/categoriesController.js";
//Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(categoriesController.getCategories)
.post(categoriesController.createCategories)

router.route("/:id")
.put(categoriesController.updateCategories)
.delete(categoriesController.deleteCategories)

export default router;
import { Router } from "express";
import ratingsController from "../controllers/ratingsController.js";

const router = Router();

router.get("/", ratingsController.getRatings);

// GET - Obtener ratings de un producto específico con estadísticas
router.get("/product/:productId", ratingsController.getProductRatings);

// GET - Obtener rating de un usuario para un producto específico
router.get("/product/:productId/user/:clientId", ratingsController.getUserProductRating);

// POST - Crear nuevo rating
router.post("/", ratingsController.createRatings);

// PUT - Actualizar rating
router.put("/:id", ratingsController.updateRatings);

// DELETE - Eliminar rating
router.delete("/:id", ratingsController.deleteRatings);

export default router;
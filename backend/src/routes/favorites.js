import { Router } from "express";
import favoritesController from "../controllers/favoritesController.js";

const router = Router();

// IMPORTANTE: El orden de las rutas importa
// Las rutas más específicas deben ir ANTES que las generales

// POST - Crear favorito
router.post("/", favoritesController.createFavorites);

// DELETE sin parámetro - Eliminar por body (idProduct + idClient)
router.delete("/", favoritesController.deleteFavorites);

// GET all - Obtener todos los favoritos (para admin)
router.get("/all", favoritesController.getFavorites);

// GET por cliente - DEBE ir después de /all
router.get("/:clientId", favoritesController.getFavoritesByClient);

// DELETE con parámetro - Eliminar por ID
router.delete("/:id", favoritesController.deleteFavorites);

// PUT - Actualizar favorito
router.put("/:id", favoritesController.updateFavorites);

export default router;
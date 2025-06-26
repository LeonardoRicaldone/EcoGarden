import express from "express";
import shoppingCartController from "../controllers/shoppingCartController.js";

const router = express.Router();

// GET - Obtener todos los carritos (solo para admin)
router.get("/", shoppingCartController.getShoppingCart);

// GET - Obtener carrito PENDIENTE por cliente
router.get("/client/:clientId", shoppingCartController.getCartByClient);

// NUEVO - GET - Obtener historial de carritos pagados por cliente
router.get("/client/:clientId/history", shoppingCartController.getCartHistoryByClient);

// POST - Crear nuevo carrito (se asegura de no duplicar carritos pendientes)
router.post("/", shoppingCartController.createShoppingCart);

// PUT - Actualizar carrito (solo carritos pendientes)
router.put("/:id", shoppingCartController.updateShoppingCart);

// PATCH - Vaciar carrito (solo carritos pendientes)
router.patch("/:id/clear", shoppingCartController.clearCart);

// PATCH - Marcar como pagado (proceso de checkout)
router.patch("/:id/paid", shoppingCartController.markAsPaid);

// DELETE - Eliminar carrito (solo carritos pendientes)
router.delete("/:id", shoppingCartController.deleteShoppingCart);

router.get('/:id', shoppingCartController.getCartById);

export default router;
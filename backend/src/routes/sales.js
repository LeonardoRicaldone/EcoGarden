import express from "express";
import salesController from "../controllers/salesController.js";

const router = express.Router();

// Rutas principales
router.route("/")
    .get(salesController.getSales)      // GET /api/sales - Obtener todas las ventas
    .post(salesController.createSales); // POST /api/sales - Crear nueva venta

// Ruta para estadísticas
router.route("/stats")
    .get(salesController.getSalesStats); // GET /api/sales/stats - Obtener estadísticas

// Rutas por ID (debe ir después de rutas específicas como /stats)
router.route("/:id")
    .get(salesController.getSaleById)    // GET /api/sales/:id - Obtener venta por ID
    .put(salesController.updateSales)    // PUT /api/sales/:id - Actualizar venta
    .delete(salesController.deleteSales); // DELETE /api/sales/:id - Eliminar venta

export default router;
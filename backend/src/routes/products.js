import productsController from "../controllers/productsController.js";
import { Router } from "express";

const router = Router();

// GET - Obtener todos los productos
router.get("/", productsController.getProducts);

// NUEVO - GET - Obtener producto por ID (debe ir ANTES de las rutas con parámetros)
router.get("/:id", productsController.getProductById);

// POST - Crear nuevo producto (con imagen)
router.post("/", 
    productsController.uploadImage, 
    productsController.createProducts
);

// PUT - Actualizar producto (con imagen opcional)
router.put("/:id", 
    productsController.uploadImage, 
    productsController.updateProducts
);

// NUEVO - PATCH - Actualizar solo el stock (para compras)
router.patch("/:id/stock", productsController.updateStock);

// DELETE - Eliminar producto
router.delete("/:id", productsController.deleteProducts);

export default router;
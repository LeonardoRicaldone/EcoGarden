import productsController from "../controllers/productsController.js";
import { Router } from "express";

const router = Router();

// GET - Obtener todos los productos
router.get("/", productsController.getProducts);

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

// DELETE - Eliminar producto
router.delete("/:id", productsController.deleteProducts);

export default router;
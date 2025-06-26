const shoppingCartController = {};
import shoppingCartModel from "../models/ShoppingCart.js"
import mongoose from "mongoose"; // AGREGADO: para convertir ObjectId

// SELECT por cliente - Obtener carrito PENDIENTE de un cliente específico
shoppingCartController.getCartByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log('Getting pending cart for client:', clientId);

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente requerido"
            });
        }

        // CORREGIDO: Convertir string a ObjectId
        let objectIdClient;
        try {
            objectIdClient = new mongoose.Types.ObjectId(clientId);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente inválido"
            });
        }

        // IMPORTANTE: Solo buscar carritos con status "Pending"
        const cart = await shoppingCartModel.findOne({ 
            idClient: objectIdClient, // USAR ObjectId convertido
            status: "Pending" 
        })
        .populate('idClient')
        .populate('products.idProduct');

        if (!cart) {
            console.log('No pending cart found for client:', clientId);
            return res.status(404).json({
                success: false,
                message: "No hay carrito pendiente para este cliente"
            });
        }

        console.log('Pending cart found for client:', cart._id);
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener carrito por cliente:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener carrito",
            error: error.message
        });
    }
};

// INSERT - Crear carrito (MEJORADO para evitar duplicados)
shoppingCartController.createShoppingCart = async (req, res) => {
    try {
        const { idClient, products, total, status } = req.body;
        console.log('Creating cart:', { idClient, productsCount: products?.length, total, status });

        // Validar datos requeridos
        if (!idClient) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente requerido"
            });
        }

        // CORREGIDO: Convertir string a ObjectId
        let objectIdClient;
        try {
            objectIdClient = new mongoose.Types.ObjectId(idClient);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente inválido"
            });
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Productos requeridos"
            });
        }

        // Validar que cada producto tenga los campos requeridos
        for (const product of products) {
            if (!product.idProduct || !product.quantity || product.subtotal === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Cada producto debe tener idProduct, quantity y subtotal"
                });
            }
        }

        // CRÍTICO: Verificar si ya existe un carrito pendiente para este cliente
        const existingCart = await shoppingCartModel.findOne({ 
            idClient: objectIdClient, // USAR ObjectId convertido
            status: "Pending" 
        });

        if (existingCart) {
            console.log('Cart already exists, updating instead of creating:', existingCart._id);
            // Si existe, actualizarlo en lugar de crear uno nuevo
            const updatedCart = await shoppingCartModel.findByIdAndUpdate(
                existingCart._id,
                { 
                    products, 
                    total: total || 0, 
                    status: status || "Pending" 
                },
                { 
                    new: true, 
                    runValidators: true,
                    populate: [
                        { path: 'idClient' },
                        { path: 'products.idProduct' }
                    ]
                }
            );

            return res.status(200).json({ 
                success: true,
                message: "Carrito actualizado exitosamente",
                cart: updatedCart
            });
        }

        // Solo crear si no existe un carrito pendiente
        const newShoppingCart = new shoppingCartModel({
            idClient: objectIdClient, // USAR ObjectId convertido
            products, 
            total: total || 0, 
            status: status || "Pending"
        });
        
        const savedCart = await newShoppingCart.save();
        
        // Populate para devolver el carrito completo
        const populatedCart = await shoppingCartModel.findById(savedCart._id)
            .populate('idClient')
            .populate('products.idProduct');

        console.log('New cart created successfully:', savedCart._id);
        
        res.status(201).json({ 
            success: true,
            message: "Carrito creado exitosamente",
            cart: populatedCart
        });
    } catch (error) {
        console.error("Error al crear carrito:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al crear carrito", 
            error: error.message 
        });
    }
}

// SELECT - Obtener todos los carritos
shoppingCartController.getShoppingCart = async (req, res) => {
    try {
        const shoppingCart = await shoppingCartModel.find()
            .populate('idClient')
            .populate('products.idProduct');
        res.json(shoppingCart);
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener carritos", 
            error: error.message 
        });
    }
}

// UPDATE - Actualizar carrito existente
shoppingCartController.updateShoppingCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { idClient, products, total, status } = req.body;
        
        console.log('Updating cart:', id, { 
            idClient, 
            productsCount: products?.length, 
            total, 
            status 
        });

        // Validar que el ID sea válido
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID del carrito requerido"
            });
        }

        // Validar que el carrito existe
        const existingCart = await shoppingCartModel.findById(id);
        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        // Solo permitir actualizar carritos pendientes
        if (existingCart.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "No se puede modificar un carrito ya pagado"
            });
        }

        // Preparar datos de actualización
        const updateData = {
            status: status || "Pending"
        };

        // Solo actualizar productos si se proporcionan
        if (products !== undefined) {
            if (!Array.isArray(products)) {
                return res.status(400).json({
                    success: false,
                    message: "Productos debe ser un array"
                });
            }

            // Validar productos si hay alguno
            if (products.length > 0) {
                for (const product of products) {
                    if (!product.idProduct || !product.quantity || product.subtotal === undefined) {
                        return res.status(400).json({
                            success: false,
                            message: "Cada producto debe tener idProduct, quantity y subtotal"
                        });
                    }
                }
            }

            updateData.products = products;
        }

        // Solo actualizar total si se proporciona
        if (total !== undefined) {
            updateData.total = total;
        }

        // Si se proporciona idClient, incluirlo (convertir a ObjectId)
        if (idClient) {
            try {
                updateData.idClient = new mongoose.Types.ObjectId(idClient);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "ID del cliente inválido"
                });
            }
        }

        console.log('Update data:', updateData);

        const updatedCart = await shoppingCartModel.findByIdAndUpdate(
            id, 
            updateData,
            { 
                new: true, 
                runValidators: true,
                populate: [
                    { path: 'idClient' },
                    { path: 'products.idProduct' }
                ]
            }
        );

        if (!updatedCart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado después de la actualización"
            });
        }

        console.log('Cart updated successfully:', updatedCart._id);

        res.json({
            success: true,
            message: "Carrito actualizado exitosamente",
            cart: updatedCart
        });
    } catch (error) {
        console.error("Error al actualizar carrito:", error);
        
        // Manejar errores específicos de MongoDB
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Datos de carrito inválidos",
                error: error.message
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de carrito inválido",
                error: error.message
            });
        }

        res.status(500).json({ 
            success: false,
            message: "Error al actualizar carrito", 
            error: error.message 
        });
    }
};

// Vaciar carrito (mantener pero sin productos)
shoppingCartController.clearCart = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el carrito existe y está pendiente
        const existingCart = await shoppingCartModel.findById(id);
        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        if (existingCart.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "No se puede vaciar un carrito ya pagado"
            });
        }
        
        const updatedCart = await shoppingCartModel.findByIdAndUpdate(
            id,
            { 
                products: [], 
                total: 0 
            },
            { 
                new: true,
                populate: [
                    { path: 'idClient' },
                    { path: 'products.idProduct' }
                ]
            }
        );

        res.json({
            success: true,
            message: "Carrito vaciado exitosamente",
            cart: updatedCart
        });
    } catch (error) {
        console.error("Error al vaciar carrito:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al vaciar carrito", 
            error: error.message 
        });
    }
};

// Marcar carrito como pagado (MEJORADO)
shoppingCartController.markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el carrito existe
        const existingCart = await shoppingCartModel.findById(id);
        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        // Verificar que el carrito está pendiente
        if (existingCart.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "El carrito ya está marcado como pagado"
            });
        }

        // Verificar que tiene productos
        if (!existingCart.products || existingCart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se puede procesar un carrito vacío"
            });
        }
        
        const updatedCart = await shoppingCartModel.findByIdAndUpdate(
            id,
            { status: "Paid" },
            { 
                new: true,
                populate: [
                    { path: 'idClient' },
                    { path: 'products.idProduct' }
                ]
            }
        );

        console.log(`Cart ${id} marked as paid successfully`);

        res.json({
            success: true,
            message: "Carrito marcado como pagado exitosamente",
            cart: updatedCart
        });
    } catch (error) {
        console.error("Error al marcar carrito como pagado:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al procesar pago", 
            error: error.message 
        });
    }
};

// DELETE - Eliminar carrito (MEJORADO con restricciones)
shoppingCartController.deleteShoppingCart = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el carrito existe
        const existingCart = await shoppingCartModel.findById(id);
        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        // Opcional: Evitar eliminar carritos pagados
        if (existingCart.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar un carrito ya pagado"
            });
        }
        
        await shoppingCartModel.findByIdAndDelete(id);

        res.json({ 
            success: true,
            message: "Carrito eliminado exitosamente" 
        });
    } catch (error) {
        console.error("Error al eliminar carrito:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al eliminar carrito", 
            error: error.message 
        });
    }
}

// NUEVO: Obtener historial de carritos pagados por cliente
shoppingCartController.getCartHistoryByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log('Getting cart history for client:', clientId);

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente requerido"
            });
        }

        // CORREGIDO: Convertir string a ObjectId
        let objectIdClient;
        try {
            objectIdClient = new mongoose.Types.ObjectId(clientId);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente inválido"
            });
        }

        const cartHistory = await shoppingCartModel.find({ 
            idClient: objectIdClient, // USAR ObjectId convertido
            status: "Paid" 
        })
        .populate('idClient')
        .populate('products.idProduct')
        .sort({ createdAt: -1 }); // Más recientes primero

        res.json({
            success: true,
            message: `${cartHistory.length} carritos encontrados en el historial`,
            carts: cartHistory
        });
    } catch (error) {
        console.error("Error al obtener historial de carritos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener historial de carritos",
            error: error.message
        });
    }
};

// Agregar esta función a tu shoppingCartController.js

// SELECT por ID - Obtener carrito específico por ID
shoppingCartController.getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Getting cart by ID:', id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID del carrito requerido"
            });
        }

        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID del carrito inválido"
            });
        }

        const cart = await shoppingCartModel.findById(id)
            .populate('idClient')
            .populate('products.idProduct');

        if (!cart) {
            console.log('Cart not found:', id);
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        console.log('Cart found:', cart._id, 'Total:', cart.total);
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener carrito por ID:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener carrito",
            error: error.message
        });
    }
};


export default shoppingCartController;
const salesController = {};
import salesModel from "../models/Sales.js";
import shoppingCartModel from "../models/ShoppingCart.js";
import mongoose from "mongoose";

// CREATE - Crear nueva venta
salesController.createSales = async (req, res) => {
    try {
        const {
            idShoppingCart,
            name,
            lastname,
            phone,
            department,
            city,
            zipCode,
            address,
            creditCard,
            total,
            status
        } = req.body;

        console.log('Creating sale with data:', {
            idShoppingCart,
            name,
            lastname,
            total,
            status
        });

        // Validar campos requeridos
        if (!idShoppingCart || !name || !lastname || !phone || 
            !department || !city || !zipCode || !address || 
            !creditCard || total === undefined) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        // Validar que el total sea un número válido
        if (typeof total !== 'number' || total <= 0) {
            return res.status(400).json({
                success: false,
                message: "El total debe ser un número mayor a 0"
            });
        }

        // Validar que idShoppingCart sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(idShoppingCart)) {
            return res.status(400).json({
                success: false,
                message: "ID del carrito inválido"
            });
        }

        // Verificar que el carrito existe y está en estado "Pending"
        const cart = await shoppingCartModel.findById(idShoppingCart);
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Carrito no encontrado"
            });
        }

        if (cart.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "El carrito no está disponible para venta"
            });
        }

        // Verificar que el carrito tiene productos
        if (!cart.products || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se puede crear una venta con un carrito vacío"
            });
        }

        // VALIDACIÓN ELIMINADA: Ya no validamos que el total coincida con el carrito
        // La venta puede tener un total diferente (con descuentos, impuestos, etc.)
        console.log(`Cart total: $${cart.total}, Sale total: $${total}`);

        // Crear la nueva venta
        const newSale = new salesModel({
            idShoppingCart: new mongoose.Types.ObjectId(idShoppingCart),
            name: name.trim(),
            lastname: lastname.trim(),
            phone: phone.trim(),
            department: department.trim(),
            city: city.trim(),
            zipCode: zipCode.trim(),
            address: address.trim(),
            creditCard: creditCard.replace(/\s/g, ''), // Limpiar espacios
            total,
            status: status || "Pending"
        });

        const savedSale = await newSale.save();

        // Poblar la venta con datos del carrito
        const populatedSale = await salesModel.findById(savedSale._id)
            .populate({
                path: 'idShoppingCart',
                populate: [
                    { path: 'idClient' },
                    { path: 'products.idProduct' }
                ]
            });

        console.log('Sale created successfully:', savedSale._id);

        res.status(201).json({
            success: true,
            message: "Venta creada exitosamente",
            sale: populatedSale
        });

    } catch (error) {
        console.error("Error al crear venta:", error);

        // Manejar errores específicos
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Datos de venta inválidos",
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: "Error al crear venta",
            error: error.message
        });
    }
};

// READ - Obtener todas las ventas
salesController.getSales = async (req, res) => {
    try {
        const { status, clientId, page = 1, limit = 50 } = req.query;

        // Construir filtros
        const filters = {};
        
        if (status) {
            filters.status = status;
        }

        // Si se proporciona clientId, buscar por cliente a través del carrito
        if (clientId) {
            if (!mongoose.Types.ObjectId.isValid(clientId)) {
                return res.status(400).json({
                    success: false,
                    message: "ID del cliente inválido"
                });
            }

            // Encontrar carritos del cliente
            const clientCarts = await shoppingCartModel.find({
                idClient: new mongoose.Types.ObjectId(clientId)
            }).select('_id');

            const cartIds = clientCarts.map(cart => cart._id);
            filters.idShoppingCart = { $in: cartIds };
        }

        // Paginación
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const sales = await salesModel.find(filters)
            .populate({
                path: 'idShoppingCart',
                populate: [
                    { path: 'idClient' },
                    { path: 'products.idProduct' }
                ]
            })
            .sort({ createdAt: -1 }) // Más recientes primero
            .skip(skip)
            .limit(parseInt(limit));

        // Contar total para paginación
        const total = await salesModel.countDocuments(filters);

        res.json({
            success: true,
            sales,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                count: sales.length,
                totalSales: total
            }
        });

    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener ventas",
            error: error.message
        });
    }
};

// READ - Obtener venta por ID
salesController.getSaleById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        const sale = await salesModel.findById(id)
            .populate({
                path: 'idShoppingCart',
                populate: [
                    { path: 'idClient' },
                    { path: 'products.idProduct' }
                ]
            });

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        res.json({
            success: true,
            sale
        });

    } catch (error) {
        console.error("Error al obtener venta:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener venta",
            error: error.message
        });
    }
};

// UPDATE - Actualizar venta (principalmente para cambiar status)
salesController.updateSales = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        // Verificar que la venta existe
        const existingSale = await salesModel.findById(id);
        if (!existingSale) {
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        // Lista de campos que se pueden actualizar
        const allowedUpdates = ['status', 'phone', 'address', 'department', 'city', 'zipCode'];
        const updateData = {};

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = updates[key];
            }
        });

        // Validar status si se está actualizando
        if (updateData.status) {
            const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
            if (!validStatuses.includes(updateData.status)) {
                return res.status(400).json({
                    success: false,
                    message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`
                });
            }
        }

        // Prevenir actualización de campos críticos
        if (updates.total !== undefined || updates.creditCard !== undefined || 
            updates.idShoppingCart !== undefined) {
            return res.status(400).json({
                success: false,
                message: "No se pueden modificar campos críticos como total, tarjeta de crédito o carrito"
            });
        }

        const updatedSale = await salesModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
                populate: {
                    path: 'idShoppingCart',
                    populate: [
                        { path: 'idClient' },
                        { path: 'products.idProduct' }
                    ]
                }
            }
        );

        console.log(`Sale ${id} updated successfully`);

        res.json({
            success: true,
            message: "Venta actualizada exitosamente",
            sale: updatedSale
        });

    } catch (error) {
        console.error("Error al actualizar venta:", error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Datos de actualización inválidos",
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: "Error al actualizar venta",
            error: error.message
        });
    }
};

// DELETE - Eliminar venta (con restricciones)
salesController.deleteSales = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        const existingSale = await salesModel.findById(id);
        if (!existingSale) {
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        // Restricción: no eliminar ventas que ya fueron procesadas
        if (existingSale.status === "Processing" || 
            existingSale.status === "Shipped" || 
            existingSale.status === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar una venta que ya está en proceso o completada"
            });
        }

        await salesModel.findByIdAndDelete(id);

        console.log(`Sale ${id} deleted successfully`);

        res.json({
            success: true,
            message: "Venta eliminada exitosamente"
        });

    } catch (error) {
        console.error("Error al eliminar venta:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar venta",
            error: error.message
        });
    }
};

// UTILITY - Obtener estadísticas de ventas
salesController.getSalesStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Construir filtros de fecha
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Estadísticas básicas
        const totalSales = await salesModel.countDocuments(dateFilter);
        const totalRevenue = await salesModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        // Ventas por estado
        const salesByStatus = await salesModel.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$total" } } }
        ]);

        // Promedio de venta
        const avgSale = totalRevenue.length > 0 && totalSales > 0 
            ? (totalRevenue[0].total / totalSales) 
            : 0;

        res.json({
            success: true,
            stats: {
                totalSales,
                totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
                averageSale: Math.round(avgSale * 100) / 100,
                salesByStatus,
                period: {
                    startDate: startDate || "No especificado",
                    endDate: endDate || "No especificado"
                }
            }
        });

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas",
            error: error.message
        });
    }
};

export default salesController;
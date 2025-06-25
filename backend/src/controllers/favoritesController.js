const favoritesController = {};
import { json } from "express";
import Favorites from "../models/Favorites.js";
import Products from "../models/Products.js";

// SELECT por cliente - CON DEBUG MÁXIMO
favoritesController.getFavoritesByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log('=== DEBUG FAVORITOS ===');
        console.log('1. Client ID received:', clientId);

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "ID del cliente requerido"
            });
        }

        // PASO 1: Verificar que existen favoritos sin populate
        console.log('2. Checking raw favorites...');
        const rawFavorites = await Favorites.find({ idClient: clientId });
        console.log('2.1 Raw favorites found:', rawFavorites.length);
        rawFavorites.forEach((fav, index) => {
            console.log(`2.2 Raw favorite ${index}:`, {
                id: fav._id,
                idProduct: fav.idProduct,
                idClient: fav.idClient,
                idProductType: typeof fav.idProduct,
                idClientType: typeof fav.idClient
            });
        });

        if (rawFavorites.length === 0) {
            console.log('2.3 No raw favorites found, returning empty array');
            return res.json([]);
        }

        // PASO 2: Verificar que los productos existen
        console.log('3. Checking if products exist...');
        for (const fav of rawFavorites) {
            const productExists = await Products.findById(fav.idProduct);
            console.log(`3.1 Product ${fav.idProduct} exists:`, !!productExists);
            if (productExists) {
                console.log(`3.2 Product details:`, {
                    id: productExists._id,
                    name: productExists.name,
                    descripcion: productExists.descripcion
                });
            }
        }

        // PASO 3: Intentar populate
        console.log('4. Attempting populate...');
        const favorites = await Favorites.find({ idClient: clientId })
            .populate('idProduct');

        console.log('4.1 Favorites with populate:', favorites.length);
        
        favorites.forEach((fav, index) => {
            console.log(`4.2 Populated favorite ${index}:`, {
                favoriteId: fav._id,
                hasProduct: !!fav.idProduct,
                productDetails: fav.idProduct ? {
                    id: fav.idProduct._id,
                    name: fav.idProduct.name,
                    price: fav.idProduct.price,
                    descripcion: fav.idProduct.descripcion
                } : 'NULL'
            });
        });

        // PASO 4: Formatear respuesta
        console.log('5. Formatting response...');
        const formattedFavorites = [];
        
        for (const fav of favorites) {
            if (!fav.idProduct) {
                console.log('5.1 WARNING: Favorite without product:', fav._id);
                continue;
            }
            
            const formatted = {
                id: fav.idProduct._id.toString(),
                idProduct: fav.idProduct._id.toString(),
                idClient: fav.idClient.toString(),
                name: fav.idProduct.name,
                price: fav.idProduct.price,
                description: fav.idProduct.descripcion || '',
                imgProduct: fav.idProduct.imgProduct,
                stock: fav.idProduct.stock,
                idCategory: fav.idProduct.idCategory ? fav.idProduct.idCategory.toString() : null,
                isFavorite: true,
                rating: fav.idProduct.rating || 3
            };
            
            console.log('5.2 Formatted favorite:', formatted);
            formattedFavorites.push(formatted);
        }

        console.log('6. Final result:', formattedFavorites.length, 'favorites');
        console.log('=== END DEBUG ===');
        
        res.json(formattedFavorites);
    } catch (error) {
        console.error("=== ERROR IN FAVORITES ===");
        console.error("Error details:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Error al obtener favoritos",
            error: error.message
        });
    }
};

// INSERT - Crear favorito CON DEBUG
favoritesController.createFavorites = async (req, res) => {
    try {
        const { idProduct, idClient } = req.body;
        console.log('=== DEBUG CREATE FAVORITE ===');
        console.log('1. Request body:', { idProduct, idClient });

        if (!idProduct || !idClient) {
            return res.status(400).json({
                success: false,
                message: "ID del producto e ID del cliente son requeridos"
            });
        }

        // Verificar si ya existe
        console.log('2. Checking if favorite exists...');
        const existingFavorite = await Favorites.findOne({
            idProduct: idProduct,
            idClient: idClient
        });

        if (existingFavorite) {
            console.log('2.1 Favorite already exists:', existingFavorite._id);
            return res.status(409).json({
                success: false,
                message: "El producto ya está en favoritos"
            });
        }

        // Verificar que el producto existe
        console.log('3. Checking if product exists...');
        const product = await Products.findById(idProduct);
        console.log('3.1 Product found:', !!product);
        if (product) {
            console.log('3.2 Product details:', {
                id: product._id,
                name: product.name,
                descripcion: product.descripcion
            });
        }
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        // Crear favorito
        console.log('4. Creating favorite...');
        const newFavorite = new Favorites({ 
            idProduct: idProduct, 
            idClient: idClient 
        });
        const savedFavorite = await newFavorite.save();
        
        console.log('4.1 Favorite created successfully:', {
            id: savedFavorite._id,
            idProduct: savedFavorite.idProduct,
            idClient: savedFavorite.idClient
        });
        console.log('=== END CREATE DEBUG ===');

        res.json({
            success: true,
            message: "Favorito guardado correctamente",
            favorite: savedFavorite
        });
    } catch (error) {
        console.error("=== ERROR CREATING FAVORITE ===");
        console.error("Error details:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Error al crear favorito",
            error: error.message
        });
    }
}

// DELETE - Eliminar favorito
favoritesController.deleteFavorites = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (id) {
            // Eliminar por ID (parámetro en URL)
            console.log('Deleting favorite by ID:', id);
            const deletedFavorite = await Favorites.findByIdAndDelete(id);
            
            if (!deletedFavorite) {
                return res.status(404).json({
                    success: false,
                    message: "Favorito no encontrado"
                });
            }
            
            res.json({ 
                success: true, 
                message: "Favorito eliminado correctamente" 
            });
        } else {
            // Eliminar por producto y cliente (body)
            const { idProduct, idClient } = req.body;
            console.log('Deleting favorite by product and client:', { idProduct, idClient });
            
            if (!idProduct || !idClient) {
                return res.status(400).json({
                    success: false,
                    message: "ID del producto e ID del cliente son requeridos"
                });
            }

            const deletedFavorite = await Favorites.findOneAndDelete({
                idProduct: idProduct,
                idClient: idClient
            });

            console.log('Deleted favorite:', !!deletedFavorite);

            if (!deletedFavorite) {
                return res.status(404).json({
                    success: false,
                    message: "Favorito no encontrado"
                });
            }

            res.json({
                success: true,
                message: "Favorito eliminado correctamente"
            });
        }
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar favorito",
            error: error.message
        });
    }
}

// SELECT - Obtener todos los favoritos
favoritesController.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.find().populate('idProduct').populate('idClient');
        res.json({
            success: true,
            favorites: favorites
        });
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener favoritos", 
            error: error.message 
        });
    }
}

// UPDATE - Actualizar favorito
favoritesController.updateFavorites = async (req, res) => {
    try {
        const { idProduct, idClient } = req.body;
        
        const updatedFavorite = await Favorites.findByIdAndUpdate(
            req.params.id,
            { idProduct, idClient },
            { new: true }
        );

        if (!updatedFavorite) {
            return res.status(404).json({
                success: false,
                message: "Favorito no encontrado"
            });
        }

        res.json({
            success: true,
            message: "Favorito actualizado correctamente",
            favorite: updatedFavorite
        });
    } catch (error) {
        console.error("Error al actualizar favorito:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar favorito",
            error: error.message
        });
    }
};

export default favoritesController;
const ratingsController = {};
import { json } from "express";
import Ratings from "../models/Ratings.js";

//SELECT - obtener todos los ratings o filtrar por producto
ratingsController.getRatings = async (req, res) => {
    try {
        const { productId } = req.query;
        
        let query = {};
        
        // Si se proporciona productId, filtrar por ese producto
        if (productId) {
            query.idProduct = productId;
        } else {
            // Solo obtener ratings que tengan idProduct no null
            query.idProduct = { $ne: null };
        }
        
        const ratings = await Ratings.find(query)
            .populate('idProduct', 'name price imgProduct') 
            .populate('idClient', 'name email') 
            .sort({ createdAt: -1 });
        
        res.json(ratings);
    } catch (error) {
        console.error('Error al obtener ratings:', error);
        res.status(500).json({ 
            message: "Error al obtener ratings", 
            error: error.message 
        });
    }
}

//SELECT - obtener rating de un producto específico
ratingsController.getProductRatings = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const ratings = await Ratings.find({ 
            idProduct: productId
        })
            .populate('idClient', 'name email')
            .sort({ createdAt: -1 });
        
        // Calcular estadísticas del rating
        const totalRatings = ratings.length;
        const averageScore = totalRatings > 0 
            ? parseFloat((ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings).toFixed(1))
            : 0;
        
        res.json({
            ratings,
            statistics: {
                totalRatings,
                averageScore
            }
        });
    } catch (error) {
        console.error('Error al obtener ratings del producto:', error);
        res.status(500).json({ 
            message: "Error al obtener ratings del producto", 
            error: error.message 
        });
    }
}

//INSERT - crear nuevo rating
ratingsController.createRatings = async (req, res) => {
    try {
        const { comment, score, idProduct, idClient } = req.body;
        
        console.log('Creating rating with data:', { comment, score, idProduct, idClient });
        
        // Validaciones básicas
        if (!comment || !score || !idProduct || !idClient) {
            return res.status(400).json({ 
                message: "Todos los campos son requeridos: comment, score, idProduct, idClient" 
            });
        }
        
        const numericScore = parseFloat(score);
        console.log('Numeric score:', numericScore);
        
        if (isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
            return res.status(400).json({ 
                message: "El puntaje debe estar entre 1 y 5" 
            });
        }
        
        // Verificar si el usuario ya calificó este producto
        const existingRating = await Ratings.findOne({ 
            idProduct, 
            idClient 
        });
        
        if (existingRating) {
            return res.status(400).json({ 
                message: "Ya has calificado este producto. Solo puedes calificar una vez por producto." 
            });
        }
        
        const newRatings = new Ratings({ 
            comment: comment.trim(), 
            score: numericScore, 
            idProduct, 
            idClient 
        });
        
        const savedRating = await newRatings.save();
        
        // Poblar los datos para la respuesta
        const populatedRating = await Ratings.findById(savedRating._id)
            .populate('idProduct', 'name')
            .populate('idClient', 'name');
        
        res.status(201).json({
            message: "Rating guardado exitosamente",
            rating: populatedRating
        });
    } catch (error) {
        console.error('Error al crear rating:', error);
        res.status(500).json({ 
            message: "Error al guardar rating", 
            error: error.message 
        });
    }
}

//DELETE - eliminar rating
ratingsController.deleteRatings = async (req, res) => {
    try {
        const deletedRating = await Ratings.findByIdAndDelete(req.params.id);
        
        if (!deletedRating) {
            return res.status(404).json({ 
                message: "Rating no encontrado" 
            });
        }
        
        res.json({ 
            message: "Rating eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar rating:', error);
        res.status(500).json({ 
            message: "Error al eliminar rating", 
            error: error.message 
        });
    }
}

//UPDATE - actualizar rating
ratingsController.updateRatings = async (req, res) => {
    try {
        const { comment, score, idProduct, idClient } = req.body;
        
        // Validaciones
        if (score && (score < 1 || score > 5)) {
            return res.status(400).json({ 
                message: "El puntaje debe estar entre 1 y 5" 
            });
        }
        
        const updatedRating = await Ratings.findByIdAndUpdate(
            req.params.id, 
            {
                comment: comment?.trim(),
                score: score ? parseInt(score) : undefined,
                idProduct,
                idClient
            },
            { new: true }
        ).populate('idProduct', 'name').populate('idClient', 'name');
        
        if (!updatedRating) {
            return res.status(404).json({ 
                message: "Rating no encontrado" 
            });
        }
        
        res.json({
            message: "Rating actualizado exitosamente",
            rating: updatedRating
        });
    } catch (error) {
        console.error('Error al actualizar rating:', error);
        res.status(500).json({ 
            message: "Error al actualizar rating", 
            error: error.message 
        });
    }
};

//GET - obtener rating de un usuario para un producto específico
ratingsController.getUserProductRating = async (req, res) => {
    try {
        const { productId, clientId } = req.params;
        
        const rating = await Ratings.findOne({ 
            idProduct: productId, 
            idClient: clientId 
        }).populate('idProduct', 'name').populate('idClient', 'name');
        
        if (!rating) {
            return res.status(404).json({ 
                message: "El usuario no ha calificado este producto" 
            });
        }
        
        res.json(rating);
    } catch (error) {
        console.error('Error al obtener rating del usuario:', error);
        res.status(500).json({ 
            message: "Error al obtener rating del usuario", 
            error: error.message 
        });
    }
};

export default ratingsController;
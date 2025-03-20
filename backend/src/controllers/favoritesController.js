const favoritesController = {};
import { json } from "express";
import Favorites from "../models/Favorites.js"; 

//SELECT
favoritesController.getFavorites = async (req, res) => {
    const favorites = await Favorites.find().populate('idProduct').populate('idClient')
    res.json(favorites)
}
 
//INSERT
favoritesController.createFavorites = async (req, res) => {
    const {idProduct,
        idClient} = req.body;
    const newFavorites = new Favorites({idProduct,
        idClient});
    await newFavorites.save()
    res.json({message: "Favorites saved"});
}
 
//DELETE
favoritesController.deleteFavorites = async (req, res) => {
    await Favorites.findOneAndDelete(req.params.id)
    res.json({message: "Favorites delete"});
}
 
//UPDATE
favoritesController.updateFavorites = async (req, res) => {
    //Solicito todos los valores
    const {idProduct,
        idClient} = req.body;
    //Actualizo
    await Favorites.findByIdAndUpdate(req.params.id, {
        idProduct,
        idClient
    },
    {new: true}
);
    //Muestro un mensaje que todo se actualizo
    res.json({message: "Favorites update"});
};
 
export default favoritesController;
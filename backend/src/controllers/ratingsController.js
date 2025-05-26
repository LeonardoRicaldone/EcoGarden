const ratingsController = {};
import { json } from "express";
import Ratings from "../models/Ratings.js";

//SELECT
ratingsController.getRatings = async (req, res) => {
    const ratings = await Ratings.find().populate('idProduct').populate('idClient')
    res.json(ratings)
}

//INSERT
ratingsController.createRatings = async (req, res) => {
    const {comment, score, idProduct, idClient} = req.body;
    const newRatings = new Ratings({comment, score, idProduct, idClient});
    await newRatings.save()
    res.json({message: "Ratings saved"});
}

//DELETE
ratingsController.deleteRatings = async (req, res) => {
    await Ratings.findByIdAndDelete(req.params.id)
    res.json({message: "Ratings delete"});
}

//UPDATE
ratingsController.updateRatings = async (req, res) => {
    //Solicito todos los valores
    const {comment, score, idProduct, idClient} = req.body;
    //Actualizo
    await Ratings.findByIdAndUpdate(req.params.id, {
        comment, 
        score, 
        idProduct,
        idClient
    }, 
    {new: true}
);
    //Muestro un mensaje que todo se actualizo
    res.json({message: "Ratings update"});
};

export default ratingsController;
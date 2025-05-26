//Array de metodos (C R U D)
const categoriesController = {};
import {json} from "express";
import Categories from "../models/Categories.js";

//SELECT
categoriesController.getCategories = async (req, res) => {
    const categories = await Categories.find()
    res.json(categories)
}

//INSERT
categoriesController.createCategories = async (req, res) => {
    const {name} = req.body;
    const newCategories = new Categories({name});
    await newCategories.save()
    res.json({message: "Categories saved"});
}

//DELETE
categoriesController.deleteCategories = async (req, res) => {
    await Categories.findByIdAndDelete(req.params.id)
    res.json({message: "Categories delete"});
}

//UPDATE
categoriesController.updateCategories = async (req, res) => {
    //Solicito todos los valores
    const {name} = req.body;
    //Actualizo
    await Categories.findByIdAndUpdate(req.params.id, {
        name
    }, 
    {new: true}
);
    //Muestro un mensaje que todo se actualizo
    res.json({message: "Categories update"});
};

export default categoriesController;
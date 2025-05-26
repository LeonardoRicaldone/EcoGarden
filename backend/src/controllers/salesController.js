const salesController = {};
import { json } from "express";
import Sales from "../models/Sales.js";

//SELECT
salesController.getSales = async (req, res) => {
    const sales = await Sales.find().populate('idShoppingCart')
    res.json(sales)
}

//INSERT
salesController.createSales = async (req, res) => {
    const { idShoppingCart,
        name,
        lastname,
        phone,
        department,
        city,
        zipCode,
        address,
        creditCard,
        status } = req.body;
    const newSales = new Sales({
        idShoppingCart,
        name,
        lastname,
        phone,
        department,
        city,
        zipCode,
        address,
        creditCard,
        status
    });
    await newSales.save()
    res.json({ message: "Sales saved" });
}

//DELETE
salesController.deleteSales = async (req, res) => {
    await Sales.findByIdAndDelete(req.params.id)
    res.json({ message: "Sales delete" });
}

//UPDATE
salesController.updateSales = async (req, res) => {
    //Solicito todos los valores
    const { idShoppingCart,
        name,
        lastname,
        phone,
        department,
        city,
        zipCode,
        address,
        creditCard,
        status } = req.body;
    //Actualizo
    await Sales.findByIdAndUpdate(req.params.id, {
        idShoppingCart,
        name,
        lastname,
        phone,
        department,
        city,
        zipCode,
        address,
        creditCard,
        status
    },
        { new: true }
    );
    //Muestro un mensaje que todo se actualizo
    res.json({ message: "Sales update" });
};

export default salesController;
const salesController = {};
import { json } from "express";
import Sales from "../models/Sales.js";

//SELECT
salesController.getSales = async (req, res) => {
    try {
        const sales = await Sales.find().populate('idShoppingCart');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las ventas", error: error.message });
    }
}

//INSERT
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
            status,
            total
        } = req.body;
        
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
            status,
            total
        });
        
        await newSales.save();
        res.json({ message: "Sales saved", sale: newSales });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la venta", error: error.message });
    }
}

//DELETE
salesController.deleteSales = async (req, res) => {
    try {
        await Sales.findByIdAndDelete(req.params.id);
        res.json({ message: "Sales deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la venta", error: error.message });
    }
}

//UPDATE
salesController.updateSales = async (req, res) => {
    try {
        //Solicito todos los valores
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
            status,
            total
        } = req.body;
        
        //Actualizo
        const updatedSale = await Sales.findByIdAndUpdate(
            req.params.id, 
            {
                idShoppingCart,
                name,
                lastname,
                phone,
                department,
                city,
                zipCode,
                address,
                creditCard,
                status,
                total
            },
            { new: true }
        );
        
        if (!updatedSale) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        
        //Muestro un mensaje que todo se actualizo
        res.json({ message: "Sales updated", sale: updatedSale });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la venta", error: error.message });
    }
};

export default salesController;
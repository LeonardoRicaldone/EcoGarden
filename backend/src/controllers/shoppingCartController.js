const shoppingCartController = {};
import shoppingCartModel from "../models/ShoppingCart.js"

// SELECT
shoppingCartController.getShoppingCart = async (req, res) => {
    const shoppingCart = await shoppingCartModel.find().populate('idClient').populate('products')
    res.json(shoppingCart)
}

// INSERT
shoppingCartController.createShoppingCart = async (req, res) => {
    const { idClient, products, total, status } = req.body;
    const newshoppingCart = new shoppingCartModel({idClient, products, total, status});
    await newshoppingCart.save();

    res.json({ message: "shopping cart saved"});
}

// DELETE
shoppingCartController.deleteShoppingCart = async (req, res) => {
    await shoppingCartModel.findByIdAndDelete(req.params.id)
    res.json({ message: "shopping cart deleted"})
}

// UPDATE 
shoppingCartController.updateShoppingCart = async (req, res) => {
    //Solicito todos los valores 
    const {idClient, products, total, status} = req.body;
    //Actualizo
    await shoppingCartModel.findByIdAndUpdate(req.params.id, {idClient, products, total, status}, {new: true});
    //Muestro un mensaje que todo se actualizó
    res.json({message: "shopping cart updated"});
};

export default shoppingCartController;
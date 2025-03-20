const shopingCartController = {};
import shopingCartModel from "../models/ShopingCart.js"

// SELECT
shopingCartController.getShopingCart = async (req, res) => {
    const shopingCart = await shopingCartModel.find().populate('idCategory').populate('idProduct')
    res.json(shopingCart)
}

// INSERT
shopingCartController.createShopingCart = async (req, res) => {
    const { idClient, products, total, status } = req.body;
    const newshopingCart = new shopingCartModel({idClient, products, total, status});
    await newshopingCart.save();

    res.json({ message: "shoping cart saved"});
}

// DELETE
shopingCartController.deleteShopingCart = async (req, res) => {
    await shopingCartModel.findOneAndDelete(req.params.id)
    res.json({ message: "shoping cart deleted"})
}

// UPDATE 
shopingCartController.updateShopingCart = async (req, res) => {
    //Solicito todos los valores 
    const {idClient, products, total, status} = req.body;
    //Actualizo
    await shopingCartModel.findByIdAndUpdate(req.params.id, {idClient, products, total, status}, {new: true});
    //Muestro un mensaje que todo se actualizó
    res.json({message: "shoping cart updated"});
};

export default shopingCartController;
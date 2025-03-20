const productsController = {};
import productsModel from "../models/Products.js"

// SELECT
productsController.getProducts = async (req, res) => {
    const products = await productsModel.find().populate('idCategory')
    res.json(products)
}

// INSERT
productsController.createProducts = async (req, res) => {
    const { name, description, price, stock, imgProduct, idCategory } = req.body;
    const newProduct = new productsModel({name, description, price, stock, imgProduct, idCategory});
    await newProduct.save();

    res.json({ message: "product saved"});
}

// DELETE
productsController.deleteProducts = async (req, res) => {
    await productsModel.findOneAndDelete(req.params.id)
    res.json({ message: "product deleted"})
}

// UPDATE 
productsController.updateProducts = async (req, res) => {
    //Solicito todos los valores 
    const {name, description, price, stock, imgProduct, idCategory} = req.body;
    //Actualizo
    await productsModel.findByIdAndUpdate(req.params.id, {name, description, price, stock, imgProduct, idCategory}, {new: true});
    //Muestro un mensaje que todo se actualizó
    res.json({message: "product updated"});
};

export default productsController;
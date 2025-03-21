const clientsController = {};
import clientsModel from "../models/Clients.js"

// SELECT
clientsController.getClients = async (req, res) => {
    const clients = await clientsModel.find()
    res.json(clients)
}

// INSERT
clientsController.createClients = async (req, res) => {
    const { name, lastname, telephone, email, password } = req.body;
    const newClient = new clientsModel({name, lastname, telephone, email, password});
    await newClient.save();

    res.json({ message: "client saved"});
}

// DELETE
clientsController.deleteClients = async (req, res) => {
    await clientsModel.findOneAndDelete(req.params.id)
    res.json({ message: "client deleted"})
}

// UPDATE 
clientsController.updateClients = async (req, res) => {
    //Solicito todos los valores 
    const {name, lastname, telephone, email, password} = req.body;
    //Actualizo
    await clientsModel.findByIdAndUpdate(req.params.id, {name, lastname, telephone, email, password}, {new: true});
    //Muestro un mensaje que todo se actualizó
    res.json({message: "client updated"});
};

export default clientsController;
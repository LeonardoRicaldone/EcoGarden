//Array de metodos (C R U D)
const administratorsController = {};
import { json } from "express";
import Administrators from "../models/administrators.js";

//SELECT
administratorsController.getAdministrators = async (req, res) => {
    const administrators = await Administrators.find()
    res.json(administrators)
}

//INSERT
administratorsController.createAdministrators = async (req, res) => {
    const { name, address, telephone, schedule } = req.body;
    const newAdministrator = new Administrators({
        name,
        lastName,
        phone,
        email,
        password
    });
    await newAdministrator.save()
    res.json({ message: "Administrators saved" });
}

//DELETE
administratorsController.deleteAdministrators = async (req, res) => {
    await Administrators.findOneAndDelete(req.params.id)
    res.json({ message: "Administrators delete" });
}

//UPDATE
administratorsController.updateAdministrators = async (req, res) => {
    //Solicito todos los valores
    const { name,
        lastName,
        phone,
        email,
        password } = req.body;
    //Actualizo
    await Administrators.findByIdAndUpdate(req.params.id, {
        name,
        lastName,
        phone,
        email,
        password
    },
        { new: true }
    );
    //Muestro un mensaje que todo se actualizo
    res.json({ message: "Administrators update" });
};

export default administratorsController;
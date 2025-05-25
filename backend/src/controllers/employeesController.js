//Array de metodos (C R U D)
const employeesController = {};
import { json } from "express";
import Administrators from "../models/Employees.js";

//SELECT
employeesController.getEmployees = async (req, res) => {
    const administrators = await Administrators.find()
    res.json(administrators)
}

//INSERT
employeesController.createEmployees = async (req, res) => {
    const { name, lastname, phone, email, password} = req.body;
    const newAdministrator = new Administrators({
        name,
        lastname,
        phone,
        email,
        password
    });
    await newAdministrator.save()
    res.json({ message: "Employee saved" });
}

//DELETE
employeesController.deleteEmployees = async (req, res) => {
    await Administrators.findOneAndDelete(req.params.id)
    res.json({ message: "Employee deleted" });
}

//UPDATE
employeesController.updateEmployees = async (req, res) => {
    //Solicito todos los valores
    const { name,
        lastname,
        phone,
        email,
        password } = req.body;
    //Actualizo
    await Administrators.findByIdAndUpdate(req.params.id, {
        name,
        lastname,
        phone,
        email,
        password
    },
        { new: true }
    );
    //Muestro un mensaje que todo se actualizo
    res.json({ message: "Employee updated" });
};

export default employeesController;
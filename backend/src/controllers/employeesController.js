//Array de metodos (C R U D)
const employeesController = {};
import { json } from "express";
import Employees from "../models/Employees.js";

//SELECT
employeesController.getEmployees = async (req, res) => {
    const employees = await Employees.find()
    res.json(employees)
}

//INSERT
employeesController.createEmployees = async (req, res) => {
    const { name, lastname, phone, email, password} = req.body;
    const newEmployee = new Employees({
        name,
        lastname,
        phone,
        email,
        password
    });
    await newEmployee.save()
    res.json({ message: "Employee saved" });
}

//DELETE
employeesController.deleteEmployees = async (req, res) => {
    await Employees.findByIdAndDelete(req.params.id)
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
    await Employees.findByIdAndUpdate(req.params.id, {
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
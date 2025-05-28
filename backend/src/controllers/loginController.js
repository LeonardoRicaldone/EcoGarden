//Importamos modelos
import customersModel from "../models/Clients.js"
import employeesModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"; //Encriptar
import jsonwebtoken from "jsonwebtoken"; //Token
import { config } from "../utils/config.js"

//Array de funciones

const loginController = {};

loginController.login = async(req, res) => {
    //Pedimos las cosas
    const {email, password} = req.body;

    try {
        //Validamos los 3 posibles niveles
        //1. Admin, 2- Empleado, 3. Cliente

        let userFound; //Guarda el usuario encontrado
        let userType;  //Guarda el tipo de usuario encontrado

        //1. Admin
        if(email === config.ADMIN.emailAdmin && password === config.ADMIN.password) {
            userType = "admin";
            userFound = {_id: "admin"}
        } else {

            //2. Empleados
            userFound = await employeesModel.findOne({email})
            userType = "employee"

            if(!userFound) {
                //3. Cliente
                userFound = await customersModel.findOne({email})
                userType = "customer"
            }
        }

        //Si no encontramos a ningun usuario con esas credenciales
        if(!userFound){
            return res.json({message: "User not found"});
        }

        //Validar la contraseña
        //SOLO SI NO ES ADMIN
        if(userType !== "admin") {
            const isMatch = await bcryptjs.compare(password, userFound.password)
            if(!isMatch){
                return res.json({message: "Invalid password"})
            }
        }

        /// TOKEN
        //Para validar que inició sesión
        jsonwebtoken.sign(
            //1- Que voy a guardar
            {id: userFound._id, userType},
            //2- Secreto
            config.JWT.secret,
            //3- Cuando expira
            {expiresIn: config.JWT.expiresIn},
            //4- Función flecha
            (error, token) => {
                if(error) console.log("error" + error)
                res.cookie("authToken", token)
                res.json({message: "Login succesful"})
            }

        )

    } catch (error) {
        console.log("error" + error);
    }
};

    // 🔐 VERIFY TOKEN
loginController.verify = (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ ok: false, message: "No token provided" });
  }

  jsonwebtoken.verify(token, config.JWT.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    res.json({
      ok: true,
      user: {
        id: decoded.id,
        userType: decoded.userType,
      },
    });
  });
  };


export default loginController;
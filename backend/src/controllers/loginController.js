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
        let userData;  // ✅ NUEVO: Para almacenar los datos del usuario que devolveremos

        //1. Admin
        if(email === config.ADMIN.emailAdmin && password === config.ADMIN.password) {
            userType = "admin";
            userFound = {_id: "admin"}
            // ✅ NUEVO: Datos del admin
            userData = {
                id: "admin",
                email: config.ADMIN.emailAdmin,
                userType: "admin",
                name: "Administrador"
            }
        } else {

            //2. Empleados
            userFound = await employeesModel.findOne({email})
            
            if(userFound) {
                userType = "employee"
                // ✅ NUEVO: Datos del empleado
                userData = {
                    id: userFound._id,
                    email: userFound.email,
                    userType: "employee",
                    name: userFound.name || userFound.nombre || "Empleado",
                    // Agrega otros campos que necesites del empleado
                }
            } else {
                //3. Cliente
                userFound = await customersModel.findOne({email})
                if(userFound) {
                    userType = "customer"
                    // ✅ NUEVO: Datos del cliente
                    userData = {
                        id: userFound._id,
                        email: userFound.email,
                        userType: "customer",
                        name: userFound.name || userFound.nombre || "Cliente",
                        // Agrega otros campos que necesites del cliente
                    }
                }
            }
        }

        //Si no encontramos a ningun usuario con esas credenciales
        if(!userFound){
          return res.status(401).json({ success: false, message: "User not found" });
        }

        //Validar la contraseña
        //SOLO SI NO ES ADMIN
        if(userType !== "admin") {
            const isMatch = await bcryptjs.compare(password, userFound.password)
            if(!isMatch){
              return res.status(401).json({ success: false, message: "Invalid password" });
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
              if (error) {
                console.log("error " + error);
                return res.status(500).json({ success: false, message: "Error en el servidor" });
            }
            
            // ✅ MODIFICADO: Configurar cookie con opciones para cross-domain
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: true, // HTTPS requerido
                sameSite: 'none', // Permitir cross-domain
                maxAge: 24 * 60 * 60 * 1000 // 24 horas
            });
            
            // ✅ MODIFICADO: Devolver éxito CON los datos del usuario
            res.json({ 
                success: true, 
                message: "Login exitoso",
                user: userData // ✅ NUEVO: Incluir datos del usuario
            });
            }
        )

    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

// 🔐 VERIFY TOKEN
loginController.verify = async (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ ok: false, message: "No token provided" });
  }

  jsonwebtoken.verify(token, config.JWT.secret, 
    async (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    // ✅ MEJORADO: Devolver más información del usuario en verify
    try {
      let userData;
      
      if (decoded.userType === "admin") {
        userData = {
          id: "admin",
          email: config.ADMIN.emailAdmin,
          userType: "admin",
          name: "Administrador"
        };
      } else if (decoded.userType === "employee") {
        const employee = await employeesModel.findById(decoded.id);
        userData = {
          id: employee._id,
          email: employee.email,
          userType: "employee",
          name: employee.name || employee.nombre || "Empleado"
        };
      } else if (decoded.userType === "customer") {
        const customer = await customersModel.findById(decoded.id);
        userData = {
          id: customer._id,
          email: customer.email,
          userType: "customer",
          name: customer.name || customer.nombre || "Cliente"
        };
      }

      res.json({
        ok: true,
        user: userData
      });
    } catch (error) {
      console.error("Error getting user data:", error);
      res.status(401).json({ ok: false, message: "Error getting user data" });
    }
  });
};

export default loginController;
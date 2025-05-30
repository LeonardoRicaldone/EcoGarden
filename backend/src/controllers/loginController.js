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
            
            // ✅ MODIFICADO: Configurar cookie con opciones mejoradas
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cross-domain solo en prod
                maxAge: 24 * 60 * 60 * 1000, // 24 horas
                path: '/' // Asegurar que esté disponible en toda la app
            });
            
            // ✅ MODIFICADO: Devolver éxito CON los datos del usuario Y el token
            res.json({ 
                success: true, 
                message: "Login exitoso",
                user: userData, // ✅ Incluir datos del usuario
                token: token    // ✅ NUEVO: Incluir token para localStorage
            });
            }
        )

    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

// 🔐 VERIFY TOKEN - DUAL AUTH (Cookie + Header)
loginController.verify = async (req, res) => {
  // ✅ NUEVO: Intentar obtener token de ambas fuentes
  let token = req.cookies.authToken; // Primero intentar cookie
  
  // Si no hay cookie, intentar header Authorization
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remover 'Bearer ' del inicio
      console.log("Token obtenido desde header Authorization");
    }
  } else {
    console.log("Token obtenido desde cookie");
  }

  // Si no hay token en ningún lado
  if (!token) {
    return res.status(401).json({ ok: false, message: "No token provided" });
  }

  jsonwebtoken.verify(token, config.JWT.secret, 
    async (err, decoded) => {
    if (err) {
      console.log("Token inválido:", err.message);
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
        if (!employee) {
          return res.status(401).json({ ok: false, message: "Employee not found" });
        }
        userData = {
          id: employee._id,
          email: employee.email,
          userType: "employee",
          name: employee.name || employee.nombre || "Empleado"
        };
      } else if (decoded.userType === "customer") {
        const customer = await customersModel.findById(decoded.id);
        if (!customer) {
          return res.status(401).json({ ok: false, message: "Customer not found" });
        }
        userData = {
          id: customer._id,
          email: customer.email,
          userType: "customer",
          name: customer.name || customer.nombre || "Cliente"
        };
      }

      res.json({
        ok: true,
        user: userData,
        // ✅ OPCIONAL: Devolver token renovado si quieres renovar la sesión
        token: token
      });
    } catch (error) {
      console.error("Error getting user data:", error);
      res.status(401).json({ ok: false, message: "Error getting user data" });
    }
  });
};

// ✅ NUEVO: Logout mejorado que limpia cookie
loginController.logout = async (req, res) => {
  try {
    // Limpiar la cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });
    
    res.json({ 
      success: true, 
      message: "Logout exitoso" 
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error en el servidor" 
    });
  }
};

export default loginController;
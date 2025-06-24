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

    // Validación de campos requeridos
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Email and password are required" 
        });
    }

    try {
        //Validamos los 3 posibles niveles
        //1. Admin, 2- Empleado, 3. Cliente

        let userFound; //Guarda el usuario encontrado
        let userType;  //Guarda el tipo de usuario encontrado
        let userData;  //Guarda los datos del usuario encontrado (para enviar al frontend)

        //1. Admin - Verificar credenciales hardcodeadas
        if(email === config.ADMIN.emailAdmin && password === config.ADMIN.password) {
            userType = "admin";
            userFound = {_id: "admin"}
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
                // Verificar contraseña del empleado
                const isMatch = await bcryptjs.compare(password, userFound.password);
                if(!isMatch){
                    return res.status(401).json({ 
                        success: false, 
                        message: "Invalid credentials" 
                    });
                }
                
                userType = "employee"
                userData = {
                    id: userFound._id,
                    email: userFound.email,
                    userType: "employee",
                    name: userFound.name || userFound.nombre || "Empleado",
                    lastname: userFound.lastname,
                    phone: userFound.phone
                }
            } else {
                //3. Cliente
                userFound = await customersModel.findOne({email})
                if(userFound) {
                    // Verificar contraseña del cliente
                    const isMatch = await bcryptjs.compare(password, userFound.password);
                    if(!isMatch){
                        return res.status(401).json({ 
                            success: false, 
                            message: "Invalid credentials" 
                        });
                    }
                    
                    userType = "customer"
                    userData = {
                        id: userFound._id,
                        email: userFound.email,
                        userType: "customer",
                        name: userFound.name || userFound.nombre || "Cliente",
                        lastname: userFound.lastname,
                        telephone: userFound.telephone
                    }
                }
            }
        }

        //Si no encontramos a ningun usuario con esas credenciales
        if(!userFound){
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        /// TOKEN
        //Para validar que inició sesión
        const tokenPayload = {
            id: userFound._id,
            userType: userType
        };

        jsonwebtoken.sign(
            tokenPayload,
            config.JWT.secret,
            {expiresIn: config.JWT.expiresIn},
            (error, token) => {
                if (error) {
                    console.error("JWT signing error:", error);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error generating authentication token" 
                    });
                }
                
                // Configurar cookie
                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000, // 24 horas en millisegundos
                    path: '/'
                });
                
                // Respuesta exitosa
                res.json({ 
                    success: true, 
                    message: "Login successful",
                    user: userData, 
                    token: token    
                });
            }
        )

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

loginController.verify = async (req, res) => {
    let token = req.cookies?.authToken; // Primero intentar cookie
    
    // Si no hay cookie, intentar header Authorization
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    // Si no hay token en ningún lado
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "No authentication token provided" 
        });
    }

    try {
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
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
                return res.status(404).json({ 
                    success: false, 
                    message: "Employee not found" 
                });
            }
            userData = {
                id: employee._id,
                email: employee.email,
                userType: "employee",
                name: employee.name || employee.nombre || "Empleado",
                lastname: employee.lastname,
                phone: employee.phone
            };
        } else if (decoded.userType === "customer") {
            const customer = await customersModel.findById(decoded.id);
            if (!customer) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Customer not found" 
                });
            }
            userData = {
                id: customer._id,
                email: customer.email,
                userType: "customer",
                name: customer.name || customer.nombre || "Cliente",
                lastname: customer.lastname,
                telephone: customer.telephone
            };
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid user type" 
            });
        }

        res.json({
            success: true,
            user: userData,
            token: token
        });
        
    } catch (error) {
        console.error("Token verification error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token has expired" 
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Error verifying token" 
        });
    }
};

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
            message: "Logout successful" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error during logout" 
        });
    }
};

export default loginController;
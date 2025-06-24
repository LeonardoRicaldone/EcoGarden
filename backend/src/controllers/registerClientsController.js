import clientsModel from "../models/Clients.js";
import bcryptjs from "bcryptjs";

const registerClientsController = {};

registerClientsController.register = async (req, res) => {
    const { name, lastname, telephone, email, password } = req.body;

    console.log("Datos recibidos para registro de cliente:", req.body);

    // Validación de campos requeridos
    if (!name || !lastname || !telephone || !email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Todos los campos son requeridos (name, lastname, telephone, email, password)" 
        });
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false,
            message: "Please provide a valid email address" 
        });
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false,
            message: "Password must be at least 6 characters long" 
        });
    }

    try {
        // Verificar si el usuario ya existe
        const existingClient = await clientsModel.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ 
                success: false,
                message: "A client with this email already exists" 
            });
        }

        // Hashear la contraseña
        const passwordHash = await bcryptjs.hash(password, 12);

        // Crear nuevo cliente
        const newClient = new clientsModel({
            name,
            lastname,
            telephone,
            email,
            password: passwordHash
        });

        await newClient.save();
        console.log("Cliente registrado exitosamente en la base de datos");

        // Respuesta exitosa (sin enviar la contraseña)
        res.status(201).json({ 
            success: true,
            message: "Client registered successfully", 
            client: {
                id: newClient._id,
                name: newClient.name,
                lastname: newClient.lastname,
                telephone: newClient.telephone,
                email: newClient.email
            }
        });

    } catch (error) {
        console.error("Error en registro de cliente:", error);
        
        // Manejo de errores específicos de MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: "Email already exists" 
            });
        }

        res.status(500).json({ 
            success: false,
            message: "Error registering client",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default registerClientsController;
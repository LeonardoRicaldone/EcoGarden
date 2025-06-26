import clientsModel from "../models/Clients.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { config } from "../utils/config.js";

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
            message: "Por favor proporciona un email válido" 
        });
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false,
            message: "La contraseña debe tener al menos 6 caracteres" 
        });
    }

    try {
        // Verificar si el usuario ya existe
        const existingClient = await clientsModel.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ 
                success: false,
                message: "Ya existe un cliente registrado con este email" 
            });
        }

        // Hashear la contraseña
        const passwordHash = await bcryptjs.hash(password, 12);

        // Crear nuevo cliente (inicialmente no verificado)
        const newClient = new clientsModel({
            name,
            lastname,
            telephone,
            email,
            password: passwordHash,
            isVerified: false // Campo para verificación de email
        });

        await newClient.save();
        console.log("Cliente registrado exitosamente en la base de datos");

        // Generar código de verificación aleatorio
        const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

        // Crear token con el código de verificación
        const tokenCode = jsonwebtoken.sign(
            { email, verificationCode },
            config.JWT.secret,
            { expiresIn: "2h" }
        );

        // Guardar token en cookie
        res.cookie("VerificationToken", tokenCode, { 
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        // Configurar transporter de nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_pass,
            },
        });

        // Configurar opciones del correo
        const mailOptions = {
            from: config.email.email_user,
            to: email,
            subject: "Verificación de correo - EcoGarden",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #93A267;">¡Bienvenido a EcoGarden!</h2>
                    <p>Hola <strong>${name}</strong>,</p>
                    <p>Gracias por registrarte en EcoGarden. Para completar tu registro, necesitas verificar tu correo electrónico.</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #485935; margin-bottom: 10px;">Tu código de verificación es:</h3>
                        <span style="font-size: 24px; font-weight: bold; color: #93A267; letter-spacing: 3px;">${verificationCode}</span>
                    </div>
                    <p><strong>Este código expira en 2 horas.</strong></p>
                    <p>Si no solicitaste este registro, puedes ignorar este correo.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
            `
        };

        // Enviar correo de verificación
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error enviando correo:", error);
                return res.status(500).json({ 
                    success: false,
                    message: "Error enviando el correo de verificación" 
                });
            }

            console.log("Correo enviado: " + info.response);
        });

        // Respuesta exitosa
        res.status(201).json({ 
            success: true,
            message: "Cliente registrado exitosamente. Se ha enviado un código de verificación a tu correo electrónico.", 
            needsVerification: true,
            client: {
                id: newClient._id,
                name: newClient.name,
                lastname: newClient.lastname,
                telephone: newClient.telephone,
                email: newClient.email,
                isVerified: newClient.isVerified
            }
        });

    } catch (error) {
        console.error("Error en registro de cliente:", error);
        
        // Manejo de errores específicos de MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: "El email ya está registrado" 
            });
        }

        res.status(500).json({ 
            success: false,
            message: "Error registrando cliente",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verificar código de email
registerClientsController.verifyCodeEmail = async (req, res) => {
    const { verificationCode } = req.body;

    // Obtener el token que contiene el código de verificación
    const token = req.cookies.VerificationToken;

    if (!token) {
        return res.status(400).json({ 
            success: false,
            message: "Token de verificación no encontrado" 
        });
    }

    if (!verificationCode) {
        return res.status(400).json({ 
            success: false,
            message: "Código de verificación requerido" 
        });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const { email, verificationCode: storedCode } = decoded;

        // Comparar el código enviado con el almacenado
        if (verificationCode.toUpperCase() !== storedCode) {
            return res.status(400).json({ 
                success: false,
                message: "Código de verificación inválido" 
            });
        }

        // Buscar y actualizar el cliente
        const client = await clientsModel.findOne({ email });
        if (!client) {
            return res.status(404).json({ 
                success: false,
                message: "Cliente no encontrado" 
            });
        }

        // Cambiar estado de verificación
        client.isVerified = true;
        await client.save();

        // Limpiar cookie del token
        res.clearCookie("VerificationToken");

        res.json({ 
            success: true,
            message: "Email verificado exitosamente. Ya puedes iniciar sesión." 
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ 
                success: false,
                message: "El código de verificación ha expirado. Solicita un nuevo registro." 
            });
        }

        console.error("Error en verificación:", error);
        res.status(500).json({ 
            success: false,
            message: "Error verificando el código" 
        });
    }
};

// Reenviar código de verificación
registerClientsController.resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false,
            message: "Email requerido" 
        });
    }

    try {
        // Verificar que el cliente existe y no está verificado
        const client = await clientsModel.findOne({ email });
        if (!client) {
            return res.status(404).json({ 
                success: false,
                message: "Cliente no encontrado" 
            });
        }

        if (client.isVerified) {
            return res.status(400).json({ 
                success: false,
                message: "Este email ya está verificado" 
            });
        }

        // Generar nuevo código
        const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

        // Crear nuevo token
        const tokenCode = jsonwebtoken.sign(
            { email, verificationCode },
            config.JWT.secret,
            { expiresIn: "2h" }
        );

        // Actualizar cookie
        res.cookie("VerificationToken", tokenCode, { 
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        // Enviar nuevo correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_pass,
            },
        });

        const mailOptions = {
            from: config.email.email_user,
            to: email,
            subject: "Nuevo código de verificación - EcoGarden",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #93A267;">Nuevo código de verificación</h2>
                    <p>Hola <strong>${client.name}</strong>,</p>
                    <p>Has solicitado un nuevo código de verificación para tu cuenta de EcoGarden.</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #485935; margin-bottom: 10px;">Tu nuevo código de verificación es:</h3>
                        <span style="font-size: 24px; font-weight: bold; color: #93A267; letter-spacing: 3px;">${verificationCode}</span>
                    </div>
                    <p><strong>Este código expira en 2 horas.</strong></p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error reenviando correo:", error);
                return res.status(500).json({ 
                    success: false,
                    message: "Error reenviando el correo de verificación" 
                });
            }

            console.log("Correo reenviado: " + info.response);
        });

        res.json({ 
            success: true,
            message: "Nuevo código de verificación enviado a tu correo electrónico" 
        });

    } catch (error) {
        console.error("Error reenviando código:", error);
        res.status(500).json({ 
            success: false,
            message: "Error reenviando código de verificación" 
        });
    }
};

export default registerClientsController;
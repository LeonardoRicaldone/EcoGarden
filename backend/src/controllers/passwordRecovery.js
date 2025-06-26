import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import clientsModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/mailPasswordRecovery.js";
import { config } from "../utils/config.js";

// 1- Crear un array de funciones
const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound;
    let userType;

    // Buscar primero en clientes
    userFound = await clientsModel.findOne({ email });
    if (userFound) {
      userType = "client";
    } else {
      // Si no se encuentra en clientes, buscar en empleados
      userFound = await employeeModel.findOne({ email });
      if (userFound) {
        userType = "employee";
      }
    }

    if (!userFound) {
      return res.status(404).json({ 
        message: "No se encontró ningún usuario con este correo electrónico" 
      });
    }

    // Generar un código de 5 dígitos
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Generar un token
    const token = jsonwebtoken.sign(
      //1-¿qué voy a guardar?
      { email, code, userType, verified: false },
      //2- secret key
      config.JWT.secret,
      //3- ¿Cuándo expira?
      { expiresIn: "25m" }
    );

    res.cookie("tokenRecoveryCode", token, { 
      maxAge: 25 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Enviamos el correo
    await sendEmail(
      email,
      "EcoGarden - Código de Recuperación de Contraseña",
      `Tu código de verificación para EcoGarden es ${code}`,
      HTMLRecoveryEmail(code)
    );

    console.log(`Password recovery code sent to ${email}: ${code}`); // Para debugging

    res.json({ 
      message: "Código de verificación enviado a tu correo electrónico",
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mostrar email parcialmente oculto
    });
  } catch (error) {
    console.error("Error in requestCode:", error);
    res.status(500).json({ 
      message: "Error al enviar el código de verificación",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

///////// VERIFICAR EL CÓDIGO QUE ME ENVIARON POR CORREO
passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    // Obtener el token que está guardado en las cookies
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.status(400).json({ 
        message: "No se encontró el token de recuperación. Solicita un nuevo código." 
      });
    }

    // Extraer todos los datos del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Comparar el código que está guardado en el token
    // con el código que el usuario escribió
    if (decoded.code !== code) {
      return res.status(400).json({ 
        message: "Código de verificación incorrecto" 
      });
    }

    // Marcamos el token como verificado (si es correcto)
    const newToken = jsonwebtoken.sign(
      //1- ¿Que vamos a guardar?
      {
        email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true,
      },
      //2- secret key
      config.JWT.secret,
      //3- ¿cuando vence?
      { expiresIn: "25m" }
    );

    res.cookie("tokenRecoveryCode", newToken, { 
      maxAge: 25 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({ 
      message: "Código verificado correctamente. Ahora puedes cambiar tu contraseña." 
    });
  } catch (error) {
    console.error("Error in verifyCode:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        message: "El código ha expirado. Solicita un nuevo código." 
      });
    }
    
    res.status(500).json({ 
      message: "Error al verificar el código",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    // Validar que la nueva contraseña tenga al menos 6 caracteres
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    // Acceder el token que está en las cookies
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.status(400).json({ 
        message: "No se encontró el token de recuperación" 
      });
    }

    // Decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Ver si el código ya fue verificado
    if (!decoded.verified) {
      return res.status(400).json({ 
        message: "El código no ha sido verificado" 
      });
    }

    let user;
    const { email } = decoded;

    // Encriptar la contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Guardamos la nueva contraseña en la base de datos
    if (decoded.userType === "client") {
      user = await clientsModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (decoded.userType === "employee") {
      user = await employeeModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).json({ 
        message: "Usuario no encontrado" 
      });
    }

    // Limpiar la cookie
    res.clearCookie("tokenRecoveryCode");

    console.log(`Password updated for user: ${email}`); // Para debugging

    res.json({ 
      message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña." 
    });
  } catch (error) {
    console.error("Error in newPassword:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        message: "El token ha expirado. Inicia el proceso de recuperación nuevamente." 
      });
    }
    
    res.status(500).json({ 
      message: "Error al actualizar la contraseña",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default passwordRecoveryController;
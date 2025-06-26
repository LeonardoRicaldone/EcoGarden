import nodemailer from "nodemailer";
import { config } from "../utils/config.js";

// 1- Configurar el transporter => ¿Quien lo envia?
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.email_user,
    pass: config.email.email_pass,
  },
});

//2-Enviar el correo
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"EcoGarden" gabrielacecibe0@gmail.com',
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

// 3- Funcion para generar el HTML con tema de EcoGarden
const HTMLRecoveryEmail = (code) => {
  return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f9ff; padding: 20px; border: 1px solid #93A267; border-radius: 15px; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #93A267; color: white; padding: 20px; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px;">
          <h1 style="margin: 0; font-size: 28px;">🌱 EcoGarden</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Recuperación de Contraseña</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #2c3e50; font-size: 22px; margin-bottom: 20px;">¡Hola!</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            Recibimos una solicitud para restablecer tu contraseña en EcoGarden. 
            Usa el siguiente código de verificación para continuar:
          </p>
          
          <div style="display: inline-block; padding: 15px 30px; margin: 20px 0; font-size: 24px; font-weight: bold; color: #fff; background: linear-gradient(135deg, #93A267, #7a8a5c); border-radius: 10px; border: 2px solid #6b7a4f; letter-spacing: 2px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            ${code}
          </div>
          
          <p style="font-size: 14px; color: #777; line-height: 1.5; margin: 20px 0;">
            Este código es válido por los próximos <strong>25 minutos</strong>. 
            Si no solicitaste este correo, puedes ignorarlo de forma segura.
          </p>
          
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>⚠️ Importante:</strong> Nunca compartas este código con nadie. 
              EcoGarden nunca te pedirá tu contraseña por correo electrónico.
            </p>
          </div>
        </div>
        
        <hr style="border: none; border-top: 1px solid #93A267; margin: 20px 0; opacity: 0.3;">
        
        <footer style="font-size: 12px; color: #aaa; padding: 10px;">
          <p style="margin: 5px 0;">🌿 Cuidamos tus plantas, cuidamos tu seguridad</p>
          <p style="margin: 5px 0;">
            ¿Necesitas ayuda? Contacta nuestro soporte en 
            <a href="mailto:support@ecogarden.com" style="color: #93A267; text-decoration: none;">support@ecogarden.com</a>
          </p>
          <p style="margin: 5px 0; color: #ccc;">© 2025 EcoGarden - Todos los derechos reservados</p>
        </footer>
      </div>
    `;
};

export { sendEmail, HTMLRecoveryEmail };
import nodemailer from 'nodemailer';

const contactController = {};

contactController.sendContactEmail = async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
  from: email,
  to: process.env.EMAIL_USER,
  subject: 'Nuevo mensaje de:  ' + nombre,
  html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #5C7052; color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Nuevo mensaje</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">Has recibido un nuevo mensaje a través del formulario de contáctanos</p>
      </div>
      
      <!-- Cuerpo del mensaje -->
      <div style="padding: 25px; background-color: #f9f9f9;">
        <!-- Datos del remitente -->
        <div style="background-color: white; border-radius: 6px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h2 style="color: #2e7d32; margin-top: 0; font-size: 18px;">Información del remitente</h2>
          
          <div style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 80px; color: #666; font-weight: bold;">Nombre:</span>
            <span>${nombre}</span>
          </div>
          
          <div style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 80px; color: #666; font-weight: bold;">Email:</span>
            <a href="mailto:${email}" style="color: #2e7d32; text-decoration: none;">${email}</a>
          </div>
        </div>
        
        <!-- Mensaje -->
        <div style="background-color: white; border-radius: 6px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h2 style="color: #2e7d32; margin-top: 0; font-size: 18px;">Mensaje</h2>
          <div style="line-height: 1.6; white-space: pre-wrap;">${mensaje}</div>
        </div>
      </div>
      
      <!-- Pie de página -->
      <div style="background-color: #e8f5e9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">Este mensaje fue enviado desde el formulario de contacto el ${new Date().toLocaleDateString()}</p>
        <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Todos los derechos reservados</p>
      </div>
    </div>
  `,
  // Versión en texto plano por si acaso
  text: `
    Nuevo mensaje de contacto:
    Nombre: ${nombre}
    Email: ${email}
    Mensaje:
    ${mensaje}
    
    Enviado el ${new Date().toLocaleDateString()}
  `
};

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar correo', error: error.message });
  }
};

export default contactController;

import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  // Estado para almacenar y gestionar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  // Función para actualizar el estado cuando cambian los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,      // Mantiene los valores anteriores del formulario
      [name]: value // Actualiza solo el campo que cambió
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado de recarga de página
    console.log('Formulario enviado:', formData); // Registra los datos en la consola
    alert('Mensaje enviado con éxito!'); // Muestra confirmación al usuario
    setFormData({ nombre: '', email: '', mensaje: '' }); // Reinicia el formulario
  };

  return (
    <div className="page-container">
    <div className="contact-container">
      
      {/* Encabezado de la página de contacto */}
      <div className="contact-header">
        <h1>Contáctanos</h1>
        <p>Esperamos tu mensaje, estamos listos para atenderte</p>
      </div>

      <div className="contact-content">
        {/* Sección de información de contacto */}
        <div className="contact-info">
          {/* Método de contacto: teléfono */}
          <div className="contact-method">
            <i className="fas fa-phone"></i> {/* Ícono de teléfono */}
            <div>
              <h3>Teléfonos</h3>
              <p>5555-5555</p>
              <p>4444-4444</p>
            </div>
          </div>

          {/* Método de contacto: correo electrónico */}
          <div className="contact-method">
            <i className="fas fa-envelope"></i> {/* Ícono de correo */}
            <div>
              <h3>Correos Electrónicos</h3>
              <p>ventas@gmail.com</p>
              <p>info@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Formulario de contacto con manejador de envío */}
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Campo para el nombre */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange} // Actualiza el estado cuando cambia el input
              required // Campo obligatorio
            />
          </div>

          {/* Campo para el email */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email" // Tipo email para validación básica
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required // Campo obligatorio
            />
          </div>

          {/* Campo para el mensaje */}
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required // Campo obligatorio
            ></textarea>
          </div>

          {/* Botón de envío */}
          <button type="submit" className="submit-btn">
            Enviar → <i className="fas fa-arrow-right"></i> {/* Ícono de flecha derecha */}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Contact;
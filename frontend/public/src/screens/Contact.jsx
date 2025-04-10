import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    alert('Mensaje enviado con éxito!');
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="page-container">
    <div className="contact-container">
      
      <div className="contact-header">
        <h1>Contáctanos</h1>
        <p>Esperamos tu mensaje, estamos listos para atenderte</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-method">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Teléfonos</h3>
              <p>5555-5555</p>
              <p>4444-4444</p>
            </div>
          </div>

          <div className="contact-method">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Correos Electrónicos</h3>
              <p>ventas@gmail.com</p>
              <p>info@gmail.com</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Enviar → <i className="fas fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Contact;
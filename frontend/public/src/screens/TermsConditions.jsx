import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './TermsConditions.css';

const TermsConditions = () => {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate('/register', { state: { termsAccepted: true } });
    };

    const handleDecline = () => {
        navigate('/register', { state: { termsAccepted: false } });
    };

    return (
        <div className="page-container">
            <div className="terms-wrapper">
                <button className="back-button" onClick={() => navigate('/register')}>
                    <FaArrowLeft /> Volver
                </button>
                <div className="terms-box">
                    <h1>Términos y Condiciones</h1>
                    <p className="update">Última actualización: 25/02/2025</p>

                    <p>
                        Bienvenido a <strong>EcoGarden</strong>, tu plataforma para la compra de productos y contratación de servicios de jardinería y forestación. Al usar nuestra app, aceptas los siguientes términos:
                    </p>

                    <div className="terms-section">
                        <h2>1. Uso de la Plataforma</h2>
                        <ul>
                            <li>La app permite comprar productos y contratar servicios relacionados con jardinería y forestación.</li>
                            <li>Disponible para mayores de 18 años o menores con supervisión.</li>
                            <li>EcoGarden puede modificar o suspender funciones sin previo aviso.</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h2>2. Registro y Cuenta</h2>
                        <ul>
                            <li>Es necesario crear una cuenta con datos reales.</li>
                            <li>El usuario es responsable del uso y seguridad de su cuenta.</li>
                            <li>EcoGarden protege la privacidad de sus usuarios según su política de datos.</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h2>3. Compras y Pagos</h2>
                        <ul>
                            <li>Los precios pueden cambiar sin previo aviso.</li>
                            <li>Los pagos son procesados de forma segura.</li>
                            <li>Se aplican políticas de devolución y garantía según el producto o servicio.</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h2>4. Envíos y Devoluciones</h2>
                        <ul>
                            <li>Los tiempos de entrega varían según la ubicación.</li>
                            <li>EcoGarden no es responsable por retrasos de terceros.</li>
                            <li>EcoGarden no se hace cargo de devoluciones.</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h2>5. Propiedad Intelectual y Seguridad</h2>
                        <ul>
                            <li>El contenido de la app es propiedad de EcoGarden.</li>
                            <li>Queda prohibida su reproducción sin autorización.</li>
                            <li>Implementamos medidas de seguridad para proteger los datos de los usuarios.</li>
                        </ul>
                    </div>

                    <div className="terms-section">
                        <h2>6. Modificaciones y Contacto</h2>
                        <ul>
                            <li>EcoGarden puede actualizar estos términos en cualquier momento.</li>
                            <li>Para dudas, contáctanos en: <a href="mailto:ecogarden@gmail.com" className='correoterms'>ecogarden@gmail.com</a></li>
                        </ul>
                    </div>

                    <div className="terms-buttons">
                        <button className="decline" onClick={handleDecline}>No acepto</button>
                        <button className="accept" onClick={handleAccept}>Acepto términos y condiciones</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;

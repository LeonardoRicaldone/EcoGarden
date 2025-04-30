import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { BiLeaf } from 'react-icons/bi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="creative-footer">
            {/* Ola decorativa */}
            <div className="footer-wave"></div>
            
            {/* Contenido principal del footer */}
            <div className="footer-content">
                {/* Logo y descripción */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <BiLeaf className="logo-icon" />
                        <span>EcoGarden</span>
                    </div>
                    <p className="footer-description">
                        Cultivando un futuro sostenible con productos ecológicos y soluciones innovadoras para tu hogar.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><FaFacebook /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="YouTube"><FaYoutube /></a>
                        <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="#" aria-label="Pinterest"><FaPinterest /></a>
                    </div>
                </div>

                {/* Enlaces rápidos */}
                <div className="footer-section">
                    <h3 className="footer-title">Explorar</h3>
                    <ul className="footer-links">
                        <li><a href="#">Inicio</a></li>
                        <li><a href="#">Productos</a></li>
                        <li><a href="#">Ofertas</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Eventos</a></li>
                    </ul>
                </div>

                {/* Información de contacto */}
                <div className="footer-section">
                    <h3 className="footer-title">Contacto</h3>
                    <ul className="footer-contact">
                        <li>
                            <MdLocationOn className="contact-icon" />
                            <span>Av. Ecológica 123, Ciudad Verde</span>
                        </li>
                        <li>
                            <MdPhone className="contact-icon" />
                            <span>+1 234 567 890</span>
                        </li>
                        <li>
                            <MdEmail className="contact-icon" />
                            <span>info@ecogarden.com</span>
                        </li>
                    </ul>
                </div>

                {/* Boletín informativo */}
                <div className="footer-section">
                    <h3 className="footer-title">Newsletter</h3>
                    <p className="newsletter-text">
                        Suscríbete para recibir ofertas exclusivas y consejos ecológicos.
                    </p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Tu correo electrónico" required />
                        <button type="submit">Suscribirse</button>
                    </form>
                </div>
            </div>

            {/* Copyright y enlaces legales */}
            <div className="footer-bottom">
                <div className="footer-legal">
                    <span>&copy; {new Date().getFullYear()} EcoGarden. Todos los derechos reservados.</span>
                    <div className="legal-links">
                        <a href="#">Términos y condiciones</a>
                        <a href="#">Política de privacidad</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
                <div className="footer-badge">
                    <BiLeaf />
                    <span>Comprometidos con el planeta</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
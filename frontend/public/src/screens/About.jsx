import { FaBullseye, FaEye, FaHistory, FaLeaf, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './AboutUs.css';


const About = () => {
    return (
        <div className="page-container">
        <div className="about-us-container">
            {/* Sección Hero con animación de aparición */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="about-hero"
            >
                <h1>Conoce Nuestra Esencia</h1>
                <p>Descubre lo que nos hace únicos</p>
                {/* Elementos decorativos circulares */}
                <div className="hero-decoration">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
            </motion.div>

            {/* Sección de Misión con animación al pasar el cursor */}
            <motion.section 
                whileHover={{ scale: 1.02 }} // Efecto sutil de escala al pasar el cursor
                className="about-card mission"
            >
                <div className="icon-container">
                    <FaBullseye className="about-icon" /> {/* Ícono representativo */}
                </div>
                <h2>Nuestra Misión</h2>
                <p>
                    Transformar el mercado con productos sostenibles que generen un impacto positivo 
                    en el medio ambiente y en la vida de nuestros clientes. Nos comprometemos a ofrecer 
                    soluciones innovadoras con un enfoque humano.
                </p>
                {/* Decoración con íconos de hojas */}
                <div className="mission-decoration">
                    <FaLeaf className="decoration-icon" />
                    <FaLeaf className="decoration-icon" />
                </div>
            </motion.section>

            {/* Sección de Visión con animación al pasar el cursor */}
            <motion.section 
                whileHover={{ scale: 1.02 }} // Mismo efecto de escala que en la sección anterior
                className="about-card vision"
            >
                <div className="icon-container">
                    <FaEye className="about-icon" /> {/* Ícono representativo */}
                </div>
                <h2>Nuestra Visión</h2>
                <p>
                    Ser reconocidos como líderes en innovación sostenible para 2030, expandiendo 
                    nuestras operaciones a nivel global mientras mantenemos nuestros valores de 
                    autenticidad, transparencia y compromiso comunitario.
                </p>
                {/* Elemento decorativo circular */}
                <div className="vision-decoration">
                    <div className="vision-ring"></div>
                </div>
            </motion.section>

            {/* Sección de Historia con animación al pasar el cursor */}
            <motion.section 
                whileHover={{ scale: 1.02 }}
                className="about-card history"
            >
                <div className="icon-container">
                    <FaHistory className="about-icon" /> {/* Ícono representativo */}
                </div>
                <h2>Nuestra Historia</h2>
                <p>
                    Fundada en 2015 como un pequeño emprendimiento familiar, hoy somos un equipo 
                    de más de 200 personas apasionadas. Cada logro ha sido posible gracias a la 
                    confianza de nuestros clientes y el trabajo dedicado de nuestro equipo.
                </p>
                {/* Línea de tiempo visual con años clave */}
                <div className="timeline">
                    <div className="timeline-marker">2015</div>
                    <div className="timeline-marker">2020</div>
                    <div className="timeline-marker">2024</div>
                </div>
            </motion.section>

            {/* Sección de Valores con animación de aparición al entrar en viewport */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }} // Animación cuando el elemento entra en el viewport
                transition={{ duration: 1 }}
                className="team-section"
            >
                <h2>Nuestros Valores</h2>
                {/* Grid de valores corporativos */}
                <div className="values-grid">
                    {/* Cada valor tiene una animación al pasar el cursor */}
                    <motion.div whileHover={{ y: -5 }} className="value-item">
                        <FaHandshake /> {/* Ícono de integridad */}
                        <h3>Integridad</h3>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="value-item">
                        <FaLeaf /> {/* Ícono de sostenibilidad */}
                        <h3>Sostenibilidad</h3>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="value-item">
                        <FaBullseye /> {/* Ícono de excelencia */}
                        <h3>Excelencia</h3>
                    </motion.div>
                </div>
            </motion.div>
        </div>
        </div>
    );
};

export default About;
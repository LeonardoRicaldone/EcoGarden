import React from "react";
import "./Home.css"; // Asegúrate de crear este archivo con el CSS de arriba

const Home = () => {
    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="hero-section">
                {/* Imagen de fondo */}
                <img 
                    src="https://cdn.pixabay.com/photo/2021/05/03/13/32/greenhouse-6226263_1280.jpg" 
                    alt="Planta en crecimiento" 
                    className="hero-image"
                />
                
                {/* Capa oscura */}
                <div className="overlay"></div>
                
                {/* Contenido superpuesto */}
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            EcoGarden – Jardinería Sostenible para un Mundo Más Verde
                        </h1>
                        <p className="hero-description">
                            Cultiva tu espacio verde con productos ecológicos y sostenibles. ¡Todo lo que necesitas para un jardín vibrante y saludable!
                        </p>
                        <button className="hero-button">
                            Ver más
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
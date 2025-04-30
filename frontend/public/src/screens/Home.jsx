import React, { useRef, useState } from "react";
import "./Home.css";
import { FaStar, FaRegStar, FaInstagram } from 'react-icons/fa';
import { MdLocalShipping, MdCardGiftcard, MdVerified, MdAttachMoney } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard"; 

const Home = () => {
    // Hook para manejar la navegación entre páginas
    const navigate = useNavigate();
    // Referencia para desplazamiento suave a la sección de ofertas
    const offersRef = useRef(null); 
    
    // Función para redirigir a la página de detalle del producto
    const handleProductClick = () => {
        navigate('/product'); 
    };

    // Función para desplazamiento suave a la sección de ofertas
    const scrollToOffers = () => {
        offersRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Función para alternar el estado de favorito en productos de oferta
    const toggleFavorite = (id) => {
        console.log(`Toggle favorito para producto ${id}`);
        setFavoriteProducts(prevProducts => 
            prevProducts.map(product => 
                product.id === id 
                ? { ...product, isFavorite: !product.isFavorite } // Cambia solo el producto seleccionado
                : product // Mantiene los demás productos sin cambios
            )
        );
    };

    // Función para alternar el estado de favorito en productos populares
    const toggleFavorite2= (id) => {
        console.log(`Toggle favorito para producto ${id}`);
        setFavoriteProducts2(prevProducts => 
            prevProducts.map(product => 
                product.id === id 
                ? { ...product, isFavorite: !product.isFavorite } // Cambia solo el producto seleccionado
                : product // Mantiene los demás productos sin cambios
            )
        );
    };

    // Función para manejar la adición de productos al carrito
    const handleAddClick = (id) => {
        console.log(`Añadir producto ${id} al carrito`);
    };

    // Estado para almacenar productos en oferta
    const [offerProducts, setFavoriteProducts] = useState([
        { 
            id: 1, 
            name: 'Cactus de ordenador', 
            price: '$5 - $15', 
            rating: 2, 
            img: 'https://www.catalunyaplants.com/wp-content/uploads/2012/12/Cereus-peruvianus-cactus.jpg',
            isFavorite: false 
        },
        { 
            id: 2, 
            name: 'Echeveria elegans', 
            price: '$45 - $55', 
            rating: 2, 
            img: 'https://coastalsucculentsandcacti.com/cdn/shop/products/20220815_175134_540x.jpg?v=1660601267',
            isFavorite: false 
        },
        { 
            id: 3, 
            name: 'Romero', 
            price: '$5 - $15', 
            rating: 3, 
            img: 'https://kellogggarden.com/wp-content/uploads/2021/03/Tips-on-How-to-Grow-Rosemary.jpg',
            isFavorite: false 
        },
        { 
            id: 4, 
            name: 'Diente de león', 
            price: '$45 - $55', 
            rating: 2, 
            img: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Schulterbachtal_L%C3%B6wenzahn_Samenstand-20200517-RM-111527.jpg',
            isFavorite: false 
        }
    ]);

    // Estado para almacenar productos populares
    const [popularProducts, setFavoriteProducts2] = useState([
        { 
            id: 1, 
            name: 'Albahaca', 
            price: '$15', 
            rating: 5, 
            img: 'https://www.decoalive.com/wp-content/uploads/2021/05/albahaca.jpg',
            isFavorite: false 
        },
        { 
            id: 2, 
            name: 'Aloe vera', 
            price: '$25', 
            rating: 5, 
            img: 'https://unlimitedgreens.com/cdn/shop/products/Aloe-Vera-Website-Front.webp?crop=center&height=600&v=1676457070&width=600',
            isFavorite: false 
        },
        { 
            id: 3, 
            name: 'Boca de dragón', 
            price: '$35', 
            rating: 4, 
            img: 'https://media.revistaad.es/photos/62cd549b7cfdd4662ecbbb95/master/w_1600%2Cc_limit/Flor%2520boca%2520de%2520dragon.jpg',
            isFavorite: false 
        },
        { 
            id: 4, 
            name: 'Cactus candelabro', 
            price: '$55', 
            rating: 4, 
            img: 'https://image.made-in-china.com/365f3j00OwSaNzJdcKkG/Candelabro-de-cactus-artificial-de-aspecto-realista-de-Serene-Spaces-Living-Planta-artificial-de-cactus-con-brazos-de-cactus-realistas-perfecta-para-la-decoraci-n-del-hogar-interior.webp',
            isFavorite: false 
        }
    ]);

    // Datos para la sección de Instagram
    const instaPosts = [
        { id: 1, img: 'https://img.interempresas.net/fotos/272363.jpeg' },
        { id: 2, img: 'https://www.bbva.com/wp-content/uploads/2021/08/sostenibilidad-invernadero-casero-BBVA.jpg' },
        { id: 3, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH9ouQROVQCen35VhvH9LLN9xeN2Wzj8pXxQ&s' },
        { id: 4, img: 'https://es.onduline.com/sites/onduline_es/files/inline-images/invernadero-con-placas-policarbonato-onduclair-pc-13.jpg' }
    ];

    return (
        <div className="page-container">
            {/* Sección Hero con imagen de fondo y llamada a la acción */}
            <div className="hero-section">
                {/* Imagen de fondo */}
                <img 
                    src="https://cdn.pixabay.com/photo/2021/05/03/13/32/greenhouse-6226263_1280.jpg" 
                    alt="Planta en crecimiento" 
                    className="hero-image"
                />
                
                {/* Capa oscura para mejorar legibilidad del texto */}
                <div className="overlay"></div>
                
                {/* Contenido superpuesto sobre la imagen */}
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            EcoGarden – Jardinería Sostenible para un Mundo Más Verde
                        </h1>
                        <p className="hero-description">
                            Cultiva tu espacio verde con productos ecológicos y sostenibles. ¡Todo lo que necesitas para un jardín vibrante y saludable!
                        </p>
                        {/* Botón con función de desplazamiento suave hacia ofertas */}
                        <button className="hero-button" onClick={scrollToOffers}>
                            <b>Ver más</b>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

<br />
<br />

            {/* Sección de beneficios/características destacadas */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-2 cambioColor3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span><b>EcoGarden te da más:</b></span>
                </div>

                {/* Grid de beneficios con íconos */}
                <div className="rounded-lg py-4 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 cambioColor">
                    {/* Beneficio 1: Entrega rápida */}
                    <div className="flex flex-col items-center text-center">
                        <MdLocalShipping className="text-4xl mb-2 cambioColor2"/>
                        <h3 className="cambioColor3 font-medium">Entrega rápida</h3>
                    </div>
                    {/* Beneficio 2: Envío gratis */}
                    <div className="flex flex-col items-center text-center">
                        <MdCardGiftcard className="text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Envío gratis a partir de un gasto de 70 dólares</h3>
                    </div>
                    {/* Beneficio 3: Mejor calidad */}
                    <div className="flex flex-col items-center text-center">
                        <MdVerified className="text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Mejor calidad</h3>
                    </div>
                    {/* Beneficio 4: Precios justos */}
                    <div className="flex flex-col items-center text-center">
                        <MdAttachMoney className="text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Precios justos</h3>
                    </div>
                </div>
            </div>

            {/* Sección de ofertas con referencia para el desplazamiento suave */}
            <div ref={offersRef} className="container mx-auto px-4 py-8" id="ofertas">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ofertas</h2>
                
                {/* Grid responsive de productos en oferta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Mapeo de productos en oferta */}
                    {offerProducts.map((product) => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onProductClick={handleProductClick}
                            onToggleFavorite={toggleFavorite}
                            onAddClick={handleAddClick}
                        />
                    ))}
                </div>
            </div>

            {/* Sección de productos populares */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Lo más popular</h2>
                
                {/* Grid responsive de productos populares */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Mapeo de productos populares */}
                    {popularProducts.map((product) => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onProductClick={handleProductClick}
                            onToggleFavorite={toggleFavorite2}
                            onAddClick={handleAddClick}
                        />
                    ))}
                </div>
            </div>

            {/* Sección de Instagram - Integración de redes sociales */}
            <div className="container mx-auto px-4 py-8">
                {/* Cabecera de la sección con perfil de Instagram */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png" alt="EcoGarden" className="w-full h-full object-cover" />
                        </div>
                        {/* Información del perfil */}
                        <div>
                            <h3 className="font-bold text-gray-800">EcoGarden</h3>
                            <p className="text-gray-600 text-sm">@ecogardening</p>
                            <div className="text-xs text-gray-500 flex space-x-4">
                                <span>700 post</span>
                                <span>7000 followers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de imágenes de Instagram */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {/* Mapeo de posts de Instagram */}
                    {instaPosts.map((post) => (
                        <div key={post.id} >
                            <img src={post.img} alt="Instagram post" className="w-full aspect-square object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
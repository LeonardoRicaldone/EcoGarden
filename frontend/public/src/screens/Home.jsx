import React from "react";
import "./Home.css";
import { FaStar, FaRegStar, FaInstagram } from 'react-icons/fa';
import { MdLocalShipping, MdCardGiftcard, MdVerified, MdAttachMoney } from 'react-icons/md';

const Home = () => {
    // Función para renderizar estrellas basadas en puntuación
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating 
                    ? <FaStar key={i} className="text-yellow-500" /> 
                    : <FaRegStar key={i} className="text-gray-300" />
            );
        }
        return <div className="flex">{stars}</div>;
    };

    // Datos de productos para ofertas
    const offerProducts = [
        { id: 1, name: 'Cactus de ordenador', price: '$5 - $15', rating: 2, img: 'https://www.catalunyaplants.com/wp-content/uploads/2012/12/Cereus-peruvianus-cactus.jpg' },
        { id: 2, name: 'Echeveria elegans', price: '$45 - $55', rating: 2, img: 'https://coastalsucculentsandcacti.com/cdn/shop/products/20220815_175134_540x.jpg?v=1660601267' },
        { id: 3, name: 'Romero', price: '$5 - $15', rating: 3, img: 'https://kellogggarden.com/wp-content/uploads/2021/03/Tips-on-How-to-Grow-Rosemary.jpg' },
        { id: 4, name: 'Diente de león', price: '$45 - $55', rating: 2, img: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Schulterbachtal_L%C3%B6wenzahn_Samenstand-20200517-RM-111527.jpg' }
    ];

    // Datos de productos populares
    const popularProducts = [
        { id: 1, name: 'Albahaca', price: '$15', rating: 5, img: 'https://www.decoalive.com/wp-content/uploads/2021/05/albahaca.jpg' },
        { id: 2, name: 'Aloe vera', price: '$25', rating: 5, img: 'https://unlimitedgreens.com/cdn/shop/products/Aloe-Vera-Website-Front.webp?crop=center&height=600&v=1676457070&width=600' },
        { id: 3, name: 'Boca de dragón', price: '$35', rating: 4, img: 'https://media.revistaad.es/photos/62cd549b7cfdd4662ecbbb95/master/w_1600%2Cc_limit/Flor%2520boca%2520de%2520dragon.jpg' },
        { id: 4, name: 'Cactus candelabro', price: '$55', rating: 4, img: 'https://image.made-in-china.com/365f3j00OwSaNzJdcKkG/Candelabro-de-cactus-artificial-de-aspecto-realista-de-Serene-Spaces-Living-Planta-artificial-de-cactus-con-brazos-de-cactus-realistas-perfecta-para-la-decoraci-n-del-hogar-interior.webp' }
    ];

    // Datos de publicaciones de Instagram
    const instaPosts = [
        { id: 1, img: 'https://img.interempresas.net/fotos/272363.jpeg' },
        { id: 2, img: 'https://www.bbva.com/wp-content/uploads/2021/08/sostenibilidad-invernadero-casero-BBVA.jpg' },
        { id: 3, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH9ouQROVQCen35VhvH9LLN9xeN2Wzj8pXxQ&s' },
        { id: 4, img: 'https://es.onduline.com/sites/onduline_es/files/inline-images/invernadero-con-placas-policarbonato-onduclair-pc-13.jpg' }
    ];

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

            {/* Sección de beneficios */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-2 cambioColor3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span><b>EcoGarden te da más:</b></span>
                </div>

                <div className=" rounded-lg py-4 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 cambioColor">
                    <div className="flex flex-col items-center text-center">
                        <MdLocalShipping className="text-4xl mb-2 cambioColor2"/>
                        <h3 className="cambioColor3 font-medium">Entrega rápida</h3>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <MdCardGiftcard className=" text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Envío gratis a partir de un gasto de 70 dólares</h3>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <MdVerified className=" text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Mejor calidad</h3>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <MdAttachMoney className=" text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Precios justos</h3>
                    </div>
                </div>
            </div>

            {/* Sección de ofertas */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ofertas</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {offerProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative">
                                <img src={product.img} alt={product.name} className="w-full h-48 object-cover" />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button className="bg-white p-1 rounded-full shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <button className="bg-white p-1 rounded-full shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{product.price}</p>
                                <div className="mt-2">
                                    {renderStars(product.rating)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de lo más popular */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Lo más popular</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {popularProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative">
                                <img src={product.img} alt={product.name} className="w-full h-48 object-cover" />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button className="bg-white p-1 rounded-full shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <button className="bg-white p-1 rounded-full shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{product.price}</p>
                                <div className="mt-2">
                                    {renderStars(product.rating)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de Instagram */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png" alt="EcoGarden" className="w-full h-full object-cover" />
                        </div>
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
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
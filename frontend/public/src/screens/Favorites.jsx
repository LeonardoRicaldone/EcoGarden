import React, { useState } from "react";
import "./Favorites.css";
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard";

const Favorites = () => {
    // Navigation hook
    const navigate = useNavigate();
    
    // Estado para mantener los productos favoritos
    const [favoriteProducts, setFavoriteProducts] = useState([
        { 
            id: 1, 
            name: 'bonete de obispo', 
            price: '10€', 
            rating: 4, 
            img: 'https://i.etsystatic.com/13841971/r/il/43b81c/1224996118/il_570xN.1224996118_fwnp.jpg',
            isFavorite: true
        },
        { 
            id: 2, 
            name: 'cactus chin', 
            price: '5€', 
            rating: 2, 
            img: 'https://www.jardineriaon.com/wp-content/uploads/2018/12/Gymnocalyciums-baldianum-Gymnocalyciums-baldianum-en-maceta.jpg',
            isFavorite: true
        },
        { 
            id: 3, 
            name: 'cactus columnar', 
            price: '15€', 
            rating: 3, 
            img: 'https://www.cactusoutlet.com/cdn/shop/products/CM-Blue-Flame-Myrtillo-Product-Main-V1.1.jpg?v=1636157923',
            isFavorite: true
        },
        { 
            id: 4, 
            name: 'árbol candelabro', 
            price: '10€', 
            rating: 4, 
            img: 'https://image.made-in-china.com/365f3j00OwSaNzJdcKkG/Candelabro-de-cactus-artificial-de-aspecto-realista-de-Serene-Spaces-Living-Planta-artificial-de-cactus-con-brazos-de-cactus-realistas-perfecta-para-la-decoraci-n-del-hogar-interior.webp',
            isFavorite: true
        },
        { 
            id: 5, 
            name: 'cactus de Navidad', 
            price: '20€', 
            rating: 3, 
            img: 'https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/OAS32PERCNBB7GNDI7MIT4MLTQ.jpg',
            isFavorite: true
        },
        { 
            id: 6, 
            name: 'cactus de ordenador', 
            price: '5€', 
            rating: 2, 
            img: 'https://kellogggarden.com/wp-content/uploads/2021/03/Tips-on-How-to-Grow-Rosemary.jpg',
            isFavorite: true
        }
    ]);

    // Function to handle card clicks
    const handleProductClick = () => {
        navigate('/product');
    };

    // Función para alternar el estado de favorito
    const toggleFavorite = (id) => {
        setFavoriteProducts(prevProducts => 
            prevProducts.map(product => 
                product.id === id 
                ? { ...product, isFavorite: !product.isFavorite } 
                : product
            )
        );
    };

    const handleAddClick = (id) => {
        console.log(`Añadir producto ${id} al carrito`);
    };

    return (
        <div className="page-container">
        <div className="favorites-container">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-485935-800 mb-6">Favoritos</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {favoriteProducts.map((product) => (
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
        </div>
        </div>
    );
};

export default Favorites;
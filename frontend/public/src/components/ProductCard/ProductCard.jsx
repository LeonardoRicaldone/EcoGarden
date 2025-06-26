import React, { useState } from 'react';
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ 
    product, 
    onProductClick, 
    onToggleFavorite, 
    onAddClick,
    className = '',
    showBadge = false,
    badgeText = '',
    badgeColor = 'bg-red-500'
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Funciones de manejo
    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const handleProductClick = () => {
        if (onProductClick) {
            onProductClick(product.id || product._id);
        }
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(product.id || product._id);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (onAddClick) {
            onAddClick(product.id || product._id);
        }
    };

    // Renderizar estrellas de rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };

    // URL de imagen con fallback
    const getImageUrl = () => {
        if (imageError) return null;
        
        // Lista de posibles campos de imagen
        const imageFields = [
            product.imgProduct,
            product.img,
            product.image,
            product.imageUrl,
            product.picture
        ];

        for (const field of imageFields) {
            if (field && typeof field === 'string' && field.trim()) {
                return field.trim();
            }
        }
        
        return null;
    };

    const imageUrl = getImageUrl();

    return (
        <div 
            className={`product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col h-full ${className}`}
            onClick={handleProductClick}
        >
            {/* Badge superior */}
            {showBadge && badgeText && (
                <div className={`absolute top-2 left-2 ${badgeColor} text-white text-xs px-2 py-1 rounded-full font-semibold z-10`}>
                    {badgeText}
                </div>
            )}

            {/* Botón de favorito */}
            <button
                onClick={handleToggleFavorite}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-sm"
                title={product.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
                {product.isFavorite ? (
                    <FaHeart className="text-red-500 text-sm" />
                ) : (
                    <FaRegHeart className="text-gray-600 text-sm hover:text-red-500" />
                )}
            </button>

            {/* Imagen del producto */}
            <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-pulse">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                <FaEye className="text-gray-400 text-xl" />
                            </div>
                        </div>
                    </div>
                )}

                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={product.name || 'Producto'}
                        className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <div className="text-4xl mb-2">🌱</div>
                        <span className="text-xs text-center px-2">
                            {product.name ? `${product.name.substring(0, 20)}...` : 'Imagen no disponible'}
                        </span>
                    </div>
                )}

                {/* Indicador de stock bajo */}
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        ¡Últimas {product.stock}!
                    </div>
                )}

                {/* Sin stock */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Sin Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Información del producto - contenedor flexible */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Contenido principal - toma el espacio disponible */}
                <div className="flex-grow">
                    {/* Nombre del producto */}
                    <h3 
                        className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors"
                        title={product.name}
                    >
                        {product.name || 'Producto sin nombre'}
                    </h3>

                    {/* Rating */}
                    {product.rating !== undefined && (
                        <div className="flex items-center mb-2">
                            <div className="flex items-center mr-2">
                                {renderStars(product.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                                ({product.rating.toFixed(1)})
                            </span>
                        </div>
                    )}

                    {/* Precio */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            {typeof product.price === 'number' ? (
                                <span className="text-lg font-bold text-green-600">
                                    ${product.price.toFixed(2)}
                                </span>
                            ) : (
                                <span className="text-lg font-bold text-green-600">
                                    {product.price || 'Precio no disponible'}
                                </span>
                            )}
                        </div>
                        
                        {/* Stock disponible */}
                        {product.stock !== undefined && (
                            <span className="text-xs text-gray-500">
                                Stock: {product.stock}
                            </span>
                        )}
                    </div>

                    {/* Información adicional */}
                    {product.salesCount && (
                        <div className="text-xs text-gray-500 mb-2">
                            {product.salesCount} vendidos
                        </div>
                    )}
                </div>

                {/* Botón agregar al carrito - siempre al final */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mt-auto ${
                        product.stock === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md active:transform active:scale-95'
                    }`}
                    title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                >
                    <FaShoppingCart className="text-sm" />
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
import React from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ 
  product, 
  onProductClick, 
  onToggleFavorite,
  onAddClick 
}) => {
  const { id, name, price, rating, img, isFavorite } = product;

  // Función para renderizar estrellas basadas en puntuación
  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= numRating 
          ? <FaStar key={i} className="text-yellow-500" /> 
          : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return <div className="flex">{stars}</div>;
  };

    // Controla el clic en el botón de añadir producto
  const handleAddClick = (e) => {
    e.stopPropagation(); // Evita que el clic se propague al contenedor del producto
    if (onAddClick) {
      onAddClick(id);
    }
  };

  // Manejar toggle de favorito
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      console.log('ProductCard - Calling onToggleFavorite with ID:', id);
      onToggleFavorite(id);
    }
  };

  const handleProductClick = () => {
    console.log('Product clicked:', id); // Debug
    if (onProductClick && id) {
      onProductClick(id);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes('€')) {
      return price;
    }
    const numPrice = parseFloat(price) || 0;
    return `${numPrice.toFixed(2)}€`;
  };

  // Función para obtener el nombre de la categoría de forma segura
  const getCategoryDisplay = (category) => {
    // Si category es undefined, null o vacío
    if (!category || category === 'undefined' || category === 'null') {
      return "Sin categoría";
    }
    
    // Si category es un string vacío o solo espacios
    if (typeof category === 'string') {
      const trimmed = category.trim();
      if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') {
        return "Sin categoría";
      }
      return trimmed;
    }
    
    return category;
  };

  return (
    <div 
      className="simple-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => onProductClick && onProductClick(id)} // Maneja el clic en toda la tarjeta
    >
      {/* Contenedor de imagen con botones flotantes */}
      <div className="relative">
        <img 
          src={img || "https://via.placeholder.com/300x200?text=Sin+Imagen"} 
          alt={name || "Producto"} 
          className="w-full h-48 object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150"; // Imagen de respaldo si falla la carga
          }}
        />
                {/* Botones flotantes en la esquina superior derecha */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            className="bg-white rounded-full p-2 shadow-md"
            onClick={handleAddClick}  // Manejador de eventos personalizado
          >
            <FaPlus className={`h-4 w-4 ${stock <= 0 ? 'text-gray-400' : 'text-green-600'}`} />
          </button>
                    {/* Botón para marcar/desmarcar como favorito */}
          <button 
            className="bg-white rounded-full p-2 shadow-md"
            onClick={handleToggleFavorite} // Cambia el estado de favorito
          >
            {isFavorite ? (
              <FaHeart className="h-4 w-4 text-red-500" />
            ) : (
              <FaRegHeart className={`h-4 w-4 ${isAuthenticated ? 'text-gray-500' : 'text-gray-400'}`} />
            )}
          </button>
        </div>
        
        {/* Indicador de estado de autenticación para favoritos (opcional) */}
        {!isAuthenticated && (
          <div className="absolute top-2 left-2">
            <div className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200">
              Inicia sesión para favoritos
            </div>
          </div>
        )}
      </div>

      {/* Información textual del producto */}
      <div className="p-4">
        <h3 className="text-gray-700 font-medium mb-1">{name}</h3>
        <p className="text-gray-800 font-bold mb-2">{price}</p>
        <div className="stars-container">
          {renderStars(rating)} {/* Renderiza estrellas según la calificación */}
        </div>
        

      </div>
    </div>
  );
};

export default ProductCard;
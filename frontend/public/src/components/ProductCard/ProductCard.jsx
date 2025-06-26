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
  const { id, name, price, rating, img, isFavorite, stock, category } = product;
  
  
  // Obtener información de autenticación
  const { auth } = useAuth();
  const { isAuthenticated } = auth;

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

   // Función para obtener el nombre de la categoría de forma seguraAdd commentMore actions
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

  // Controla el clic en el botón de añadir producto
  const handleAddClick = (e) => {
    e.stopPropagation();
    console.log('ProductCard - Add click with ID:', id);
    if (onAddClick) {
      onAddClick(id);
    }
  };

  // Manejar toggle de favorito con verificación de autenticación
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    
    console.log('ProductCard - Toggle favorite clicked:', {
      id,
      name,
      isAuthenticated,
      isFavorite
    });
    
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para guardar favoritos", {
        duration: 4000,
        position: 'bottom-center',
        style: {
          background: '#f87171',
          color: 'white',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        icon: '💚'
      });
      return;
    }
    
    if (!id) {
      console.error('ProductCard - ERROR: No ID provided for favorite toggle');
      toast.error("Error: ID del producto no encontrado");
      return;
    }
    
    if (onToggleFavorite) {
      console.log('ProductCard - Calling onToggleFavorite with ID:', id);
      onToggleFavorite(id);
    }
  };

  return (
    <div 
      className="simple-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => {
        console.log('ProductCard - Card clicked with ID:', id);
        onProductClick && onProductClick(id);
      }}
    >
      {/* Contenedor de imagen con botones flotantes */}
      <div className="relative">
        <img 
          src={img} 
          alt={name} 
          className="w-full h-48 object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
        
        {/* Botones flotantes en la esquina superior derecha */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200"
            onClick={handleAddClick}
            title="Añadir al carrito"
          >
            <FaPlus className="h-4 w-4 text-gray-700" />
          </button>
          
          {/* Botón para marcar/desmarcar como favorito */}
          <button 
            className={`bg-white rounded-full p-2 shadow-md transition-all duration-200 ${
              isAuthenticated 
                ? 'hover:bg-gray-50 cursor-pointer' 
                : 'cursor-pointer'
            }`}
            onClick={handleToggleFavorite}
            title={
              !isAuthenticated 
                ? "Inicia sesión para guardar favoritos" 
                : isFavorite 
                  ? "Quitar de favoritos" 
                  : "Agregar a favoritos"
            }
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
        <h3 className="text-gray-700 font-medium mb-1 line-clamp-2">{name}</h3>
         <p className="text-gray-600 text-sm mb-1 truncate">
          Categoría: {getCategoryDisplay(category)}
        </p>
        <p className="text-gray-800 font-bold mb-2">{price}</p>
         <div className="mt-2 text-xs text-gray-500">
          Stock: {stock > 0 ? stock : 'Agotado'}
        </div>
        <div className="stars-container">
          {renderStars(rating)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
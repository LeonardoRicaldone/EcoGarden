import React from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';

const ProductCard = ({ 
  product, 
  onProductClick, 
  onToggleFavorite,
  onAddClick 
}) => {
  const { id, name, price, rating, img, isFavorite, stock } = product;

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
  const handleAddClick = async (e) => {
    e.stopPropagation();
    
    console.log('Add button clicked for product:', id); // Debug
    
    if (stock <= 0) {
      alert("Este producto no tiene stock disponible");
      return;
    }

    if (!id) {
      console.error('ID de producto no válido:', id);
      alert("Error: ID de producto no válido");
      return;
    }

    try {
      if (onAddClick) {
        await onAddClick(id);
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      alert("Ocurrió un error al añadir al carrito. Por favor intenta nuevamente.");
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    
    console.log('Favorite button clicked for product:', id); // Debug
    
    if (!id) {
      console.error('ID de producto no válido para favoritos:', id);
      alert("Error: ID de producto no válido");
      return;
    }
    
    if (onToggleFavorite) {
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

  return (
    <div 
      className="simple-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Contenedor de imagen con botones flotantes */}
      <div className="relative">
        <img 
          src={img || "https://via.placeholder.com/300x200?text=Sin+Imagen"} 
          alt={name || "Producto"} 
          className="w-full h-48 object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
          }}
        />
        
        {/* Mostrar etiqueta si no hay stock */}
        {stock <= 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Agotado
          </div>
        )}
        
        {/* Botones flotantes */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            className={`bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors ${
              stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
            onClick={handleAddClick}
            title={stock <= 0 ? "Sin stock disponible" : "Añadir al carrito"}
            disabled={stock <= 0}
          >
            <FaPlus className={`h-4 w-4 ${stock <= 0 ? 'text-gray-400' : 'text-green-600'}`} />
          </button>
          
          <button 
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 hover:shadow-lg transition-colors"
            onClick={handleToggleFavorite}
            title={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
          >
            {isFavorite ? (
              <FaHeart className="h-4 w-4 text-red-500" />
            ) : (
              <FaRegHeart className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Información textual del producto */}
      <div className="p-4">
        <h3 className="text-gray-700 font-medium mb-1 truncate" title={name}>
          {name || "Producto sin nombre"}
        </h3>
        <p className="text-gray-800 font-bold mb-2">
          {formatPrice(price)}
        </p>
        <div className="stars-container">
          {renderStars(rating)}
        </div>
        {/* Mostrar stock disponible */}
        <div className="mt-2 text-xs text-gray-500">
          Stock: {stock > 0 ? stock : 'Agotado'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
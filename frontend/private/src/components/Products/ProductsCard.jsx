import React, { useState } from 'react';
import './ProductsCard.css';


const ProductsCard = ({ 
  name, 
  price, 
  imageUrl, 
  descripcion, 
  stock, 
  category, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  // Estado para manejar el error de carga de imagen
  const [imageError, setImageError] = useState(false);

  // Función para manejar el error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {imageError || !imageUrl ? (
          <div className="image-placeholder">
            <span>📷</span>
            <p>Sin imagen</p>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={name}
            onError={handleImageError}
          />
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {descripcion && <p className="product-description">{descripcion}</p>}
        <div className="product-details">
          <p className="product-price">${price}</p>
          {stock !== undefined && <p className="product-stock">Stock: {stock}</p>}
          {category && <p className="product-category">Categoría: {category}</p>}
        </div>
      </div>
      
      {showActions && (
        <div className="product-actions">
          <button 
            onClick={onEdit}
            className="edit-btn"
            title="Editar producto"
          >
            ✏️ Editar
          </button>
          <button 
            onClick={onDelete}
            className="delete-btn"
            title="Eliminar producto"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsCard;
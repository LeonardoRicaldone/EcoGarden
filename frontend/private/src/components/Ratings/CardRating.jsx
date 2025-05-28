import React from "react";

const CardRating = ({ rating }) => {
  // Función para renderizar las estrellas según el score
  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= score ? "star filled" : "star empty"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Función para mostrar el score con .0 solo si es entero
  const formatScore = (score) => {
    return Number.isInteger(score) ? `${score}.0` : score;
  };

  return (
    <div className="rating-card">
      {/* Imagen del producto */}
      <div className="product-image">
        <img 
          src={rating.idProduct?.imgProduct || '/default-product.png'} 
          alt={rating.idProduct?.name || 'Producto'}
          onError={(e) => {
            e.target.src = '/default-product.png';
          }}
        />
      </div>
      
      {/* Contenido de la reseña */}
      <div className="rating-content">
        {/* Nombre del producto */}
        <h3 className="product-name">
          {rating.idProduct?.name || 'Producto no encontrado'}
        </h3>
        
        {/* Nombre del cliente */}
        <p className="client-name">
          Cliente: {rating.idClient?.name || 'Cliente no encontrado'}
        </p>
        
        {/* Calificación con estrellas */}
        <div className="rating-score">
          <div className="stars">
            {renderStars(rating.score)}
          </div>
          <span className="score-number">{formatScore(rating.score)}</span>
        </div>
        
        {/* Comentario */}
        <div className="comment-section">
          <p className="comment-label">Comentario:</p>
          <p className="comment-text">{rating.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default CardRating;

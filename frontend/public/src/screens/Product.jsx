import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import './Product.css';

const Product = () => {
  // Estado para la cantidad y el estado de favorito
  const [quantity, setQuantity] = useState(1);
  // Estado para el botón de favorito
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Funciones para aumentar y disminuir la cantidad
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Función para alternar el estado de favorito
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="page-container">
    <div className="product-container">
      {/* Navegación de regreso */}
      <div className="back-navigation">
        <Link to="/" className="back-link">
          <FaArrowLeft className="back-icon" /> 
          <span>volver a todas las plantas</span>
        </Link>
      </div>

      <div className="product-layout">
        {/* Columna izquierda: Imágenes */}
        <div className="product-images">
          <div className="image-gallery">
            {/* Miniaturas */}
<div className="thumbnails">
  {/* Primera miniatura */}
  <div className="thumbnail-item">
    <img 
      src="https://mayasl.com/wp-content/uploads/2021/09/girasol-pequeno-que-es-e1631002188655-582x480.jpg" 
      alt="Girasol vista 1"
      className="thumbnail-image"
    />
  </div>
  
  {/* Segunda miniatura */}
  <div className="thumbnail-item">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/a/a9/A_sunflower.jpg" 
      alt="Girasol vista 2"
      className="thumbnail-image"
    />
  </div>
  
  {/* Tercera miniatura */}
  <div className="thumbnail-item">
    <img 
      src="https://www.aquarelle.es/cms-build/uploads/media/sulu-400x400/04/1454-girasoles_verde.jpg?v=1-0" 
      alt="Girasol vista 3"
      className="thumbnail-image"
    />
  </div>
</div>
            
            {/* Imagen principal */}
            <div className="main-image-container">
              <img 
                src="https://cdn-pro.elsalvador.com/wp-content/uploads/2023/03/JO-Cultivo-de-girasoles095.jpg" 
                alt="Girasol" 
                className="main-image"
              />
              <button className="zoom-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha: Información del producto */}
        <div className="product-info">
          {/* Etiquetas */}
          <div className="product-tags">
            <span className="tag">Semillas</span>
            <span className="tag">Plantas decorativas</span>
          </div>
          
          {/* Encabezado del producto */}
          <div className="product-header">
            <h1 className="product-title">Girasol</h1>
            <button 
              onClick={toggleFavorite} // Cambia el estado de favorito
              className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
            >
              <FaHeart />
            </button>
          </div>
          
          {/* Precio */}
          <p className="product-price">$39</p>
          
          {/* Calificación */}
          <div className="product-rating">
            <div className="rating-stars">
              <span className="star filled">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <span className="rating-count">(1 Opinión)</span>
          </div>
          
          {/* Descripción */}
          <div className="product-description">
            <h2 className="description-title">Descripción</h2>
            <p className="description-text">
              ¡Lleva la alegría del sol a tu hogar! 🌻 Nuestro girasol es símbolo de 
              energía positiva, felicidad y buenos deseos. Cultivado con cuidado, tiene 
              un color amarillo vibrante y pétalos grandes que iluminan cualquier 
              espacio. Ideal para regalar, decorar interiores y jardines. Fácil de cuidar y 
              resistente. ¡Hazte parte de tu vida y llena tus días de luz!
            </p>
          </div>
          
          {/* Control de cantidad y botón de compra */}
          <div className="purchase-controls">
            <div className="quantity-control">
              <button 
                onClick={decreaseQuantity} // Disminuir cantidad
                className="quantity-button"
              >
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                onClick={increaseQuantity}  // Aumentar cantidad
                className="quantity-button"
              >
                +
              </button>
            </div>
            <Link to={"/ShoppingCart"}><button className="buy-button">
              Tramitar compra
            </button></Link>
          </div>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="comments-section">
        <h2 className="comments-title">Comentarios</h2>
        
        <div className="comment-item">
          <div className="comment-avatar">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Foto_Perfil_.jpg" 
              alt="Peter Anderson" 
              className="avatar-image"
            />
          </div>
          <div className="comment-content">
            <h3 className="comment-author">Peter Anderson</h3>
            <p className="comment-text">
              No me gustan los girasoles, igual compré uno, no me gustó como quedó en la casa,
              no me gustó el color amarillo, también está muy caro
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Product;
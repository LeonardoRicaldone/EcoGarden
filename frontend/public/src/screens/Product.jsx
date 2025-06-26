import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaShoppingCart, FaStar, FaRegStar, FaRegHeart, FaUser, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './Product.css';
import { useAuth } from '../context/AuthContext';
import useShoppingCart from '../hooks/useShoppingCart';
import useFavorites from '../hooks/useFavorites';
import useProductRatings from '../hooks/useProductsRatings';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados del componente
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Hook de ratings
  const {
    ratings,
    loading: loadingRatings,
    submitting: submittingComment,
    newComment,
    newScore,
    setNewComment,
    setNewScore,
    submitRating,
    deleteRating,
    averageRating,
    totalRatings,
    userRatings,
    isAuthenticated,
    clientId
  } = useProductRatings(id);

  // Hooks de autenticación y funcionalidades
  const { auth, user } = useAuth();
  
  // Hooks para carrito y favoritos
  const { addToCart, isInCart, getProductQuantity } = useShoppingCart(isAuthenticated ? clientId : null);
  const { toggleFavorite, isFavorite } = useFavorites(isAuthenticated ? clientId : null);

  // URLs de tu API
  const PRODUCTS_API = "http://localhost:4000/api/products";

  // Función para obtener token de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  // Headers con autenticación
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  };

  // Cargar datos del producto
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching product with ID:', id);

        // Obtener producto
        const response = await fetch(`${PRODUCTS_API}/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          }
          if (response.status === 400) {
            throw new Error('ID de producto inválido');
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const productData = await response.json();
        console.log('Product data received:', productData);

        setProduct(productData);

      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Función para enviar nuevo comentario
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    await submitRating();
  };

  // Funciones para manejar cantidad
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (product) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
    }
  };

  // Función para alternar favorito
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para guardar favoritos", {
        duration: 4000,
        position: 'bottom-center',
        style: {
          background: '#f87171',
          color: 'white',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px'
        },
        icon: '💚'
      });
      return;
    }

    if (product) {
      await toggleFavorite(product._id);
    }
  };

  // Función para añadir al carrito
  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar productos al carrito", {
        duration: 4000,
        position: 'bottom-center',
        style: {
          background: '#f87171',
          color: 'white',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px'
        },
        icon: '🛒'
      });
      return;
    }

    if (product.stock === 0) {
      toast.error("Producto sin stock");
      return;
    }

    const success = await addToCart(product._id, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  // Función para ir al carrito
  const handleGoToCart = () => {
    navigate('/ShoppingCart');
  };

  // Función para renderizar estrellas (para mostrar rating)
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= numRating;
      stars.push(
        <span
          key={i}
          onClick={interactive ? () => onStarClick(i) : undefined}
          className={`product-detail-star ${interactive ? 'product-detail-star-interactive' : ''} ${isFilled ? 'product-detail-star-filled' : ''}`}
        >
          {isFilled 
            ? <FaStar className="product-detail-star-icon filled" /> 
            : <FaRegStar className="product-detail-star-icon empty" />
          }
        </span>
      );
    }
    return <div className="product-detail-stars-container">{stars}</div>;
  };

  // Función para obtener nombre de categoría
  const getCategoryName = () => {
    if (product?.idCategory) {
      if (typeof product.idCategory === 'object' && product.idCategory.name) {
        return product.idCategory.name;
      }
      return 'Categoría';
    }
    return 'Sin categoría';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para verificar si un rating pertenece al usuario actual
  const isUserRating = (rating) => {
    return rating.idClient?._id === clientId || rating.idClient === clientId;
  };

  // Función para eliminar rating
  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      await deleteRating(ratingId);
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="page-container">
        <div className="product-detail-container">
          <div className="product-detail-loading">
            <div className="product-detail-spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="product-detail-container">
          <div className="product-detail-error">
            <div className="product-detail-error-icon">⚠️</div>
            <h3 className="product-detail-error-title">
              {error || 'Producto no encontrado'}
            </h3>
            <p className="product-detail-error-message">
              {error === 'Producto no encontrado' 
                ? 'El producto que buscas no existe o ha sido eliminado.'
                : 'Hubo un problema al cargar la información del producto.'
              }
            </p>
            <div className="product-detail-error-actions">
              <Link to="/Products">
                <button className="product-detail-btn-primary">
                  Ver todos los productos
                </button>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="product-detail-btn-secondary"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preparar imagen del producto
  const productImage = product.imgProduct;

  // Verificar si el producto está en favoritos
  const isProductFavorite = isFavorite && isFavorite(product._id);
  
  // Verificar si el producto está en el carrito
  const productInCart = isInCart && isInCart(product._id);
  const cartQuantity = getProductQuantity && getProductQuantity(product._id);

  return (
    <div className="page-container">
      <div className="product-detail-container">
        {/* Navegación de regreso */}
        <div className="product-detail-back-navigation">
          <Link to="/Products" className="product-detail-back-link">
            <FaArrowLeft className="product-detail-back-icon" /> 
            <span>Volver a todos los productos</span>
          </Link>
        </div>

        <div className="product-detail-layout">
          {/* Columna izquierda: Imagen */}
          <div className="product-detail-images">
            <div className="product-detail-image-gallery">
              <div className="product-detail-main-image-container">
                <img 
                  src={productImage || "https://via.placeholder.com/500x500/93A267/FFFFFF?text=Sin+Imagen"} 
                  alt={product.name} 
                  className="product-detail-main-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x500/93A267/FFFFFF?text=Sin+Imagen";
                  }}
                />
                {productImage && (
                  <button className="product-detail-zoom-button" title="Ampliar imagen">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                      <path d="M11 8v6"></path>
                      <path d="M8 11h6"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha: Información del producto */}
          <div className="product-detail-info">
            {/* Etiquetas */}
            <div className="product-detail-tags">
              <span className="product-detail-tag">{getCategoryName()}</span>
              <span className={`product-detail-tag ${product.stock > 0 ? 'product-detail-tag-success' : 'product-detail-tag-danger'}`}>
                Stock: {product.stock}
              </span>
            </div>
            
            {/* Encabezado del producto */}
            <div className="product-detail-header">
              <h1 className="product-detail-title">{product.name}</h1>
              <button 
                onClick={handleToggleFavorite}
                className={`product-detail-favorite-button ${isProductFavorite ? 'product-detail-favorite-active' : ''}`}
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Inicia sesión para guardar favoritos" : 
                       isProductFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isProductFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            
            {/* Precio */}
            <p className="product-detail-price">${product.price}</p>
            
            {/* Calificación dinámica */}
            <div className="product-detail-rating">
              {renderStars(averageRating)}
              <span className="product-detail-rating-count">
                ({averageRating}/5.0 - {totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})
              </span>
            </div>

            {/* Stock disponible */}
            <div className={`product-detail-stock-info ${product.stock > 0 ? 'product-detail-stock-available' : 'product-detail-stock-unavailable'}`}>
              <p className="product-detail-stock-message">
                <span className="product-detail-stock-icon">
                  {product.stock > 0 ? '✅' : '❌'}
                </span>
                {product.stock > 0 
                  ? `${product.stock} unidades disponibles`
                  : 'Producto agotado'
                }
              </p>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="product-detail-stock-warning">
                  ⚠️ Pocas unidades disponibles
                </p>
              )}
            </div>
            
            {/* Descripción */}
            <div className="product-detail-description">
              <h2 className="product-detail-description-title">Descripción</h2>
              <p className="product-detail-description-text">
                {product.descripcion || 
                 "Este producto no tiene descripción disponible. Contacta con nosotros para más información sobre sus características y beneficios."}
              </p>
            </div>
            
            {/* Control de cantidad y botones de acción */}
            <div className="product-detail-purchase-controls">
              {product.stock > 0 && (
                <div className="product-detail-quantity-control">
                  <button 
                    onClick={decreaseQuantity}
                    className="product-detail-quantity-button"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="product-detail-quantity-display">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="product-detail-quantity-button"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              )}

              {/* Botones de acción */}
              <div className="product-detail-action-buttons">
                {product.stock > 0 ? (
                  <>
                    <button 
                      onClick={handleAddToCart}
                      className="product-detail-buy-button"
                      disabled={!isAuthenticated}
                    >
                      <FaShoppingCart className="product-detail-button-icon" />
                      {!isAuthenticated ? 'Inicia sesión' : 'Agregar al carrito'}
                    </button>
                    
                    {productInCart && cartQuantity > 0 && (
                      <button 
                        onClick={handleGoToCart}
                        className="product-detail-cart-button"
                      >
                        Ver en carrito ({cartQuantity})
                      </button>
                    )}
                  </>
                ) : (
                  <button 
                    className="product-detail-buy-button product-detail-buy-button-disabled"
                    disabled
                  >
                    Producto agotado
                  </button>
                )}
              </div>
            </div>

            {/* Información adicional para usuarios no autenticados */}
            {!isAuthenticated && (
              <div className="product-detail-login-prompt">
                <p>
                  💡 <Link to="/Login" className="product-detail-login-link">
                    Inicia sesión
                  </Link> para agregar productos al carrito y guardar favoritos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de comentarios y calificaciones */}
        <div className="product-detail-comments-section">
          <h2 className="product-detail-comments-title">
            Reseñas y Comentarios ({totalRatings})
          </h2>

          {/* Formulario para agregar comentario */}
          {isAuthenticated ? (
            <div className="product-detail-review-form">
              <h3 className="product-detail-review-form-title">
                Escribir una reseña
              </h3>
              
              <form onSubmit={handleSubmitComment}>
                {/* Selector de calificación */}
                <div className="product-detail-rating-input">
                  <label className="product-detail-label">
                    Calificación:
                  </label>
                  <div className="product-detail-star-rating">
                    {renderStars(newScore, true, setNewScore)}
                  </div>
                </div>

                {/* Campo de comentario */}
                <div className="product-detail-comment-input">
                  <label className="product-detail-label">
                    Comentario:
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Comparte tu experiencia con este producto..."
                    rows={4}
                    className="product-detail-comment-textarea"
                    required
                  />
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={submittingComment || newScore === 0 || !newComment.trim()}
                  className="product-detail-submit-review-btn"
                >
                  {submittingComment ? 'Enviando...' : 'Publicar Reseña'}
                </button>
              </form>

              {/* Mostrar comentarios del usuario actual si tiene */}
              {userRatings.length > 0 && (
                <div className="product-detail-user-comments">
                  <h4 className="product-detail-user-comments-title">
                    Tus comentarios ({userRatings.length})
                  </h4>
                  <div className="product-detail-user-comments-list">
                    {userRatings.map((rating) => (
                      <div key={rating._id} className="product-detail-user-comment-item">
                        <div className="product-detail-user-comment-header">
                          {renderStars(rating.score)}
                          <span className="product-detail-user-comment-date">
                            {formatDate(rating.createdAt)}
                          </span>
                          <button
                            onClick={() => handleDeleteRating(rating._id)}
                            className="product-detail-delete-btn"
                            title="Eliminar comentario"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <p className="product-detail-user-comment-text">
                          {rating.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="product-detail-login-prompt">
              <p>
                <Link to="/Login" className="product-detail-login-link">
                  Inicia sesión
                </Link> para escribir una reseña de este producto
              </p>
            </div>
          )}

          {/* Lista de comentarios */}
          {loadingRatings ? (
            <div className="product-detail-loading-text">
              <p>Cargando comentarios...</p>
            </div>
          ) : ratings.length > 0 ? (
            <div className="product-detail-reviews-list">
              <h3 className="product-detail-all-comments-title">
                Todos los comentarios
              </h3>
              {ratings.map((rating) => (
                <div key={rating._id} className="product-detail-review-item">
                  <div className="product-detail-review-header">
                    <div className="product-detail-review-user-info">
                      <div className="product-detail-user-avatar">
                        <FaUser size={16} />
                      </div>
                      <div className="product-detail-user-details">
                        <h4 className="product-detail-user-name">
                          {rating.idClient?.name || 'Usuario'}
                          {isUserRating(rating) && (
                            <span className="product-detail-user-badge">(Tú)</span>
                          )}
                        </h4>
                        <div className="product-detail-user-rating-date">
                          {renderStars(rating.score)}
                          <span className="product-detail-review-date">
                            {formatDate(rating.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botón eliminar solo para comentarios del usuario */}
                    {isUserRating(rating) && (
                      <button
                        onClick={() => handleDeleteRating(rating._id)}
                        className="product-detail-delete-btn"
                        title="Eliminar comentario"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <p className="product-detail-review-comment">
                    {rating.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="product-detail-no-reviews">
              <div className="product-detail-no-reviews-icon">💬</div>
              <h3 className="product-detail-no-reviews-title">
                Sin reseñas aún
              </h3>
              <p className="product-detail-no-reviews-text">
                Sé el primero en compartir tu experiencia con este producto
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
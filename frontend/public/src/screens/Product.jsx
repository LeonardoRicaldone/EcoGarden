import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaShoppingCart, FaStar, FaRegStar, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './Product.css';
import { useAuth } from '../context/AuthContext';
import useShoppingCart from '../hooks/useShoppingCart';
import useFavorites from '../hooks/useFavorites';

const Product = () => {
  const { id } = useParams(); // Obtener ID del producto desde la URL
  const navigate = useNavigate();
  
  // Estados del componente
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Hooks de autenticación y funcionalidades
  const { auth, user } = useAuth();
  const { isAuthenticated } = auth;
  const clientId = user?.id || null;

  // Hooks para carrito y favoritos
  const { addToCart, isInCart, getProductQuantity } = useShoppingCart(isAuthenticated ? clientId : null);
  const { toggleFavorite, isFavorite } = useFavorites(isAuthenticated ? clientId : null);

  // URL de tu API (ajustada para tu backend)
  const PRODUCTS_API = "http://localhost:4000/api/products";

  // Cargar datos del producto
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching product with ID:', id);

        // Obtener producto (tu endpoint ya incluye populate de la categoría)
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

        // Tu backend devuelve el producto directamente
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
      // Resetear cantidad después de agregar
      setQuantity(1);
    }
  };

  // Función para ir al carrito
  const handleGoToCart = () => {
    navigate('/ShoppingCart');
  };

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    const numRating = rating || Math.floor(Math.random() * 5) + 1; // Rating aleatorio si no existe
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= numRating 
          ? <FaStar key={i} className="text-yellow-500" /> 
          : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  // Función para obtener nombre de categoría
  const getCategoryName = () => {
    if (product?.idCategory) {
      // Si está populado, tendrá la propiedad name
      if (typeof product.idCategory === 'object' && product.idCategory.name) {
        return product.idCategory.name;
      }
      // Si solo es el ID
      return 'Categoría';
    }
    return 'Sin categoría';
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="page-container">
        <div className="product-container" style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #93A267',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p>Cargando producto...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="product-container" style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ color: '#e74c3c', fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>
            {error || 'Producto no encontrado'}
          </h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {error === 'Producto no encontrado' 
              ? 'El producto que buscas no existe o ha sido eliminado.'
              : 'Hubo un problema al cargar la información del producto.'
            }
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/Products">
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#93A267',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}>
                Ver todos los productos
              </button>
            </Link>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preparar imagen del producto (solo usar la del backend)
  const productImage = product.imgProduct;

  // Verificar si el producto está en favoritos
  const isProductFavorite = isFavorite && isFavorite(product._id);
  
  // Verificar si el producto está en el carrito
  const productInCart = isInCart && isInCart(product._id);
  const cartQuantity = getProductQuantity && getProductQuantity(product._id);

  return (
    <div className="page-container">
      <div className="product-container">
        {/* Navegación de regreso */}
        <div className="back-navigation">
          <Link to="/Products" className="back-link">
            <FaArrowLeft className="back-icon" /> 
            <span>volver a todos los productos</span>
          </Link>
        </div>

        <div className="product-layout">
          {/* Columna izquierda: Imagen */}
          <div className="product-images">
            <div className="image-gallery">
              {/* Imagen principal */}
              <div className="main-image-container">
                <img 
                  src={productImage || "https://via.placeholder.com/500x500/93A267/FFFFFF?text=Sin+Imagen"} 
                  alt={product.name} 
                  className="main-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x500/93A267/FFFFFF?text=Sin+Imagen";
                  }}
                />
                {productImage && (
                  <button className="zoom-button" title="Ampliar imagen">
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
          <div className="product-info">
            {/* Etiquetas */}
            <div className="product-tags">
              <span className="tag">{getCategoryName()}</span>
              <span className="tag" style={{
                backgroundColor: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                color: product.stock > 0 ? '#166534' : '#dc2626'
              }}>
                Stock: {product.stock}
              </span>
            </div>
            
            {/* Encabezado del producto */}
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <button 
                onClick={handleToggleFavorite}
                className={`favorite-button ${isProductFavorite ? 'favorite-active' : ''}`}
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Inicia sesión para guardar favoritos" : 
                       isProductFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                style={{
                  opacity: !isAuthenticated ? 0.5 : 1,
                  cursor: !isAuthenticated ? 'not-allowed' : 'pointer'
                }}
              >
                {isProductFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            
            {/* Precio */}
            <p className="product-price">${product.price}</p>
            
            {/* Calificación */}
            <div className="product-rating">
              {renderStars(product.rating)}
              <span className="rating-count">(Calificación: {product.rating || 'N/A'})</span>
            </div>

            {/* Stock disponible */}
            <div className="stock-info" style={{ 
              margin: '1rem 0', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              backgroundColor: product.stock > 0 ? '#f0f9ff' : '#fef2f2',
              border: `1px solid ${product.stock > 0 ? '#bae6fd' : '#fecaca'}`
            }}>
              <p style={{ 
                margin: 0, 
                color: product.stock > 0 ? '#0369a1' : '#dc2626',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '0.5rem' }}>
                  {product.stock > 0 ? '✅' : '❌'}
                </span>
                {product.stock > 0 
                  ? `${product.stock} unidades disponibles`
                  : 'Producto agotado'
                }
              </p>
              {product.stock > 0 && product.stock <= 10 && (
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  color: '#f59e0b',
                  fontSize: '0.75rem'
                }}>
                  ⚠️ Pocas unidades disponibles
                </p>
              )}
            </div>
            
            {/* Descripción */}
            <div className="product-description">
              <h2 className="description-title">Descripción</h2>
              <p className="description-text">
                {product.descripcion || 
                 "Este producto no tiene descripción disponible. Contacta con nosotros para más información sobre sus características y beneficios."}
              </p>
            </div>
            
            {/* Control de cantidad y botones de acción */}
            <div className="purchase-controls">
              {product.stock > 0 && (
                <div className="quantity-control">
                  <button 
                    onClick={decreaseQuantity}
                    className="quantity-button"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="quantity-button"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              )}

              {/* Botones de acción */}
              <div className="action-buttons" style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                flexWrap: 'wrap',
                marginTop: '1rem'
              }}>
                {product.stock > 0 ? (
                  <>
                    <button 
                      onClick={handleAddToCart}
                      className="buy-button"
                      disabled={!isAuthenticated}
                      style={{ 
                        opacity: !isAuthenticated ? 0.6 : 1,
                        cursor: !isAuthenticated ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: '160px',
                        justifyContent: 'center'
                      }}
                    >
                      <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                      {!isAuthenticated ? 'Inicia sesión' : 'Agregar al carrito'}
                    </button>
                    
                    {productInCart && cartQuantity > 0 && (
                      <button 
                        onClick={handleGoToCart}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: '160px',
                          justifyContent: 'center'
                        }}
                      >
                        Ver en carrito ({cartQuantity})
                      </button>
                    )}
                  </>
                ) : (
                  <button 
                    className="buy-button"
                    disabled
                    style={{ 
                      backgroundColor: '#e5e7eb',
                      color: '#9ca3af',
                      cursor: 'not-allowed',
                      minWidth: '160px'
                    }}
                  >
                    Producto agotado
                  </button>
                )}
              </div>
            </div>

            {/* Información adicional para usuarios no autenticados */}
            {!isAuthenticated && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '0.5rem'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.875rem',
                  color: '#92400e'
                }}>
                  💡 <Link to="/Login" style={{ color: '#92400e', fontWeight: '600' }}>
                    Inicia sesión
                  </Link> para agregar productos al carrito y guardar favoritos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="comments-section">
          <h2 className="comments-title">Comentarios</h2>
          
          <div className="comment-item">
            <div className="comment-content">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
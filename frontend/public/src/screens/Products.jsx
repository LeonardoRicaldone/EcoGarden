import React from "react";
import "./Products.css";
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard";
import useProducts from "../components/Products/hooks/useProducts";

const Products = () => {
  const navigate = useNavigate();
  
  const {
    products,
    categories,
    loading,
    error,
    priceRange,
    selectedCategories,
    searchTerm,
    maxPrice,
    handlePriceRangeChange,
    handleCategoryChange,
    handleSearchChange,
    clearFilters,
    toggleFavorite,
    handleAddToCart,
    resultsInfo,
    isCategory,
    isEmpty,
    getCategoryName
  } = useProducts();

   // Función para obtener el nombre de la categoría de forma segura
  const getSafeCategoryName = (categoryId) => {
    try {
      const categoryName = getCategoryName(categoryId);
      return categoryName || "Sin categoría";
    } catch (error) {
      console.error('Error al obtener nombre de categoría:', error);
      return "Sin categoría";
    }
  };

  // DEBUG: Verificar los productos
  console.log('Products Component - Products data:', products.slice(0, 2));
      
  const handleProductClick = (productId) => {
    console.log('Products - Product clicked:', productId);
    navigate(`/product/${productId}`); 
  };

  const handleRangeChange = (e) => {
    handlePriceRangeChange(e.target.value);
  };

  const handleCheckboxChange = (categoryId) => {
    handleCategoryChange(categoryId);
  };

  const handleAddClick = (id) => {
    console.log('Products - Add to cart:', id);
    handleAddToCart(id);
  };

  const handleSearchInput = (e) => {
    handleSearchChange(e.target.value);
  };

  // DEBUG: Función para toggle de favoritos
  const handleToggleFavorite = (id) => {
    console.log('Products - Toggle favorite for ID:', id);
    if (!id) {
      console.error('Products - ERROR: No ID provided to toggleFavorite');
      return;
    }
    toggleFavorite(id);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="products-page-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
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
            <p>Cargando productos...</p>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="products-page-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{
              color: '#e74c3c',
              fontSize: '48px',
              marginBottom: '20px'
            }}>⚠️</div>
            <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>Error al cargar productos</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#93A267',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Recargar página
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <br />
      <div className="products-page-container">
        <div className="products-container">
          <div className="sidebar">
            {/* Barra de búsqueda */}
            <div className="search-filter" style={{ marginBottom: '25px' }}>
              <h3>Buscar</h3>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchInput}
                style={{
                  width: '100%',
                  minWidth: '280px',
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#93A267'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Filtro de precio */}
            <div className="price-filter">
              <h3>Precio</h3>
              <div className="range-container">
                <span>0€</span>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange}
                  onChange={handleRangeChange}
                />
                <span>{maxPrice}€</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Hasta {priceRange}€
              </div>
            </div>

            {/* Filtro de categorías */}
            <div className="category-filter">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Categoría</h3>
                {(selectedCategories.length > 0 || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#93A267',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textDecoration: 'underline'
                    }}
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <ul>
                {categories.map(category => (
                  <li key={category._id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={isCategory(category._id)}
                        onChange={() => handleCheckboxChange(category._id)}
                      />
                      {category.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="products-area">
            <div className="results-info">
              <span>{resultsInfo.message}</span>
              {resultsInfo.hasFilters && (
                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#93A267' }}>
                  (filtros aplicados)
                </span>
              )}
            </div>

            {isEmpty ? (
              <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h3>No se encontraron productos</h3>
                <p>No hay productos que coincidan con los filtros aplicados</p>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#93A267',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '15px'
                  }}
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => {
                  // DEBUG: Verificar cada producto individualmente
                  console.log('Products - Rendering product:', {
                    originalId: product.id,
                    _id: product._id,
                    name: product.name,
                    hasId: !!product.id
                  });

                  return (
                    <ProductCard 
                      key={product.id || product._id}
                      product={{
                        id: product.id || product._id, // FALLBACK por si acaso
                        name: product.name,
                        price: `${product.price}€`,
                        rating: product.rating || 3,
                        img: product.imgProduct,
                        isFavorite: product.isFavorite,
                        stock: product.stock,
                        description: product.description,
                        category: getCategoryName(product.idCategory)
                      }}
                      onProductClick={handleProductClick}
                      onToggleFavorite={handleToggleFavorite}
                      onAddClick={handleAddClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
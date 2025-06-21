import React from "react";
import "./Products.css";
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard";
import useProducts from "../components/Products/hooks/useProducts"; // Importar tu hook personalizado

const Products = () => {
  // Hook para la navegación
  const navigate = useNavigate();
  
  // Hook personalizado para manejar productos y filtros
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
      
  // Función para manejar el clic en un producto
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); 
  };

  // Función para manejar el cambio del input range
  const handleRangeChange = (e) => {
    handlePriceRangeChange(e.target.value);
  };

  // Función para manejar cambios en checkboxes de categorías
  const handleCheckboxChange = (categoryId) => {
    handleCategoryChange(categoryId);
  };

  // Función para manejar el click del botón añadir
  const handleAddClick = (id) => {
    handleAddToCart(id);
  };

  // Función para manejar búsqueda
  const handleSearchInput = (e) => {
    handleSearchChange(e.target.value);
  };

  // Mostrar loading
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

  // Mostrar error
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
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
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
                  <li key={category.id}>
                    <label>
                      <input 
                        type="checkbox"
                        checked={category.id === 'all' ? selectedCategories.length === 0 : isCategory(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}
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
                {/* Mapeo de productos filtrados para mostrar en la cuadrícula */}
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: `${product.price}€`,
                      rating: product.rating || 3,
                      img: product.imgProduct,
                      isFavorite: product.isFavorite,
                      stock: product.stock,
                      description: product.description,
                      category: getCategoryName(product.idCategory)
                    }}
                    onProductClick={() => handleProductClick(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddClick={handleAddClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
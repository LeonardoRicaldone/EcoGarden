import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Products.css"
import "./AddProduct.jsx"
import "./Inventary.jsx"
import "./Categories.jsx"
import Header from "../components/Header"
import ProductsNav from '../components/ProductsNav';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener productos del backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/products');
      
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar los productos. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(term)) ||
        (product.idCategory?.name && product.idCategory.name.toLowerCase().includes(term))
      );
      setFilteredProducts(filtered);
    }
  };

  // Función para calcular estadísticas simuladas (puedes ajustar según tu lógica de negocio)
  const calculateStats = (product) => {
    // Simulamos ventas y ingresos basados en el stock (puedes reemplazar con datos reales)
    const salesSimulated = Math.floor(Math.random() * product.stock * 0.3);
    const revenueSimulated = salesSimulated * product.price;
    
    return {
      sales: salesSimulated,
      revenue: revenueSimulated
    };
  };

  return (
    <>
      <div className="productos-container">
        <Header title={"Products"} />
        <ProductsNav />

        <div className="tabla-container">
          <div className="tabla-header">
            <h2>Productos destacados ({filteredProducts.length})</h2>
            <div className="buscador">
              <span className="material-icons">search</span>
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="tabla-scroll">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Cargando productos...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                <p>{error}</p>
                <button 
                  onClick={fetchProducts}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Reintentar
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No se encontraron productos.</p>
              </div>
            ) : (
              <table className="tabla-productos">
                <thead>
                  <tr>
                    <th>PRODUCTOS</th>
                    <th>STOCK</th>
                    <th>PRECIO</th>
                    <th>CATEGORÍA</th>
                    <th>VENTAS*</th>
                    <th>INGRESOS*</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stats = calculateStats(product);
                    return (
                      <tr key={product._id}>
                        <td>
                          <div className="producto-nombre">
                            {product.imgProduct ? (
                              <img 
                                src={product.imgProduct} 
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/32x32?text=IMG';
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                color: '#6b7280'
                              }}>
                                IMG
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: '500' }}>{product.name}</div>
                              {product.descripcion && (
                                <div style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#6b7280',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {product.descripcion}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            color: product.stock < 10 ? '#ef4444' : product.stock < 50 ? '#f59e0b' : '#10b981',
                            fontWeight: '500'
                          }}>
                            {product.stock}
                          </span>
                        </td>
                        <td>$ {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</td>
                        <td>
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            color: '#374151'
                          }}>
                            {product.idCategory?.name || 'Sin categoría'}
                          </span>
                        </td>
                        <td>{stats.sales}</td>
                        <td>$ {stats.revenue.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          
          {!loading && !error && filteredProducts.length > 0 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.5rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
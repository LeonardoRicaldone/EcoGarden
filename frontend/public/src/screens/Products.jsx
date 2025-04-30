import React, { useState } from "react";
import "./Products.css";
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard";

const Products = () => {
  const navigate = useNavigate();
      
  const handleProductClick = () => {
    navigate('/product'); 
  };

  const [rangeValue, setRangeValue] = useState(100);
  
  const toggleFavorite = (id) => {
    console.log(`Toggle favorito para producto ${id}`);
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
        ? { ...product, isFavorite: !product.isFavorite } 
        : product
      )
    );
  };

  const handleAddClick = (id) => {
    console.log(`Añadir producto ${id} al carrito`);
  };
  
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'bonete de obispo',
      price: '10€',
      rating: 4,
      img: 'https://i.etsystatic.com/13841971/r/il/43b81c/1224996118/il_570xN.1224996118_fwnp.jpg',
      isFavorite: false
    },
    {
      id: 2,
      name: 'cactus chin',
      price: '5€',
      rating: 2,
      img: 'https://www.jardineriaon.com/wp-content/uploads/2018/12/Gymnocalyciums-baldianum-Gymnocalyciums-baldianum-en-maceta.jpg',
      isFavorite: false
    },
    {
      id: 3,
      name: 'cactus columnar',
      price: '15€',
      rating: 3,
      img: 'https://www.cactusoutlet.com/cdn/shop/products/CM-Blue-Flame-Myrtillo-Product-Main-V1.1.jpg?v=1636157923',
      isFavorite: false
    },
    {
      id: 4,
      name: 'árbol candelabro',
      price: '10€',
      rating: 4,
      img: 'https://image.made-in-china.com/365f3j00OwSaNzJdcKkG/Candelabro-de-cactus-artificial-de-aspecto-realista-de-Serene-Spaces-Living-Planta-artificial-de-cactus-con-brazos-de-cactus-realistas-perfecta-para-la-decoraci-n-del-hogar-interior.webp',
      isFavorite: false
    },
    {
      id: 5,
      name: 'cactus de Navidad',
      price: '20€',
      rating: 3,
      img: 'https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/OAS32PERCNBB7GNDI7MIT4MLTQ.jpg',
      isFavorite: false
    },
    {
      id: 6,
      name: 'cactus de ordenador',
      price: '5€',
      rating: 2,
      img: 'https://kellogggarden.com/wp-content/uploads/2021/03/Tips-on-How-to-Grow-Rosemary.jpg',
      isFavorite: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todos las plantas'},
    { id: 'tools', name: 'Herramientas'},
    { id: 'trees', name: 'Árboles' },
    { id: 'bulbs', name: 'Bulbos'},
    { id: 'cactus', name: 'Cactus' },
    { id: 'seeds', name: 'Semillas'},
    { id: 'herbs', name: 'Hierbas' },
    { id: 'ferns', name: 'Helechos' },
    { id: 'sprinklers', name: 'Aspersores'},
    { id: 'shovels', name: 'Palas'}
  ];

  const handleRangeChange = (e) => {
    setRangeValue(e.target.value);
  };

  return (
    <div className="page-container">
      <br />
      <div className="products-page-container">
        <div className="products-container">
          <div className="sidebar">
            <div className="price-filter">
              <h3>Precio</h3>
              <div className="range-container">
                <span>0€</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={rangeValue} 
                  onChange={handleRangeChange} 
                />
                <span>100€</span>
              </div>
            </div>
            
            <div className="category-filter">
              <h3>Categoría</h3>
              <ul>
                {categories.map(category => (
                  <li key={category.id}>
                    <label>
                      <input 
                        type="checkbox" 
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
              <span>3000 resultados</span>
            </div>
            
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onToggleFavorite={toggleFavorite}
                  onAddClick={handleAddClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
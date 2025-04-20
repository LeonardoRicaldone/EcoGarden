import React, { useState } from "react";
import "./Products.css";
import { FaStar, FaRegStar } from 'react-icons/fa';

const Products = () => {
  const [rangeValue, setRangeValue] = useState(100);
  
  // Función para renderizar estrellas basadas en puntuación
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating 
          ? <FaStar key={i} className="text-yellow-500" /> 
          : <FaRegStar key={i} className="text-gray-300" />
      );
    }
    return <div className="flex">{stars}</div>;
  };
  
  const products = [
    {
      id: 1,
      name: 'bonete de obispo',
      price: '10€',
      rating: 4,
      image: 'https://i.etsystatic.com/13841971/r/il/43b81c/1224996118/il_570xN.1224996118_fwnp.jpg'
    },
    {
      id: 2,
      name: 'cactus chin',
      price: '5€',
      rating: 2,
      image: 'https://www.jardineriaon.com/wp-content/uploads/2018/12/Gymnocalyciums-baldianum-Gymnocalyciums-baldianum-en-maceta.jpg'
    },
    {
      id: 3,
      name: 'cactus columnar',
      price: '15€',
      rating: 3,
      image: 'https://www.cactusoutlet.com/cdn/shop/products/CM-Blue-Flame-Myrtillo-Product-Main-V1.1.jpg?v=1636157923'
    },
    {
      id: 4,
      name: 'árbol candelabro',
      price: '10€',
      rating: 4,
      image: 'https://image.made-in-china.com/365f3j00OwSaNzJdcKkG/Candelabro-de-cactus-artificial-de-aspecto-realista-de-Serene-Spaces-Living-Planta-artificial-de-cactus-con-brazos-de-cactus-realistas-perfecta-para-la-decoraci-n-del-hogar-interior.webp'
    },
    {
      id: 5,
      name: 'cactus de Navidad',
      price: '20€',
      rating: 3,
      image: 'https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/OAS32PERCNBB7GNDI7MIT4MLTQ.jpg'
    },
    {
      id: 6,
      name: 'cactus de ordenador',
      price: '5€',
      rating: 2,
      image: 'https://kellogggarden.com/wp-content/uploads/2021/03/Tips-on-How-to-Grow-Rosemary.jpg'
    }
  ];

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
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="bg-white p-1 rounded-full shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button className="bg-white p-1 rounded-full shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.price}</p>
                  <div className="mt-2">
                    {renderStars(product.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Products;
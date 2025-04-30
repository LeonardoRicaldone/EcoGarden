import React, { useState } from "react";
import "./ShoppingCart.css";
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaTruck, FaGift, FaCheck, FaDollarSign } from 'react-icons/fa';

const ShoppingCart = () => {
    // Estado para los productos en el carrito
    const [cartItems, setCartItems] = useState([
        {
            id: "abfse0294430bc",
            name: "Echeveria elegans",
            price: 10,
            originalPrice: 14,
            quantity: 1,
            img: "https://coastalsucculentsandcacti.com/cdn/shop/products/20220815_175134_540x.jpg?v=1660601267"
        },
        {
            id: "abfse0294430bd",
            name: "Boca de dragon",
            price: 8,
            originalPrice: null,
            quantity: 1,
            img: "https://media.revistaad.es/photos/62cd549b7cfdd4662ecbbb95/master/w_1600%2Cc_limit/Flor%2520boca%2520de%2520dragon.jpg"
        }
    ]);

    // Calcular subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Gastos de envío
    const shippingCost = 4;
    
    // Total de la compra
    const totalAmount = subtotal + shippingCost;

    // Función para incrementar la cantidad
    const incrementQuantity = (id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Función para decrementar la cantidad
    const decrementQuantity = (id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Función para eliminar un item
    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Función para vaciar el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <div className="page-container">
        <div className="shopping-cart-container">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold title-color mb-6">Mi carrito</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna de productos */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="flex flex-col md:flex-row items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden mr-4 mb-4 md:mb-0">
                                            <img 
                                                src={item.img} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150";
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-medium product-title-color mb-1">{item.name}</h3>
                                                    <div className="flex items-center">
                                                        <span className="font-bold price-color">{item.price}$</span>
                                                        {item.originalPrice && (
                                                            <span className="ml-2 text-sm text-gray-500 line-through">{item.originalPrice}$</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">ID: {item.id}</p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-3 md:mt-0">
                                                    <div className="quantity-selector flex items-center bg-white border border-gray-300 rounded-full overflow-hidden mr-4">
                                                        <button 
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                            onClick={() => decrementQuantity(item.id)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-3 py-1">{item.quantity}</span>
                                                        <button 
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                            onClick={() => incrementQuantity(item.id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="text-right">
                                                        <span className="font-medium">Total: </span>
                                                        <span className="font-bold price-color">{item.price * item.quantity}$</span>
                                                    </div>
                                                    <button 
                                                        className="ml-4 delete-icon-color hover:text-red-500"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {cartItems.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Tu carrito está vacío</p>
                                </div>
                            )}

                            <div className="flex justify-between mt-6">
                                <button 
                                    className="flex items-center px-6 py-2 border outline-button-border outline-button-text rounded-full hover:outline-button-hover"
                                    onClick={clearCart}
                                >
                                    <FaTrashAlt className="mr-2" />
                                    Vaciar carrito
                                </button>
                                <Link to="/Products"><button className="flex items-center px-6 py-2 border outline-button-border outline-button-text rounded-full hover:outline-button-hover">
                                    Volver a la tienda
                                </button></Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Columna de resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-medium title-color mb-4">Subtotal</h2>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Subtotal</span>
                                <span className="font-bold">{subtotal}$</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Gastos de envío</span>
                                <span className="font-bold">{shippingCost}$</span>
                            </div>
                            <div className="flex justify-between py-4 mt-2">
                                <span className="text-lg font-medium">Total compra</span>
                                <span className="text-lg font-bold price-color">{totalAmount}$</span>
                            </div>
                            
                            <button className="w-full py-3 primary-button-bg primary-button-text rounded-md hover:primary-button-hover mt-4 tramitarcompra">
                                Tramitar compra
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <FaTruck className="icon-color mr-3" />
                                <div>
                                    <h3 className="font-medium">Entrega estimada</h3>
                                    <p className="text-gray-600">Mañana</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Sección de beneficios */}
                <div className="features-section-bg rounded-lg mt-8 p-6 cajaBeneficios">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <FaTruck className="feature-icon-color text-2xl mb-2" />
                            <h3 className="font-medium">Entrega rápida</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaGift className="feature-icon-color text-2xl mb-2" />
                            <h3 className="font-medium">Envío gratis a partir de un gasto de 70 dólares</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCheck className="feature-icon-color text-2xl mb-2" />
                            <h3 className="font-medium">Mejor calidad</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaDollarSign className="feature-icon-color text-2xl mb-2" />
                            <h3 className="font-medium">Precios justos</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ShoppingCart;
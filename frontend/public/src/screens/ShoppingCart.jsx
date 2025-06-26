import React from "react";
import "./ShoppingCart.css";
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaTruck, FaGift, FaCheck, FaDollarSign } from 'react-icons/fa';
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import useShoppingCart from "../hooks/useShoppingCart";

const ShoppingCart = () => {
    const navigate = useNavigate();

    // Obtener información de autenticación
    const { auth, user } = useAuth();
    const { isAuthenticated } = auth;
    const clientId = user?.id || null;

    // Usar el hook del carrito
    const {
        cartItems,
        cartId,
        loading,
        error,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal,
        getTotalAmount,
        getTotalItems,
        isEmpty
    } = useShoppingCart(isAuthenticated ? clientId : null);

    // Gastos de envío
    const shippingCost = 4;
    const subtotal = getSubtotal();
    const totalAmount = getTotalAmount(shippingCost);
    const totalItems = getTotalItems();

    // FUNCIÓN PARA MANEJAR EL CHECKOUT
    const handleCheckout = () => {

        // Verificar autenticación
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para continuar con la compra', {
                duration: 4000,
                position: 'bottom-center',
                style: {
                    background: '#f87171',
                    color: 'white',
                    fontSize: '14px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                },
                icon: '🔒'
            });
            return;
        }

        // Verificar carrito vacío
        if (isEmpty) {
            toast.error('Tu carrito está vacío', {
                duration: 3000,
                position: 'bottom-center'
            });
            return;
        }

        // Verificar que hay cartId
        if (!cartId) {
            toast.error('Error: No se encontró el carrito. Intenta refrescar la página.', {
                duration: 4000,
                position: 'bottom-center'
            });
            console.error('CartId missing:', cartId);
            return;
        }

        // Verificar que hay productos
        if (!cartItems || cartItems.length === 0) {
            toast.error('No hay productos en el carrito', {
                duration: 3000,
                position: 'bottom-center'
            });
            return;
        }

        // Todo está bien, navegar al checkout
        console.log('Navigating to checkout with cartId:', cartId);
        console.log('Cart items:', cartItems);

        navigate('/checkout');
        console.log('Navigate called');
    };

    // Función para incrementar la cantidad
    const incrementQuantity = (id) => {
        const currentItem = cartItems.find(item => item.id === id);
        if (currentItem) {
            if (currentItem.stock && currentItem.quantity >= currentItem.stock) {
                toast.error(`Solo hay ${currentItem.stock} unidades disponibles`);
                return;
            }
            updateQuantity(id, currentItem.quantity + 1);
        }
    };

    // Función para decrementar la cantidad
    const decrementQuantity = (id) => {
        const currentItem = cartItems.find(item => item.id === id);
        if (currentItem && currentItem.quantity > 1) {
            updateQuantity(id, currentItem.quantity - 1);
        }
    };

    // Función para eliminar un item
    const removeItem = (id) => {
        removeFromCart(id);
    };

    // Función para vaciar el carrito
    const handleClearCart = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            clearCart();
        }
    };

    // Mostrar loading
    if (loading) {
        return (
            <div className="page-container">
                <div className="shopping-cart-container">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold title-color mb-6">Mi carrito</h1>
                        <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                                <div className="text-lg text-gray-600">Cargando carrito...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <div className="page-container">
                <div className="shopping-cart-container">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold title-color mb-6">Mi carrito</h1>
                        <div className="flex flex-col justify-center items-center h-64">
                            <div className="text-6xl mb-4">⚠️</div>
                            <div className="text-lg text-red-600 mb-4">{error}</div>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Recargar página
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="shopping-cart-container">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold title-color">Mi carrito</h1>
                        {totalItems > 0 && (
                            <div className="text-sm text-gray-600">
                                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                            </div>
                        )}
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna de productos */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                {/* Carrito vacío */}
                                {isEmpty && (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🛒</div>
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">Tu carrito está vacío</h3>
                                        <p className="text-gray-500 mb-6">Explora nuestros productos y agrega algunos a tu carrito</p>
                                        <Link to="/Products">
                                            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                                                Explorar productos
                                            </button>
                                        </Link>
                                    </div>
                                )}

                                {/* Mapeo de los productos en el carrito */}
                                {cartItems && cartItems.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="cart-item">
                                        <div className="flex flex-col md:flex-row items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                                            <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden mr-4 mb-4 md:mb-0">
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        const parent = e.target.parentElement;
                                                        parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">Sin imagen</div>';
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row justify-between mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-medium product-title-color mb-1">{item.name}</h3>
                                                        <div className="flex items-center">
                                                            <span className="font-bold price-color">${item.price}</span>
                                                        </div>
                                                        {item.stock && (
                                                            <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3 md:mt-0">
                                                        <div className="quantity-selector flex items-center bg-white border border-gray-300 rounded-full overflow-hidden mr-4">
                                                            <button
                                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                                onClick={() => decrementQuantity(item.id)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                −
                                                            </button>
                                                            <span className="px-3 py-1">{item.quantity}</span>
                                                            <button
                                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                                onClick={() => incrementQuantity(item.id)}
                                                                disabled={item.stock && item.quantity >= item.stock}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <div className="text-right">
                                                            <span className="font-medium">Subtotal: </span>
                                                            <span className="font-bold price-color">
                                                                ${(item.subtotal || (item.price * item.quantity)).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="ml-4 delete-icon-color hover:text-red-500 transition-colors"
                                                            onClick={() => removeItem(item.id)}
                                                            title="Eliminar producto"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Botones de acción */}
                                {!isEmpty && (
                                    <div className="flex justify-between mt-6">
                                        <button
                                            className="flex items-center px-6 py-2 border outline-button-border outline-button-text rounded-full hover:outline-button-hover transition-colors"
                                            onClick={handleClearCart}
                                        >
                                            <FaTrashAlt className="mr-2" />
                                            Vaciar carrito
                                        </button>
                                        <Link to="/Products">
                                            <button className="flex items-center px-6 py-2 border outline-button-border outline-button-text rounded-full hover:outline-button-hover transition-colors">
                                                Volver a la tienda
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna de resumen */}
                        <div className="lg:col-span-1">
                            {!isEmpty && (
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h2 className="text-lg font-medium title-color mb-4">Resumen del pedido</h2>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                                        <span className="font-bold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span>Gastos de envío</span>
                                        <span className="font-bold">
                                            {subtotal >= 70 ? (
                                                <span className="text-green-600">GRATIS</span>
                                            ) : (
                                                `$${shippingCost.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    {subtotal > 0 && subtotal < 70 && (
                                        <div className="text-xs text-gray-500 py-2">
                                            Agrega ${(70 - subtotal).toFixed(2)} más para envío gratis
                                        </div>
                                    )}
                                    <div className="flex justify-between py-4 mt-2">
                                        <span className="text-lg font-medium">Total</span>
                                        <span className="text-lg font-bold price-color">
                                            ${totalAmount.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* BOTÓN DE CHECKOUT*/}
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-3 primary-button-bg primary-button-text rounded-md hover:primary-button-hover mt-4 tramitarcompra transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isEmpty || !cartId}
                                    >
                                        Tramitar compra
                                    </button>

                                    {/* Mensajes de estado */}
                                    {!isAuthenticated && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                            <p className="text-sm text-yellow-700">
                                                <Link to="/login" className="font-medium underline">Inicia sesión</Link> para continuar con la compra
                                            </p>
                                        </div>
                                    )}

                                    {isAuthenticated && !cartId && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                                            <p className="text-sm text-red-700">
                                                Error: No se encontró el carrito. Intenta refrescar la página.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center">
                                    <FaTruck className="icon-color mr-3" />
                                    <div>
                                        <h3 className="font-medium">Entrega estimada</h3>
                                        <p className="text-gray-600">
                                            {subtotal >= 70 ? 'Mañana (Envío gratis)' : 'Mañana'}
                                        </p>
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
                                <h3 className="font-medium">Envío gratis a partir de $70</h3>
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
import React from "react";
import "./Favorites.css";
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard";
import useFavorites from "../hooks/useFavorites"; 
import { useAuth } from "../context/AuthContext";

const Favorites = () => {
    const navigate = useNavigate();
    
    // Usar el contexto de autenticación
    const { auth, user } = useAuth();
    const { isAuthenticated } = auth;
    
    const clientId = user?.id || null;
    
    const {
        favoriteProducts,
        loading,
        error,
        toggleFavorite,
        isEmpty,
        count
    } = useFavorites(isAuthenticated ? clientId : null);


    // Function to handle card clicks
    const handleProductClick = (productId) => {
        console.log('Favorites - Product clicked:', productId);
        navigate(`/product/${productId}`);
    };

    const handleAddClick = (id) => {
        console.log(`Favorites - Añadir producto ${id} al carrito`);
        // Aquí puedes implementar la lógica para añadir al carrito
    };

    const handleToggleFavorite = (id) => {
        console.log('Favorites - Toggle favorite for ID:', id);
        if (!id) {
            console.error('Favorites - ERROR: No ID provided to toggleFavorite');
            return;
        }
        toggleFavorite(id);
    };

    // Si el usuario no está autenticado, mostrar pantalla de login
    if (!isAuthenticated) {
        return (
            <div className="page-container">
                <div className="favorites-container">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold text-485935-800 mb-6">Favoritos</h1>
                        <div className="flex flex-col justify-center items-center h-64">
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">💚</div>
                                <div className="text-lg text-gray-600 mb-2">
                                    Debes iniciar sesión para ver tus favoritos
                                </div>
                                <div className="text-sm text-gray-500">
                                    Guarda tus productos favoritos y accede a ellos desde cualquier dispositivo
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                                >
                                    Iniciar Sesión
                                </button>
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded hover:bg-green-50 transition-colors"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar loading solo si está autenticado
    if (loading) {
        return (
            <div className="page-container">
                <div className="favorites-container">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold text-485935-800 mb-6">Favoritos</h1>
                        <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                                <div className="text-lg text-gray-600">Cargando favoritos...</div>
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
                <div className="favorites-container">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold text-485935-800 mb-6">Favoritos</h1>
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

    // Mostrar mensaje cuando no hay favoritos (usuario autenticado)
    if (isEmpty) {
        return (
            <div className="page-container">
                <div className="favorites-container">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold text-485935-800 mb-6">Favoritos</h1>
                        <div className="flex flex-col justify-center items-center h-64">
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">💚</div>
                                <div className="text-lg text-gray-600 mb-2">
                                    No tienes productos favoritos aún
                                </div>
                                <div className="text-sm text-gray-500">
                                    Explora nuestros productos y marca tus favoritos haciendo clic en el corazón
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/products')}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Explorar productos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar favoritos del usuario autenticado
    return (
        <div className="page-container">
            <div className="favorites-container">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-485935-800">
                            Favoritos ({count})
                        </h1>
                        {user?.name && (
                            <div className="text-sm text-gray-600">
                                Favoritos de {user.name}
                            </div>
                        )}
                    </div>
                    
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {favoriteProducts.map((product) => {
                            // DEBUG: Log cada producto
                            console.log('Favorites - Rendering product:', {
                                id: product.id,
                                name: product.name,
                                fullProduct: product
                            });

                            return (
                                <ProductCard 
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: `${product.price}€`,
                                        rating: product.rating || 3,
                                        img: product.imgProduct,
                                        isFavorite: true, // Siempre true en la página de favoritos
                                        stock: product.stock,
                                        description: product.description
                                    }}
                                    onProductClick={handleProductClick}
                                    onToggleFavorite={handleToggleFavorite}
                                    onAddClick={handleAddClick}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
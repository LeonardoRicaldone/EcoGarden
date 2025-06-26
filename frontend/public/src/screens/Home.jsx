import React, { useRef, useState, useEffect } from "react";
import "./Home.css";
import { FaStar, FaRegStar } from 'react-icons/fa';
import { MdLocalShipping, MdCardGiftcard, MdVerified, MdAttachMoney } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard/ProductCard"; 
import useProducts from "../components/Products/hooks/useProducts";
import useSales from "../hooks/useSales";

const Home = () => {
    // Hook para manejar la navegación entre páginas
    const navigate = useNavigate();
    // Referencia para desplazamiento suave a la sección de productos más vendidos
    const topSalesRef = useRef(null); 
    
    // Hooks para obtener datos
    const { allProducts, toggleFavorite, handleAddToCart, loading: productsLoading } = useProducts();
    const { getSales } = useSales();
    
    // Estados locales
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loadingTopSelling, setLoadingTopSelling] = useState(true);
    
    // Función para redirigir a la página de detalle del producto
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`); 
    };

    // Función para desplazamiento suave a la sección de productos más vendidos
    const scrollToTopSales = () => {
        topSalesRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Función para calcular productos más vendidos
    const calculateTopSellingProducts = async () => {
        try {
            setLoadingTopSelling(true);
            console.log('Calculating top selling products...');
            
            // Obtener todas las ventas
            const salesResult = await getSales();
            
            if (!salesResult.success || !salesResult.sales) {
                console.log('No sales data available');
                setTopSellingProducts([]);
                return;
            }

            const sales = salesResult.sales;
            console.log('Sales result:', sales);
            console.log('Sales type:', typeof sales);
            console.log('Is sales array?:', Array.isArray(sales));

            // Verificar que sales sea un array
            if (!Array.isArray(sales)) {
                console.error('Sales is not an array:', sales);
                setTopSellingProducts([]);
                return;
            }

            console.log('Total sales found:', sales.length);

            // Si no hay ventas, mostrar array vacío
            if (sales.length === 0) {
                console.log('No sales found');
                setTopSellingProducts([]);
                return;
            }

            // Contar productos vendidos
            const productSalesCount = {};

            sales.forEach(sale => {
                console.log('Processing sale:', sale._id);
                console.log('Sale structure:', {
                    hasCart: !!sale.idShoppingCart,
                    cartProducts: sale.idShoppingCart?.products?.length || 0
                });
                
                if (sale.idShoppingCart && sale.idShoppingCart.products && Array.isArray(sale.idShoppingCart.products)) {
                    console.log('Products in cart:', sale.idShoppingCart.products.length);
                    
                    sale.idShoppingCart.products.forEach(item => {
                        console.log('Processing cart item:', {
                            hasProduct: !!item.idProduct,
                            productId: item.idProduct?._id || item.idProduct,
                            quantity: item.quantity
                        });
                        
                        const productId = item.idProduct?._id || item.idProduct;
                        if (productId) {
                            const id = productId.toString();
                            const quantity = item.quantity || 1;
                            productSalesCount[id] = (productSalesCount[id] || 0) + quantity;
                            console.log(`Product ${id}: +${quantity} = ${productSalesCount[id]}`);
                        } else {
                            console.log('No product ID found in item:', item);
                        }
                    });
                } else {
                    console.log('Sale has no cart or products:', {
                        saleId: sale._id,
                        hasCart: !!sale.idShoppingCart,
                        hasProducts: !!sale.idShoppingCart?.products,
                        isArray: Array.isArray(sale.idShoppingCart?.products)
                    });
                }
            });

            console.log('Product sales count:', productSalesCount);

            // Verificar si hay productos vendidos
            if (Object.keys(productSalesCount).length === 0) {
                console.log('No products sold yet');
                setTopSellingProducts([]);
                return;
            }

            // Obtener los productos más vendidos (top 4)
            const sortedProducts = Object.entries(productSalesCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 4);

            console.log('Top selling product IDs:', sortedProducts);

            // Mapear con información completa del producto
            const topProducts = [];
            
            for (const [productId, salesCount] of sortedProducts) {
                const product = allProducts.find(p => 
                    (p.id && p.id.toString() === productId) || 
                    (p._id && p._id.toString() === productId)
                );
                
                if (product) {
                    topProducts.push({
                        ...product,
                        salesCount,
                        id: product.id || product._id
                    });
                    console.log(`Added top product: ${product.name} (${salesCount} sales)`);
                } else {
                    console.log(`Product not found for ID: ${productId}`);
                }
            }

            console.log('Top selling products with details:', topProducts.length);
            setTopSellingProducts(topProducts);

        } catch (error) {
            console.error('Error calculating top selling products:', error);
            setTopSellingProducts([]); // Set empty array on error
        } finally {
            setLoadingTopSelling(false);
        }
    };

    // Función para obtener productos populares (mejor rating)
    const getPopularProducts = () => {
        if (allProducts.length === 0) return;

        const popularItems = allProducts
            .filter(product => product.rating >= 4 && product.stock > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);

        console.log('Popular products:', popularItems.length);
        setPopularProducts(popularItems);
    };

    // Efectos
    useEffect(() => {
        if (allProducts.length > 0) {
            calculateTopSellingProducts();
            getPopularProducts();
        }
    }, [allProducts]);

    // Función para manejar la adición de productos al carrito
    const handleAddClick = async (productId) => {
        console.log(`Añadir producto ${productId} al carrito`);
        await handleAddToCart(productId, 1);
    };

    // Función para alternar favoritos
    const handleToggleFavorite = async (productId) => {
        console.log(`Toggle favorito para producto ${productId}`);
        await toggleFavorite(productId);
    };

    return (
        <div className="page-container">
            {/* Sección Hero con imagen de fondo y llamada a la acción */}
            <div className="hero-section">
                {/* Imagen de fondo */}
                <img 
                    src="https://cdn.pixabay.com/photo/2021/05/03/13/32/greenhouse-6226263_1280.jpg" 
                    alt="Planta en crecimiento" 
                    className="hero-image"
                />
                
                {/* Capa oscura para mejorar legibilidad del texto */}
                <div className="overlay"></div>
                
                {/* Contenido superpuesto sobre la imagen */}
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            EcoGarden – Jardinería Sostenible para un Mundo Más Verde
                        </h1>
                        <p className="hero-description">
                            Cultiva tu espacio verde con productos ecológicos y sostenibles. ¡Todo lo que necesitas para un jardín vibrante y saludable!
                        </p>
                        {/* Botón con función de desplazamiento suave hacia productos más vendidos */}
                        <button className="hero-button" onClick={scrollToTopSales}>
                            <b>Ver más</b>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <br />
            <br />

            {/* Sección de beneficios/características destacadas */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-2 cambioColor3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span><b>EcoGarden te da más:</b></span>
                </div>

                {/* Grid de beneficios con íconos */}
                <div className="rounded-lg py-4 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 cambioColor">
                    {/* Beneficio 1: Entrega rápida */}
                    <div className="flex flex-col items-center text-center">
                        <MdLocalShipping className="text-4xl mb-2 cambioColor2"/>
                        <h3 className="cambioColor3 font-medium">Entrega rápida</h3>
                    </div>
                    {/* Beneficio 2: Envío gratis */}
                    <div className="flex flex-col items-center text-center">
                        <MdCardGiftcard className="text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Envío gratis a partir de un gasto de 70 dólares</h3>
                    </div>
                    {/* Beneficio 3: Mejor calidad */}
                    <div className="flex flex-col items-center text-center">
                        <MdVerified className="text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Mejor calidad</h3>
                    </div>
                    {/* Beneficio 4: Precios justos */}
                    <div className="flex flex-col items-center text-center">
                        <MdAttachMoney className="text-4xl mb-2 cambioColor2" />
                        <h3 className="cambioColor3 font-medium">Precios justos</h3>
                    </div>
                </div>
            </div>

            {/* Sección de productos más vendidos */}
            <div ref={topSalesRef} className="container mx-auto px-4 py-8" id="mas-vendidos">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Los más vendidos</h2>
                    <div className="text-sm text-gray-600">
                        {loadingTopSelling ? (
                            <span>Calculando...</span>
                        ) : (
                            <span>{topSellingProducts.length} productos destacados</span>
                        )}
                    </div>
                </div>
                
                {loadingTopSelling || productsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Skeleton loading */}
                        {[1,2,3,4].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : topSellingProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Mapeo de productos más vendidos */}
                        {topSellingProducts.map((product) => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onProductClick={() => handleProductClick(product.id)}
                                onToggleFavorite={() => handleToggleFavorite(product.id)}
                                onAddClick={() => handleAddClick(product.id)}
                                showBadge={true}
                                badgeText={`${product.salesCount} vendidos`}
                                badgeColor="bg-red-500"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🛒</div>
                        <h3 className="text-xl text-gray-600 mb-2">Aún no hay ventas registradas</h3>
                        <p className="text-gray-500">Los productos más vendidos aparecerán aquí cuando se registren ventas.</p>
                    </div>
                )}
            </div>

            {/* Sección de productos populares (mejor rating) */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lo más popular</h2>
                    <div className="text-sm text-gray-600">
                        <span>Productos mejor valorados</span>
                    </div>
                </div>
                
                {productsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Skeleton loading */}
                        {[1,2,3,4].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : popularProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Mapeo de productos populares */}
                        {popularProducts.map((product) => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onProductClick={() => handleProductClick(product.id)}
                                onToggleFavorite={() => handleToggleFavorite(product.id)}
                                onAddClick={() => handleAddClick(product.id)}
                                showBadge={true}
                                badgeText={`${product.rating}/5`}
                                badgeColor="bg-yellow-500"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">⭐</div>
                        <h3 className="text-xl text-gray-600 mb-2">Aún no hay productos populares</h3>
                        <p className="text-gray-500">Los productos con mejores ratings aparecerán aquí.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
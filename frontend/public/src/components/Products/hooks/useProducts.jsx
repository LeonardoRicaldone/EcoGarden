import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/useFavorites";
import useShoppingCart from "../../../hooks/useShoppingCart"; // Importar el hook del carrito

const useProducts = () => {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [priceRange, setPriceRange] = useState(100);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Obtener información de autenticación
  const { auth, user } = useAuth();
  const { isAuthenticated } = auth;
  const clientId = user?.id || null;
  
  console.log('useProducts - isAuthenticated:', isAuthenticated, 'clientId:', clientId);
  
  // Hook de favoritos
  const { favoriteIds, toggleFavorite: toggleFavoriteHook, isFavorite } = useFavorites(isAuthenticated ? clientId : null);
  
  // Hook del carrito
  const { addToCart, isInCart, getProductQuantity } = useShoppingCart(isAuthenticated ? clientId : null);
  
  // URLs de tu API
  const PRODUCTS_API = "http://localhost:4000/api/products";
  const CATEGORIES_API = "http://localhost:4000/api/categories";
  const FAVORITES_API = "http://localhost:4000/api/favorites";
  const CART_API = "http://localhost:4000/api/shoppingCart";

  // Función utilitaria para normalizar IDs (ObjectId a string)
  const normalizeId = (id) => {
    if (!id) return null;
    // Si es un objeto con _id (ObjectId), extraer el string
    if (typeof id === 'object' && id._id) return id._id.toString();
    // Si ya es string, devolverlo
    return id.toString();
  };



  // Función utilitaria para comparar IDs de manera segura
  const compareIds = (id1, id2) => {
    const normalizedId1 = normalizeId(id1);
    const normalizedId2 = normalizeId(id2);
    return normalizedId1 === normalizedId2;
  };
  // Obtener token de autenticación (si lo tienes)
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  // Headers con autenticación
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  };

  // Fetch categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORIES_API);
      if (!response.ok) throw new Error('Error al obtener categorías');
      
      const data = await response.json();
      console.log('Categorías obtenidas:', data); // Debug
      
      // Normalizar IDs de categorías
      const normalizedCategories = data.map(category => ({
        ...category,
        id: normalizeId(category._id || category.id),
        _id: normalizeId(category._id || category.id)
      }));
      
      // Agregar categoría "Todos" al inicio
      const categoriesWithAll = [
        { _id: 'all', id: 'all', name: 'Todas las plantas' },
        ...normalizedCategories
      ];
      
      setCategories(categoriesWithAll);
    } catch (error) {
      console.error("Error al obtener categorías", error);
      toast.error("Error al cargar categorías");
      setError("Error al cargar categorías");
    }
  };

  // Fetch productos desde la API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(PRODUCTS_API);
      
      if (!response.ok) throw new Error('Error al obtener productos');
      
      const data = await response.json();
      console.log('Raw products from API:', data.length);
      
      // Transformar datos
      const transformedProducts = data.map(product => {
  const categoryId = normalizeId(product.idCategory || product.categoryId);

  return {
    ...product,
    id: product._id ? product._id.toString() : product.id,
    isFavorite: false,
    rating: Math.floor(Math.random() * 5) + 1,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    description: product.descripcion || '',
    categoryId: categoryId,
    idCategory: categoryId,
  };
});

     
      
      console.log('Transformed products:', transformedProducts.length);
      setProducts(transformedProducts);
      setError(null);
    } catch (error) {
      console.error("Error al obtener productos", error);
      setError("Error al cargar productos");
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchProducts()]);
    };
    loadData();
  }, []);

  // Actualizar estado de favoritos en productos
  useEffect(() => {
    console.log('Updating products with favoriteIds:', Array.from(favoriteIds || []));
    
    if (favoriteIds && favoriteIds.size > 0) {
      setProducts(prevProducts => {
        const updatedProducts = prevProducts.map(product => ({
          ...product,
          isFavorite: favoriteIds.has(product.id)
        }));
        console.log('Products updated with favorites:', updatedProducts.filter(p => p.isFavorite).length);
        return updatedProducts;
      });
    } else {
      // Si no hay favoritos, marcar todos como no favoritos
      setProducts(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          isFavorite: false
        }))
      );
    }
  }, [favoriteIds]);

  // Función para alternar favorito
  const toggleFavorite = async (id) => {
    console.log('toggleFavorite called with id:', id, 'isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para guardar favoritos", {
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
        icon: '💚'
      });
      return;
    }

    if (!toggleFavoriteHook) {
      console.error('toggleFavoriteHook is not available');
      toast.error("Error: Función de favoritos no disponible");
      return;
    }

    // Usar el hook de favoritos
    const success = await toggleFavoriteHook(id);
    console.log('toggleFavoriteHook result:', success);
  };

  // NUEVA: Función para añadir al carrito usando el hook
  const handleAddToCart = async (id, quantity = 1) => {
    console.log('handleAddToCart called with:', { id, quantity });
    
    try {
      const normalizedProductId = normalizeId(id);
      console.log('Adding to cart, product ID:', normalizedProductId); // Debug
      
      const product = products.find(p => compareIds(p.id, normalizedProductId));
      
      if (!product) {
        toast.error("Producto no encontrado");
        return;
      }

      if (product.stock <= 0) {
        toast.error("Producto sin stock");
        return;
      }

      if (quantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }

      // Usar el hook del carrito
      const success = await addToCart(id, quantity);
      
      if (success) {
        console.log(`Producto ${product.name} agregado al carrito exitosamente`);
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast.error("Error al añadir al carrito");
    }
  };

  // Función para manejar cambio de rango de precio
  const handlePriceRangeChange = (value) => {
    setPriceRange(parseInt(value));
  };

  // Función para manejar cambio de categorías - CORREGIDA
  const handleCategoryChange = (categoryId) => {
    const normalizedCategoryId = normalizeId(categoryId);
    console.log('Category change:', normalizedCategoryId, 'Current selected:', selectedCategories); // Debug
    
    if (normalizedCategoryId === 'all') {
      // Si selecciona "Todas las plantas", limpiar categorías seleccionadas
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories(prev => {
      const isSelected = prev.some(id => compareIds(id, normalizedCategoryId));
      
      if (isSelected) {
        // Si ya está seleccionada, quitarla
        return prev.filter(id => !compareIds(id, normalizedCategoryId));
      } else {
        // Si no está seleccionada, agregarla
        return [...prev, normalizedCategoryId];
      }
    });
  };

  // Función para manejar búsqueda por texto
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setPriceRange(100);
    setSelectedCategories([]);
    setSearchTerm("");
  };

  // Encontrar el precio máximo para el slider
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100;
    const prices = products.map(p => p.price).filter(price => !isNaN(price));
    return prices.length > 0 ? Math.max(...prices) : 100;
  }, [products]);

  // Productos filtrados usando useMemo para optimización - CORREGIDO
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...', {
      totalProducts: products.length,
      searchTerm,
      selectedCategories,
      priceRange
    }); // Debug
    
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
      console.log('After search filter:', filtered.length); // Debug
    }

    // Filtrar por precio
    filtered = filtered.filter(product => product.price <= priceRange);
    console.log('After price filter:', filtered.length); // Debug

    // Filtrar por categorías - LÓGICA CORREGIDA PARA OBJECTID
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        const productCategoryId = product.categoryId || product.idCategory;
        if (!productCategoryId) {
          console.log('Producto sin categoryId:', product.name, product); // Debug
          return false;
        }
        
        const hasMatchingCategory = selectedCategories.some(
          catId => compareIds(catId, productCategoryId)
        );
        
        if (!hasMatchingCategory) {
          console.log('Producto filtrado por categoría:', product.name, 'categoryId:', productCategoryId, 'selectedCategories:', selectedCategories); // Debug
        }
        
        return hasMatchingCategory;
      });
      console.log('After category filter:', filtered.length); // Debug
    }

    // Filtrar productos con stock disponible
    filtered = filtered.filter(product => product.stock > 0);
    console.log('After stock filter:', filtered.length); // Debug

    return filtered;
  }, [products, priceRange, selectedCategories, searchTerm]);

  // Información de resultados
  const resultsInfo = useMemo(() => {
    const total = filteredProducts.length;
    const hasFilters = priceRange < maxPrice || selectedCategories.length > 0 || searchTerm.trim();
    
    return {
      total,
      hasFilters,
      message: hasFilters 
        ? `${total} resultados encontrados` 
        : `${total} productos disponibles`
    };
  }, [filteredProducts, priceRange, maxPrice, selectedCategories, searchTerm]);

  // Función para obtener nombre de categoría por ID - CORREGIDA PARA OBJECTID
  const getCategoryName = (categoryId) => {
    if (!categoryId) {
      console.log('getCategoryName: categoryId es null/undefined'); // Debug
      return 'Sin categoría';
    }
    
    const normalizedCategoryId = normalizeId(categoryId);
    console.log('getCategoryName: buscando categoría con ID:', normalizedCategoryId); // Debug
    console.log('getCategoryName: categorías disponibles:', categories.map(c => ({ id: c.id, name: c.name }))); // Debug
    
    const category = categories.find(cat => 
      compareIds(cat._id, normalizedCategoryId) || compareIds(cat.id, normalizedCategoryId)
    );
    
    const result = category ? category.name : 'Sin categoría';
    console.log('getCategoryName: resultado:', result); // Debug
    
    return result;
  };

  // Función para verificar si una categoría está seleccionada - CORREGIDA
  const isCategory = (categoryId) => {
    if (categoryId === 'all') {
      return selectedCategories.length === 0;
    }
    const normalizedCategoryId = normalizeId(categoryId);
    return selectedCategories.some(catId => compareIds(catId, normalizedCategoryId));
  };

  return {
    // Estados
    products: filteredProducts,
    allProducts: products,
    categories,
    loading,
    error,
    
    // Filtros
    priceRange,
    selectedCategories,
    searchTerm,
    maxPrice,
    
    // Funciones de filtros
    handlePriceRangeChange,
    handleCategoryChange,
    handleSearchChange,
    clearFilters,
    
    // Funciones de productos
    toggleFavorite,
    handleAddToCart, // ACTUALIZADA para usar el carrito
    fetchProducts,
    fetchCategories,
    
    // Información
    resultsInfo,
    
    // Utilidades
    isCategory,
    isEmpty: filteredProducts.length === 0,
    getCategoryName,
    isFavorite,
    
    // NUEVAS funciones del carrito
    isInCart,
    getProductQuantity,
    
    // Estados de carga
    isLoading: loading,
    hasError: !!error,
    
    // Estado de autenticación
    isAuthenticated,
    user,
    
    // Debug
    favoriteIds
  };
};

export default useProducts;
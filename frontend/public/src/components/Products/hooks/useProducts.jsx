import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

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
      console.log('Productos obtenidos:', data); // Debug
      
      // Obtener favoritos del usuario
      let favorites = [];
      try {
        const favoritesResponse = await fetch(FAVORITES_API, {
          headers: getAuthHeaders()
        });
        if (favoritesResponse.ok) {
          favorites = await favoritesResponse.json();
        }
      } catch (favError) {
        console.log('No se pudieron cargar favoritos:', favError);
      }
      
      const favoriteIds = favorites.map(fav => normalizeId(fav.productId || fav._id || fav.id));
      
      // Transformar datos para incluir isFavorite y rating
      const transformedProducts = data.map(product => {
        const productId = normalizeId(product._id || product.id);
        const categoryId = normalizeId(product.idCategory || product.categoryId || product.category);
        
        return {
          ...product,
          // Usar _id normalizado como id principal
          id: productId,
          _id: productId,
          isFavorite: favoriteIds.includes(productId),
          rating: product.rating || Math.floor(Math.random() * 5) + 1,
          // Asegurar que el precio sea numérico
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          // Normalizar categoryId
          categoryId: categoryId,
          idCategory: categoryId
        };
      });
      
      console.log('Productos transformados:', transformedProducts); // Debug para ver los categoryId
      
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

  // Función para alternar favorito - CORREGIDA
  const toggleFavorite = async (productId) => {
    try {
      const normalizedProductId = normalizeId(productId);
      console.log('Toggling favorite for product:', normalizedProductId); // Debug
      
      const product = products.find(p => compareIds(p.id, normalizedProductId));
      if (!product) {
        toast.error("Producto no encontrado");
        return;
      }

      // Optimistic UI update
      setProducts(prevProducts => 
        prevProducts.map(p => 
          compareIds(p.id, normalizedProductId)
            ? { ...p, isFavorite: !p.isFavorite } 
            : p
        )
      );

      const method = product.isFavorite ? "DELETE" : "POST";
      const url = method === "DELETE" 
        ? `${FAVORITES_API}/${normalizedProductId}` 
        : FAVORITES_API;
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        ...(method === "POST" && {
          body: JSON.stringify({ productId: normalizedProductId })
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      toast.success(
        product.isFavorite 
          ? "Removido de favoritos" 
          : "Agregado a favoritos"
      );
      
    } catch (error) {
      console.error("Error al actualizar favorito", error);
      // Revertir cambio en caso de error
      const normalizedProductId = normalizeId(productId);
      setProducts(prevProducts => 
        prevProducts.map(p => 
          compareIds(p.id, normalizedProductId)
            ? { ...p, isFavorite: !p.isFavorite } 
            : p
        )
      );
      toast.error("Error al actualizar favorito");
    }
  };

  // Función para añadir al carrito - CORREGIDA
  const handleAddToCart = async (productId) => {
    try {
      const normalizedProductId = normalizeId(productId);
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

      const response = await fetch(CART_API, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          idClient: userId, // Asegúrate de tener el ID del cliente autenticado
          products: [
            {
              idProduct: normalizedProductId,
              quantity: 1,
              subtotal: product.price * 1
            }
          ],
          total: product.price * 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Cart response:', result); // Debug
      
      toast.success(`${product.name} añadido al carrito`);
      
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast.error(error.message || "Error al añadir al carrito");
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
    handleAddToCart,
    fetchProducts,
    fetchCategories,
    
    // Información
    resultsInfo,
    
    // Utilidades
    isCategory,
    isEmpty: filteredProducts.length === 0,
    getCategoryName,
    
    // Estados de carga
    isLoading: loading,
    hasError: !!error,
    
    // Funciones utilitarias expuestas (por si las necesitas en otros componentes)
    normalizeId,
    compareIds
  };
};

export default useProducts;
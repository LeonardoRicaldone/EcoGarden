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

  // Fetch categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORIES_API);
      if (!response.ok) throw new Error('Error al obtener categorías');
      
      const data = await response.json();
      
      // Agregar categoría "Todos" al inicio
      const categoriesWithAll = [
        { id: 'all', name: 'Todas las plantas' },
        ...data
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
      
      // Transformar datos para incluir isFavorite y rating
      const transformedProducts = data.map(product => ({
        ...product,
        isFavorite: false, // Inicialmente ninguno es favorito
        rating: Math.floor(Math.random() * 5) + 1, // Rating aleatorio (puedes quitarlo si tienes rating en BD)
        // Asegurar que el precio sea numérico
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
      }));
      
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

  // Función para alternar favorito
  const toggleFavorite = async (id) => {
    try {
      // Actualizar estado local inmediatamente
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id 
            ? { ...product, isFavorite: !product.isFavorite } 
            : product
        )
      );

      // Si tienes un endpoint para favoritos, descomenta y ajusta esto:
      /*
      const product = products.find(p => p.id === id);
      if (product) {
        await fetch(`${PRODUCTS_API}/${id}/favorite`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFavorite: !product.isFavorite }),
        });
      }
      */
      
      toast.success("Favorito actualizado");
    } catch (error) {
      console.error("Error al actualizar favorito", error);
      // Revertir cambio en caso de error
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id 
            ? { ...product, isFavorite: !product.isFavorite } 
            : product
        )
      );
      toast.error("Error al actualizar favorito");
    }
  };

  // Función para añadir al carrito
  const handleAddToCart = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      
      if (!product) {
        toast.error("Producto no encontrado");
        return;
      }

      if (product.stock <= 0) {
        toast.error("Producto sin stock");
        return;
      }

      // Aquí puedes implementar la lógica para añadir al carrito
      // Ejemplo de llamada a API de carrito:
      /*
      await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: id, 
          quantity: 1 
        }),
      });
      */
      
      console.log(`Añadir producto ${id} al carrito`, product);
      toast.success(`${product.name} añadido al carrito`);
    } catch (error) {
      console.error("Error al añadir al carrito", error);
      toast.error("Error al añadir al carrito");
    }
  };

  // Función para manejar cambio de rango de precio
  const handlePriceRangeChange = (value) => {
    setPriceRange(parseInt(value));
  };

  // Función para manejar cambio de categorías
  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId);
      if (isSelected) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
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
    return Math.max(...products.map(p => p.price));
  }, [products]);

  // Productos filtrados usando useMemo para optimización
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    // Filtrar por precio
    filtered = filtered.filter(product => product.price <= priceRange);

    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.idCategory) ||
        selectedCategories.includes(product.idCategory?.toString())
      );
    }

    // Filtrar productos con stock disponible
    filtered = filtered.filter(product => product.stock > 0);

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

  // Función para obtener nombre de categoría por ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId || cat.id === categoryId?.toString());
    return category ? category.name : 'Sin categoría';
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
    isCategory: (categoryId) => selectedCategories.includes(categoryId) || selectedCategories.includes(categoryId?.toString()),
    isEmpty: filteredProducts.length === 0,
    getCategoryName,
    
    // Estados de carga
    isLoading: loading,
    hasError: !!error,
  };
};

export default useProducts;
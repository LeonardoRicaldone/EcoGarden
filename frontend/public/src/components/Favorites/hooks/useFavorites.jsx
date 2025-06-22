import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const useFavorites = (clientId) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // URLs de tu API
  const FAVORITES_API = "http://localhost:4000/api/favorites";
  const PRODUCTS_API = "http://localhost:4000/api/products";

  // Obtener favoritos del cliente
  const fetchFavorites = async () => {
    // Si no hay clientId, no hacer nada
    if (!clientId) {
      setLoading(false);
      setFavoriteProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${FAVORITES_API}/${clientId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No hay favoritos para este usuario
          setFavoriteProducts([]);
          return;
        }
        throw new Error('Error al obtener favoritos');
      }
      
      const favoritesData = await response.json();
      
      // Si no hay favoritos, establecer array vacío
      if (!favoritesData || favoritesData.length === 0) {
        setFavoriteProducts([]);
        return;
      }
      
      // Obtener detalles completos de cada producto favorito
      const productsPromises = favoritesData.map(async (favorite) => {
        try {
          const productResponse = await fetch(`${PRODUCTS_API}/${favorite.idProduct}`);
          if (!productResponse.ok) {
            console.warn(`No se pudo obtener el producto ${favorite.idProduct}`);
            return null;
          }
          const productData = await productResponse.json();
          
          return {
            ...productData,
            isFavorite: true,
            favoriteId: favorite.id // ID de la relación favorito para eliminar
          };
        } catch (productError) {
          console.warn(`Error al obtener producto ${favorite.idProduct}:`, productError);
          return null;
        }
      });

      const products = await Promise.all(productsPromises);
      // Filtrar productos nulos (que no se pudieron obtener)
      const validProducts = products.filter(product => product !== null);
      
      setFavoriteProducts(validProducts);
      setError(null);
    } catch (error) {
      console.error("Error al obtener favoritos", error);
      setError("Error al cargar favoritos");
      setFavoriteProducts([]);
      toast.error("Error al cargar favoritos");
    } finally {
      setLoading(false);
    }
  };

  // Añadir producto a favoritos
  const addToFavorites = async (productId) => {
    if (!clientId) {
      toast.error("Debes iniciar sesión para añadir favoritos");
      return;
    }

    try {
      const response = await fetch(FAVORITES_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idProduct: productId,
          idClient: clientId,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Este producto ya está en tus favoritos");
          return;
        }
        throw new Error('Error al añadir a favoritos');
      }

      const newFavorite = await response.json();
      
      // Obtener detalles del producto para actualizar el estado local
      const productResponse = await fetch(`${PRODUCTS_API}/${productId}`);
      if (productResponse.ok) {
        const productData = await productResponse.json();
        setFavoriteProducts(prev => [...prev, {
          ...productData,
          isFavorite: true,
          favoriteId: newFavorite.id
        }]);
      }

      toast.success("Producto añadido a favoritos");
    } catch (error) {
      console.error("Error al añadir a favoritos", error);
      toast.error("Error al añadir a favoritos");
    }
  };

  // Eliminar producto de favoritos
  const removeFromFavorites = async (productId) => {
    if (!clientId) {
      toast.error("Debes iniciar sesión para gestionar favoritos");
      return;
    }

    try {
      // Encontrar el favorito para obtener su ID
      const favorite = favoriteProducts.find(p => p.id === productId);
      if (!favorite || !favorite.favoriteId) {
        toast.error("Favorito no encontrado");
        return;
      }

      const response = await fetch(`${FAVORITES_API}/${favorite.favoriteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error('Error al eliminar de favoritos');

      // Actualizar estado local
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Producto eliminado de favoritos");
    } catch (error) {
      console.error("Error al eliminar de favoritos", error);
      toast.error("Error al eliminar de favoritos");
    }
  };

  // Alternar estado de favorito
  const toggleFavorite = async (productId) => {
    if (!clientId) {
      toast.error("Debes iniciar sesión para gestionar favoritos");
      return;
    }

    const isCurrentlyFavorite = favoriteProducts.some(p => p.id === productId);
    
    if (isCurrentlyFavorite) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  // Verificar si un producto es favorito
  const isFavorite = (productId) => {
    return favoriteProducts.some(p => p.id === productId);
  };

  // Limpiar favoritos (útil para logout)
  const clearFavorites = () => {
    setFavoriteProducts([]);
    setError(null);
    setLoading(false);
  };

  // Cargar favoritos al montar el componente o cambiar clientId
  useEffect(() => {
    if (clientId) {
      fetchFavorites();
    } else {
      // Si no hay clientId, limpiar favoritos
      clearFavorites();
    }
  }, [clientId]);

  return {
    favoriteProducts,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
    clearFavorites,
    isEmpty: favoriteProducts.length === 0,
    count: favoriteProducts.length,
  };
};

export default useFavorites;
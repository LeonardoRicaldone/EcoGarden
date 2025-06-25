import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

const useFavorites = (clientId) => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    const FAVORITES_API = "http://localhost:4000/api/favorites";

    console.log('useFavorites initialized with clientId:', clientId);

    // Función para obtener favoritos del cliente
    const fetchFavorites = useCallback(async () => {
        if (!clientId) {
            console.log('No clientId provided, skipping fetch');
            setLoading(false);
            setFavoriteProducts([]);
            setFavoriteIds(new Set());
            return;
        }

        try {
            setLoading(true);
            console.log('Fetching favorites for client:', clientId);
            
            const response = await fetch(`${FAVORITES_API}/${clientId}`);
            console.log('Fetch response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const favorites = await response.json();
            console.log('Favorites received:', favorites);
            
            if (!Array.isArray(favorites)) {
                console.error('Favorites response is not an array:', favorites);
                setFavoriteProducts([]);
                setFavoriteIds(new Set());
                return;
            }
            
            // Extraer IDs de productos favoritos
            const productIds = favorites
                .map(fav => fav.idProduct || fav.id)
                .filter(id => id); // Filtrar IDs válidos
            
            console.log('Product IDs from favorites:', productIds);
            setFavoriteIds(new Set(productIds));

            // Setear los productos favoritos
            setFavoriteProducts(favorites);
            setError(null);
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
            setError("Error al cargar favoritos");
            setFavoriteProducts([]);
            setFavoriteIds(new Set());
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    // Función para agregar/quitar favorito
    const toggleFavorite = async (productId) => {
        console.log('toggleFavorite called with:', { productId, clientId });
        
        if (!clientId) {
            console.log('No clientId, showing login toast');
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
            return false;
        }

        try {
            const isFav = favoriteIds.has(productId);
            console.log('Product is currently favorite:', isFav);
            
            if (isFav) {
                console.log('Removing from favorites...');
                // Eliminar de favoritos usando DELETE con body
                const response = await fetch(`${FAVORITES_API}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idProduct: productId,
                        idClient: clientId
                    })
                });

                const data = await response.json();
                console.log('Delete response:', { status: response.status, data });

                if (!response.ok) {
                    throw new Error(data.message || 'Error al eliminar favorito');
                }

                // Actualizar estado local inmediatamente
                setFavoriteIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    console.log('Updated favoriteIds after delete:', newSet);
                    return newSet;
                });
                
                setFavoriteProducts(prev => {
                    const filtered = prev.filter(product => (product.idProduct || product.id) !== productId);
                    console.log('Updated favoriteProducts after delete:', filtered.length);
                    return filtered;
                });
                
                toast.success("Eliminado de favoritos");
            } else {
                console.log('Adding to favorites...');
                // Agregar a favoritos usando POST
                const response = await fetch(`${FAVORITES_API}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idProduct: productId,
                        idClient: clientId
                    })
                });

                const data = await response.json();
                console.log('Create response:', { status: response.status, data });

                if (!response.ok) {
                    // Si ya existe (409), actualizar estado pero no es error
                    if (response.status === 409) {
                        console.log('Product already in favorites, updating state');
                        setFavoriteIds(prev => {
                            const newSet = new Set([...prev, productId]);
                            console.log('Updated favoriteIds (already existed):', newSet);
                            return newSet;
                        });
                        toast.success("Producto ya estaba en favoritos");
                        return true;
                    }
                    throw new Error(data.message || 'Error al agregar favorito');
                }

                // Actualizar estado local inmediatamente
                setFavoriteIds(prev => {
                    const newSet = new Set([...prev, productId]);
                    console.log('Updated favoriteIds after add:', newSet);
                    return newSet;
                });
                
                toast.success("Agregado a favoritos");
                
                // Recargar favoritos para obtener la info completa del producto
                setTimeout(() => {
                    fetchFavorites();
                }, 100);
            }

            return true;
        } catch (error) {
            console.error("Error al actualizar favorito:", error);
            toast.error(error.message || "Error al actualizar favorito");
            return false;
        }
    };

    // Función para verificar si un producto es favorito
    const isFavorite = (productId) => {
        const result = favoriteIds.has(productId);
        console.log(`isFavorite(${productId}):`, result);
        return result;
    };

    // Cargar favoritos cuando cambie el clientId
    useEffect(() => {
        console.log('useEffect triggered, clientId:', clientId);
        if (clientId) {
            fetchFavorites();
        } else {
            console.log('No clientId, resetting state');
            setFavoriteProducts([]);
            setFavoriteIds(new Set());
            setLoading(false);
        }
    }, [clientId, fetchFavorites]);

    // Debug: Log cuando cambie favoriteIds
    useEffect(() => {
        console.log('favoriteIds changed:', favoriteIds);
    }, [favoriteIds]);

    return {
        favoriteProducts,
        loading,
        error,
        toggleFavorite,
        isFavorite,
        favoriteIds,
        isEmpty: favoriteProducts.length === 0,
        count: favoriteProducts.length,
        refetch: fetchFavorites
    };
};

export default useFavorites;
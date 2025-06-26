import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const useProductRatings = (productId) => {
  // Estados
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Estados del formulario
  const [newComment, setNewComment] = useState('');
  const [newScore, setNewScore] = useState(0);

  // Autenticación
  const { auth, user } = useAuth();
  const { isAuthenticated } = auth;
  const clientId = user?.id || null;

  // URL de la API
  const RATINGS_API = "http://localhost:4000/api/ratings";

  // Función para obtener token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  }, []);

  // Headers con autenticación
  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  }, [getAuthToken]);

  // Función para calcular rating promedio
  const calculateAverageRating = useCallback((ratingsArray) => {
    if (!ratingsArray || ratingsArray.length === 0) return 0;
    const sum = ratingsArray.reduce((acc, rating) => acc + rating.score, 0);
    return (sum / ratingsArray.length).toFixed(1);
  }, []);

  // Función para obtener ratings del producto
  const fetchRatings = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      console.log('Fetching ratings for product ID:', productId);
      
      const response = await fetch(`${RATINGS_API}?productId=${productId}`);
      
      if (response.ok) {
        const allRatings = await response.json();
        console.log('All ratings received:', allRatings);
        
        // Filtrar ratings para este producto
        const productRatings = allRatings.filter(rating => {
          const ratingProductId = rating.idProduct?._id || rating.idProduct;
          const matches = ratingProductId === productId;
          
          if (!matches && ratingProductId) {
            console.log('Rating filtered out - Product ID mismatch:', {
              ratingProductId,
              expectedProductId: productId,
              rating
            });
          }
          
          return matches;
        });
        
        console.log(`Filtered to ${productRatings.length} ratings for this product`);
        setRatings(productRatings);
      } else {
        console.error('Error fetching ratings:', response.status);
        setRatings([]);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  }, [productId, RATINGS_API]);

  // Función para enviar nuevo comentario
  const submitRating = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para calificar productos");
      return false;
    }

    if (newScore === 0) {
      toast.error("Por favor selecciona una calificación");
      return false;
    }

    if (newScore < 1 || newScore > 5) {
      toast.error("La calificación debe estar entre 1 y 5");
      return false;
    }

    if (!newComment.trim()) {
      toast.error("Por favor escribe un comentario");
      return false;
    }

    try {
      setSubmitting(true);

      console.log('Submitting comment with data:', {
        comment: newComment.trim(),
        score: newScore,
        idProduct: productId,
        idClient: clientId
      });

      const response = await fetch(RATINGS_API, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          comment: newComment.trim(),
          score: newScore,
          idProduct: productId,
          idClient: clientId
        })
      });

      if (response.ok) {
        toast.success("Comentario agregado exitosamente");
        setNewComment('');
        setNewScore(0);
        await fetchRatings();
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al enviar comentario');
        return false;
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error("Error al enviar comentario");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [
    isAuthenticated,
    newScore,
    newComment,
    productId,
    clientId,
    getAuthHeaders,
    fetchRatings,
    RATINGS_API
  ]);

  // Función para eliminar rating
  const deleteRating = useCallback(async (ratingId) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión");
      return false;
    }

    try {
      const response = await fetch(`${RATINGS_API}/${ratingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        toast.success("Comentario eliminado");
        await fetchRatings();
        return true;
      } else {
        throw new Error('Error al eliminar comentario');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error('Error al eliminar comentario');
      return false;
    }
  }, [isAuthenticated, getAuthHeaders, fetchRatings, RATINGS_API]);

  // Cargar ratings cuando cambia el productId
  useEffect(() => {
    if (productId) {
      fetchRatings();
    }
  }, [productId, fetchRatings]);

  // Calcular estadísticas
  const averageRating = calculateAverageRating(ratings);
  const totalRatings = ratings.length;

  // Obtener ratings del usuario actual
  const userRatings = ratings.filter(rating => 
    rating.idClient?._id === clientId || rating.idClient === clientId
  );

  return {
    // Estados principales
    ratings,
    loading,
    submitting,
    
    // Estados del formulario
    newComment,
    newScore,
    setNewComment,
    setNewScore,
    
    // Funciones principales
    submitRating,
    fetchRatings,
    deleteRating,
    
    // Estadísticas calculadas
    averageRating,
    totalRatings,
    userRatings,
    
    // Estados de autenticación
    isAuthenticated,
    clientId,
    
    // Utilidades
    calculateAverageRating
  };
};

export default useProductRatings;
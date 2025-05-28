import { useEffect, useState } from "react";

const useDataRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL de tu API para ratings
  const API = "http://localhost:4000/api/ratings";

  const fetchRatings = async () => {
    try {
      // Obtener ratings del backend con populate para obtener datos de producto y cliente
      const response = await fetch(`${API}?populate=idProduct,idClient`);
      const data = await response.json();
      setRatings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener ratings", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return {
    ratings,
    loading,
    fetchRatings,
  };
};

export default useDataRatings;
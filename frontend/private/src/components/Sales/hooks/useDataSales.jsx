import { useEffect, useState } from "react";

const useDataSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // URL fija directamente en el código
  const API = "http://localhost:4000/api/sales";

  const fetchSales = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setSales(data);
      setFilteredSales(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener ventas", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Función para filtrar ventas
  const filterSales = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale => 
        sale.name?.toLowerCase().includes(term.toLowerCase()) ||
        sale.lastname?.toLowerCase().includes(term.toLowerCase()) ||
        sale.department?.toLowerCase().includes(term.toLowerCase()) ||
        sale.city?.toLowerCase().includes(term.toLowerCase()) ||
        sale.status?.toLowerCase().includes(term.toLowerCase()) ||
        sale.phone?.toString().includes(term) ||
        sale.zipCode?.toString().includes(term)
      );
      setFilteredSales(filtered);
    }
  };

  return {
    sales: filteredSales,
    allSales: sales,
    loading,
    searchTerm,
    filterSales,
    totalSales: sales.length,
    filteredCount: filteredSales.length
  };
};

export default useDataSales;
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useDataSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API = "http://localhost:4000/api/sales";

  const fetchSales = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSales(data);
      setFilteredSales(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener ventas", error);
      setLoading(false);
    }
  };

  const updateSaleStatus = async (saleId, newStatus) => {
    try {
      console.log(`Actualizando venta ${saleId} con estado: ${newStatus}`);
      
      const response = await fetch(`${API}/${saleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Error ${response.status}: ${errorData}`);
      }

      const updatedSale = await response.json();
      console.log('Venta actualizada:', updatedSale);
      toast.success("Estado actualizado");

      // Actualización del estado local
      const updateSaleInArray = (prevSales) => 
        prevSales.map(sale => 
          sale._id === saleId 
            ? { 
                ...sale, 
                status: newStatus, 
                updatedAt: new Date().toISOString() 
              } 
            : sale
        );

      setSales(updateSaleInArray);
      setFilteredSales(updateSaleInArray);

      return true;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      return false;
    }
  };

  const filterSales = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale => {
        const searchFields = [
          sale.name?.toLowerCase(),
          sale.lastname?.toLowerCase(),
          sale.department?.toLowerCase(),
          sale.city?.toLowerCase(),
          sale.status?.toLowerCase(),
          sale.phone?.toString(),
          sale.zipCode?.toString(),
          sale._id?.slice(-8),
          sale.total?.toString() // Añadido el campo total a la búsqueda
        ];
        
        return searchFields.some(field => 
          field && field.includes(term.toLowerCase())
        );
      });
      setFilteredSales(filtered);
    }
  };

  // Función para calcular el total de ingresos
  const calculateTotalRevenue = (salesArray) => {
    return salesArray.reduce((total, sale) => {
      const saleTotal = sale.total || 0;
      return total + saleTotal;
    }, 0);
  };

  // Refrescar ventas manualmente
  const refreshSales = async () => {
    setLoading(true);
    await fetchSales();
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Actualizar filteredSales cuando sales cambie
  useEffect(() => {
    if (searchTerm) {
      filterSales(searchTerm);
    } else {
      setFilteredSales(sales);
    }
  }, [sales]);

  return {
    sales: filteredSales,
    allSales: sales,
    loading,
    searchTerm,
    filterSales,
    totalSales: sales.length,
    filteredCount: filteredSales.length,
    totalRevenue: calculateTotalRevenue(sales),
    filteredRevenue: calculateTotalRevenue(filteredSales),
    updateSaleStatus,
    refreshSales
  };
};

export default useDataSales;
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API_BASE from '../../../api/URL.js'

const useDataSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API = `${API_BASE}/api/sales`;

  const fetchSales = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // DEBUGGING: Verificar estructura de datos
      console.log('Sales data received:', data);
      console.log('Type of data:', typeof data);
      console.log('Is data array?', Array.isArray(data));

      // Normalizar datos - manejar diferentes estructuras posibles
      let normalizedSales = [];
      if (Array.isArray(data)) {
        normalizedSales = data;
      } else if (data && Array.isArray(data.data)) {
        normalizedSales = data.data;
      } else if (data && typeof data === 'object') {
        // Buscar arrays anidados en el objeto
        const possibleArrays = Object.values(data).filter(Array.isArray);
        normalizedSales = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }

      console.log('Normalized sales:', normalizedSales);

      setSales(normalizedSales);
      setFilteredSales(normalizedSales);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener ventas", error);
      setSales([]); // Asegurar que siempre sea un array
      setFilteredSales([]);
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
    
    // Validar que sales sea un array antes de filtrar
    if (!Array.isArray(sales)) {
      console.warn('Sales is not an array:', sales);
      setFilteredSales([]);
      return;
    }

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

  // Función para calcular el total de ingresos con validación
  const calculateTotalRevenue = (salesArray) => {
    // Validar que salesArray sea un array
    if (!Array.isArray(salesArray)) {
      console.warn('calculateTotalRevenue: Input is not an array:', salesArray);
      return 0;
    }

    return salesArray.reduce((total, sale) => {
      // Validar que sale sea un objeto
      if (!sale || typeof sale !== 'object') {
        return total;
      }
      
      // Buscar diferentes posibles campos de total
      const saleTotal = sale.total || sale.amount || sale.price || 0;
      
      // Validar que el total sea un número
      const numericTotal = typeof saleTotal === 'number' ? saleTotal : 0;
      
      return total + numericTotal;
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
      // Validar que sales sea un array antes de asignarlo
      if (Array.isArray(sales)) {
        setFilteredSales(sales);
      } else {
        setFilteredSales([]);
      }
    }
  }, [sales]);

  // Asegurar que siempre devolvamos arrays válidos
  const safeSales = Array.isArray(sales) ? sales : [];
  const safeFilteredSales = Array.isArray(filteredSales) ? filteredSales : [];

  return {
    sales: safeFilteredSales,
    allSales: safeSales,
    loading,
    searchTerm,
    filterSales,
    totalSales: safeSales.length,
    filteredCount: safeFilteredSales.length,
    totalRevenue: calculateTotalRevenue(safeSales),
    filteredRevenue: calculateTotalRevenue(safeFilteredSales),
    updateSaleStatus,
    refreshSales
  };
};

export default useDataSales;
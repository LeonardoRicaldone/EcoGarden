import { useState, useEffect } from 'react';
import API_BASE from '../../../api/URL.js'

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalSales: 0,
    loading: true,
    error: null
  });

  const API = `${API_BASE}/api`;

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch paralelo de productos y ventas
      const [productsResponse, salesResponse] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/sales`)
      ]);

      // Verificar que ambas respuestas sean exitosas
      if (!productsResponse.ok) {
        throw new Error(`Error al obtener productos: ${productsResponse.status}`);
      }
      if (!salesResponse.ok) {
        throw new Error(`Error al obtener ventas: ${salesResponse.status}`);
      }

      // Convertir respuestas a JSON
      const [productsData, salesData] = await Promise.all([
        productsResponse.json(),
        salesResponse.json()
      ]);

      // DEBUGGING: Verificar estructura de datos
      console.log('Products data:', productsData);
      console.log('Sales data:', salesData);
      console.log('Type of salesData:', typeof salesData);
      console.log('Is salesData array?', Array.isArray(salesData));

      // Validar y normalizar datos de productos
      let normalizedProducts = [];
      if (Array.isArray(productsData)) {
        normalizedProducts = productsData;
      } else if (productsData && Array.isArray(productsData.data)) {
        normalizedProducts = productsData.data;
      } else if (productsData && typeof productsData === 'object') {
        // Si es un objeto, intentar encontrar la propiedad que contiene el array
        const possibleArrays = Object.values(productsData).filter(Array.isArray);
        normalizedProducts = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }

      // Validar y normalizar datos de ventas
      let normalizedSales = [];
      if (Array.isArray(salesData)) {
        normalizedSales = salesData;
      } else if (salesData && Array.isArray(salesData.data)) {
        normalizedSales = salesData.data;
      } else if (salesData && typeof salesData === 'object') {
        // Si es un objeto, intentar encontrar la propiedad que contiene el array
        const possibleArrays = Object.values(salesData).filter(Array.isArray);
        normalizedSales = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }

      // Calcular estadísticas
      const totalProducts = normalizedProducts.length;
      const totalSales = normalizedSales.length;
      
      // Calcular ingresos totales sumando el total de cada venta
      const totalRevenue = normalizedSales.reduce((sum, sale) => {
        // Validar que sale sea un objeto y tenga la propiedad total
        if (sale && typeof sale === 'object') {
          const saleTotal = sale.total || sale.amount || sale.price || 0;
          return sum + (typeof saleTotal === 'number' ? saleTotal : 0);
        }
        return sum;
      }, 0);

      // Actualizar estado con los datos calculados
      setDashboardData({
        totalRevenue,
        totalProducts,
        totalSales,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar los datos del dashboard'
      }));
    }
  };

  // Función para refrescar los datos manualmente
  const refreshDashboardData = () => {
    fetchDashboardData();
  };

  // Función para formatear números grandes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + ' mill.';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + ' mil';
    }
    return num.toString();
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Effect para cargar datos al montar el componente
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...dashboardData,
    refreshDashboardData,
    formatNumber,
    formatCurrency
  };
};

export default useDashboardData;
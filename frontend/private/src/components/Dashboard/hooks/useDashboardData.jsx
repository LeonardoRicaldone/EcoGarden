import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalSales: 0,
    loading: true,
    error: null
  });

  const API_BASE = "http://localhost:4000/api";

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch paralelo de productos y ventas
      const [productsResponse, salesResponse] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/sales`)
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

      // Calcular estadísticas
      const totalProducts = productsData.length;
      const totalSales = salesData.length;
      
      // Calcular ingresos totales sumando el total de cada venta
      const totalRevenue = salesData.reduce((sum, sale) => {
        return sum + (sale.total || 0);
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
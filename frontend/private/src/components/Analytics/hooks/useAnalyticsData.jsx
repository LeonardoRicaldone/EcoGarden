import { useState, useEffect } from 'react';
import API_BASE from '../../../api/URL.js';

const useAnalyticsData = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalSales: 0,
    averageRating: 0,
    salesByMonth: [],
    salesByStatus: [],
    ratingsByProduct: [],
    loading: true,
    error: null
  });

  const API = `${API_BASE}/api`;

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch paralelo de productos, ventas y ratings - igual que en dashboard
      const [productsResponse, salesResponse, ratingsResponse] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/sales`),
        fetch(`${API}/ratings`).catch(() => ({ ok: false })) // ratings es opcional
      ]);

      // Verificar que las respuestas principales sean exitosas
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

      // Obtener ratings si está disponible
      let ratingsData = [];
      if (ratingsResponse.ok) {
        ratingsData = await ratingsResponse.json();
      }

      // DEBUGGING: Verificar estructura de datos (igual que en dashboard)
      console.log('Products data:', productsData);
      console.log('Sales data:', salesData);
      console.log('Ratings data:', ratingsData);
      console.log('Type of salesData:', typeof salesData);
      console.log('Is salesData array?', Array.isArray(salesData));

      // Validar y normalizar datos de productos (igual que en dashboard)
      let normalizedProducts = [];
      if (Array.isArray(productsData)) {
        normalizedProducts = productsData;
      } else if (productsData && Array.isArray(productsData.data)) {
        normalizedProducts = productsData.data;
      } else if (productsData && typeof productsData === 'object') {
        const possibleArrays = Object.values(productsData).filter(Array.isArray);
        normalizedProducts = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }

      // Validar y normalizar datos de ventas (igual que en dashboard)
      let normalizedSales = [];
      if (Array.isArray(salesData)) {
        normalizedSales = salesData;
      } else if (salesData && Array.isArray(salesData.data)) {
        normalizedSales = salesData.data;
      } else if (salesData && typeof salesData === 'object') {
        const possibleArrays = Object.values(salesData).filter(Array.isArray);
        normalizedSales = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }

      // Validar y normalizar datos de ratings
      let normalizedRatings = [];
      if (Array.isArray(ratingsData)) {
        normalizedRatings = ratingsData;
      } else if (ratingsData && Array.isArray(ratingsData.data)) {
        normalizedRatings = ratingsData.data;
      } else if (ratingsData && typeof ratingsData === 'object') {
        const possibleArrays = Object.values(ratingsData).filter(Array.isArray);
        normalizedRatings = possibleArrays.length > 0 ? possibleArrays[0] : [];
      }

      // Calcular estadísticas básicas (igual que en dashboard)
      const totalProducts = normalizedProducts.length;
      const totalSales = normalizedSales.length;
      
      // Calcular ingresos totales sumando el total de cada venta (igual que en dashboard)
      const totalRevenue = normalizedSales.reduce((sum, sale) => {
        if (sale && typeof sale === 'object') {
          const saleTotal = sale.total || sale.amount || sale.price || 0;
          return sum + (typeof saleTotal === 'number' ? saleTotal : 0);
        }
        return sum;
      }, 0);

      // Calcular rating promedio
      const averageRating = normalizedRatings.length > 0 
        ? normalizedRatings.reduce((sum, rating) => {
            if (rating && typeof rating === 'object') {
              const score = rating.score || rating.rating || rating.value || 0;
              return sum + (typeof score === 'number' ? score : 0);
            }
            return sum;
          }, 0) / normalizedRatings.length 
        : 0;

      // Procesar datos para gráficas
      const salesByMonth = processSalesByMonth(normalizedSales);
      const salesByStatus = processSalesByStatus(normalizedSales);
      const ratingsByProduct = processRatingsByProduct(normalizedRatings, normalizedProducts);

      console.log('Datos procesados:', {
        totalRevenue,
        totalProducts,
        totalSales,
        averageRating,
        salesByMonth: salesByMonth.length,
        salesByStatus: salesByStatus.length,
        ratingsByProduct: ratingsByProduct.length
      });

      // Actualizar estado con los datos calculados
      setAnalyticsData({
        totalRevenue,
        totalProducts,
        totalSales,
        averageRating,
        salesByMonth,
        salesByStatus,
        ratingsByProduct,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar los datos de analytics'
      }));
    }
  };

  const processSalesByMonth = (salesData) => {
    if (!Array.isArray(salesData) || salesData.length === 0) {
      return [];
    }

    const monthlyStats = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    salesData.forEach(sale => {
      if (!sale || typeof sale !== 'object') return;

      // Buscar fecha en diferentes campos posibles
      const dateValue = sale.createdAt || sale.updatedAt || sale.date || sale.fecha;
      
      if (!dateValue) return;

      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = `${months[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthName,
          sales: 0,
          revenue: 0
        };
      }

      monthlyStats[monthKey].sales += 1;
      
      const amount = sale.total || sale.amount || sale.price || 0;
      monthlyStats[monthKey].revenue += (typeof amount === 'number' ? amount : 0);
    });

    // Ordenar por año-mes y tomar los últimos 6
    return Object.entries(monthlyStats)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .slice(-6)
      .map(([, value]) => value);
  };

  const processSalesByStatus = (salesData) => {
    if (!Array.isArray(salesData) || salesData.length === 0) {
      return [];
    }

    const statusStats = {};
    const statusTranslations = {
      'pending': 'Pendiente',
      'processing': 'Procesando', 
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };

    salesData.forEach(sale => {
      if (!sale || typeof sale !== 'object') return;

      const status = sale.status || 'pending';
      const translatedStatus = statusTranslations[status.toLowerCase()] || status;

      if (!statusStats[translatedStatus]) {
        statusStats[translatedStatus] = {
          name: translatedStatus,
          count: 0
        };
      }

      statusStats[translatedStatus].count += 1;
    });

    return Object.values(statusStats).filter(item => item.count > 0);
  };

  const processRatingsByProduct = (ratingsData, productsData) => {
    if (!Array.isArray(ratingsData) || ratingsData.length === 0 || 
        !Array.isArray(productsData) || productsData.length === 0) {
      return [];
    }

    // Crear mapa de productos
    const productMap = {};
    productsData.forEach(product => {
      if (product && typeof product === 'object') {
        const productId = product._id || product.id;
        const productName = product.name || product.title || product.nombre || 'Producto sin nombre';
        if (productId) {
          productMap[productId] = productName;
        }
      }
    });

    const productRatings = {};

    ratingsData.forEach(rating => {
      if (!rating || typeof rating !== 'object') return;

      const productId = rating.idProduct || rating.productId || rating.product_id || rating.producto_id;
      const productName = productMap[productId];
      
      if (!productName) return;

      if (!productRatings[productName]) {
        productRatings[productName] = {
          productName: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
          totalScore: 0,
          totalRatings: 0
        };
      }

      const score = rating.score || rating.rating || rating.puntuacion || rating.value || 0;
      productRatings[productName].totalScore += (typeof score === 'number' ? score : 0);
      productRatings[productName].totalRatings += 1;
    });

    return Object.values(productRatings)
      .map(item => ({
        productName: item.productName,
        rating: parseFloat((item.totalScore / item.totalRatings).toFixed(1)),
        totalRatings: item.totalRatings
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  };

  // Función para refrescar los datos manualmente
  const refreshAnalyticsData = () => {
    fetchAnalyticsData();
  };

  // Función para formatear números grandes (igual que en dashboard)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + ' mill.';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + ' mil';
    }
    return num.toString();
  };

  // Función para formatear moneda (igual que en dashboard)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Effect para cargar datos al montar el componente
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    ...analyticsData,
    refreshAnalyticsData,
    formatNumber,
    formatCurrency
  };
};

export default useAnalyticsData;
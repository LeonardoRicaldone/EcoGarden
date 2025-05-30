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

      const [productsResult, salesResult, ratingsResult] = await Promise.allSettled([
        fetch(`${API}/products`).then(res => res.ok ? res.json() : []),
        fetch(`${API}/sales`).then(res => res.ok ? res.json() : []),
        fetch(`${API}/ratings`).then(res => res.ok ? res.json() : [])
      ]);

      const productsData = productsResult.status === 'fulfilled' ? productsResult.value : [];
      const salesData = salesResult.status === 'fulfilled' ? salesResult.value : [];
      const ratingsData = ratingsResult.status === 'fulfilled' ? ratingsResult.value : [];

      console.log('Datos cargados:', {
        productos: productsData
      });

      const totalProducts = productsData.length;
      const totalSales = salesData.length;
      const totalRevenue = salesData.reduce((sum, sale) => {
        const amount = parseFloat(sale.total) || parseFloat(sale.amount) || 0;
        return sum + amount;
      }, 0);

      const averageRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, rating) => {
            const score = parseFloat(rating.score) || parseFloat(rating.rating) || 0;
            return sum + score;
          }, 0) / ratingsData.length 
        : 0;

      const salesByMonth = processSalesByMonth(salesData);
      const salesByStatus = processSalesByStatus(salesData);
      const ratingsByProduct = processRatingsByProduct(ratingsData, productsData);

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
      console.error('Error general:', error);
      setAnalyticsData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar los datos de analytics'
      }));
    }
  };

  const processSalesByMonth = (salesData) => {
    if (!salesData || salesData.length === 0) return generateMockMonthData();

    const monthlyStats = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    salesData.forEach(sale => {
      const dateValue = sale.createdAt || sale.date || sale.created_at || new Date();
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
      const amount = parseFloat(sale.total) || parseFloat(sale.amount) || 0;
      monthlyStats[monthKey].revenue += amount;
    });

    return Object.values(monthlyStats)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6);
  };

  const generateMockMonthData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return months.map(month => ({
      month: `${month} 2024`,
      sales: 0,
      revenue: 0
    }));
  };

  const processSalesByStatus = (salesData) => {
    if (!salesData || salesData.length === 0) {
      return [{ name: 'Sin datos', count: 0 }];
    }

    const statusStats = {};
    const statusTranslations = {
      'pending': 'Pendiente',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado'
    };

    salesData.forEach(sale => {
      const status = sale.status || sale.state || 'Sin estado';
      const translatedStatus = statusTranslations[status.toLowerCase()] || status;

      if (!statusStats[translatedStatus]) {
        statusStats[translatedStatus] = {
          name: translatedStatus,
          count: 0
        };
      }

      statusStats[translatedStatus].count += 1;
    });

    return Object.values(statusStats);
  };

  const processRatingsByProduct = (ratingsData, productsData) => {
    if (!ratingsData || ratingsData.length === 0 || !productsData || productsData.length === 0) {
      return [{ productName: 'Sin datos', rating: 0, totalRatings: 0 }];
    }

    const productMap = {};
    productsData.forEach(product => {
      productMap[product._id || product.id] = product.name || product.title || 'Producto sin nombre';
    });

    const productRatings = {};

    ratingsData.forEach(rating => {
      const productId = rating.idProduct || rating.productId || rating.product_id;
      const productName = productMap[productId] || 'Producto desconocido';

      if (!productRatings[productName]) {
        productRatings[productName] = {
          productName: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
          totalScore: 0,
          totalRatings: 0
        };
      }

      const score = parseFloat(rating.score) || parseFloat(rating.rating) || 0;
      productRatings[productName].totalScore += score;
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

  const refreshAnalyticsData = () => {
    fetchAnalyticsData();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
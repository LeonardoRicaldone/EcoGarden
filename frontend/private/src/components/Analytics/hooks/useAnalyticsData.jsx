import { useState, useEffect } from 'react';

const useAnalyticsData = () => {
  const [analyticsData, setAnalyticsData] = useState({
    // Datos principales
    totalRevenue: 0,
    totalProducts: 0,
    totalSales: 0,
    averageRating: 0,
    
    // Datos para gráficas
    salesByMonth: [],
    productsByCategory: [],
    salesByStatus: [],
    ratingsByProduct: [],
    
    // Estados
    loading: true,
    error: null
  });

  const API_BASE = "http://localhost:4000/api";

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true, error: null }));

      console.log('Iniciando fetch de datos...');

      // Fetch todos los datos en paralelo con manejo de errores individual
      const [productsResult, salesResult, categoriesResult, ratingsResult] = await Promise.allSettled([
        fetch(`${API_BASE}/products`).then(res => res.ok ? res.json() : []),
        fetch(`${API_BASE}/sales`).then(res => res.ok ? res.json() : []),
        fetch(`${API_BASE}/categories`).then(res => res.ok ? res.json() : []),
        fetch(`${API_BASE}/ratings`).then(res => res.ok ? res.json() : [])
      ]);

      const productsData = productsResult.status === 'fulfilled' ? productsResult.value : [];
      const salesData = salesResult.status === 'fulfilled' ? salesResult.value : [];
      const categoriesData = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
      const ratingsData = ratingsResult.status === 'fulfilled' ? ratingsResult.value : [];

      console.log('Datos cargados:', {
        products: productsData.length,
        sales: salesData.length,
        categories: categoriesData.length,
        ratings: ratingsData.length
      });

      // Calcular datos principales
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

      // Procesar datos para gráficas
      const salesByMonth = processSalesByMonth(salesData);
      const productsByCategory = processProductsByCategory(productsData, categoriesData);
      const salesByStatus = processSalesByStatus(salesData);
      const ratingsByProduct = processRatingsByProduct(ratingsData, productsData);

      console.log('Datos procesados:', {
        salesByMonth,
        productsByCategory,
        salesByStatus,
        ratingsByProduct
      });

      setAnalyticsData({
        totalRevenue,
        totalProducts,
        totalSales,
        averageRating,
        salesByMonth,
        productsByCategory,
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

  // Procesar ventas por mes
  const processSalesByMonth = (salesData) => {
    if (!salesData || salesData.length === 0) {
      return generateMockMonthData();
    }
    
    const monthlyStats = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    salesData.forEach(sale => {
      // Intentar múltiples campos de fecha
      const dateValue = sale.createdAt || sale.date || sale.created_at || new Date();
      const date = new Date(dateValue);
      
      if (isNaN(date.getTime())) {
        return; // Fecha inválida, skip
      }
      
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
    
    const result = Object.values(monthlyStats)
      .sort((a, b) => {
        const aDate = new Date(a.month.split(' ').reverse().join('-'));
        const bDate = new Date(b.month.split(' ').reverse().join('-'));
        return aDate - bDate;
      })
      .slice(-6);
    
    return result.length > 0 ? result : generateMockMonthData();
  };

  const generateMockMonthData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return months.map(month => ({
      month: `${month} 2024`,
      sales: 0,
      revenue: 0
    }));
  };

  // Procesar productos por categoría
  const processProductsByCategory = (productsData, categoriesData) => {
    if (!productsData || productsData.length === 0) {
      return [{ name: 'Sin datos', count: 0, inventoryValue: 0 }];
    }
    
    // Crear mapa de categorías
    const categoryMap = {};
    if (categoriesData && categoriesData.length > 0) {
      categoriesData.forEach(category => {
        categoryMap[category._id || category.id] = category.name || category.title || 'Sin nombre';
      });
    }
    
    const categoryStats = {};
    
    productsData.forEach(product => {
      // Intentar múltiples campos para categoría
      const categoryId = product.idCategory || product.categoryId || product.category_id || product.category;
      const categoryName = categoryMap[categoryId] || product.categoryName || 'Sin categoría';
      
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          name: categoryName,
          count: 0,
          inventoryValue: 0
        };
      }
      
      categoryStats[categoryName].count += 1;
      
      const price = parseFloat(product.price) || 0;
      const stock = parseInt(product.stock) || parseInt(product.quantity) || 0;
      categoryStats[categoryName].inventoryValue += price * stock;
    });
    
    const result = Object.values(categoryStats);
    return result.length > 0 ? result : [{ name: 'Sin datos', count: 0, inventoryValue: 0 }];
  };

  // Procesar ventas por estado
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
    
    const result = Object.values(statusStats);
    return result.length > 0 ? result : [{ name: 'Sin datos', count: 0 }];
  };

  // Procesar ratings por producto
  const processRatingsByProduct = (ratingsData, productsData) => {
    if (!ratingsData || ratingsData.length === 0 || !productsData || productsData.length === 0) {
      return [{ productName: 'Sin datos', rating: 0, totalRatings: 0 }];
    }
    
    // Crear mapa de productos
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
    
    // Calcular promedio y ordenar
    const result = Object.values(productRatings)
      .map(item => ({
        productName: item.productName,
        rating: parseFloat((item.totalScore / item.totalRatings).toFixed(1)),
        totalRatings: item.totalRatings
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    
    return result.length > 0 ? result : [{ productName: 'Sin datos', rating: 0, totalRatings: 0 }];
  };

  // Función para refrescar los datos
  const refreshAnalyticsData = () => {
    fetchAnalyticsData();
  };

  // Funciones de formateo
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Effect para cargar datos
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
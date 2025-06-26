import React, { useRef, useEffect } from 'react';
import * as Chart from 'chart.js';
import './Analytics.css';
import Header from '../components/Header';
import useAnalyticsData from '../components/Analytics/hooks/useAnalyticsData';

// Registrar todos los componentes necesarios de Chart.js - CORREGIDO
const {
  Chart: ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} = Chart;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const {
    totalRevenue,
    totalProducts,
    totalSales,
    averageRating,
    salesByMonth,
    salesByStatus,
    loading,
    error,
    formatCurrency,
    formatNumber,
    refreshAnalyticsData
  } = useAnalyticsData();

  // Referencias para los canvas de las gráficas
  const salesChartRef = useRef(null);
  const statusChartRef = useRef(null);

  // Referencias para las instancias de Chart.js
  const chartsRef = useRef({});

  // Colores para las gráficas
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  // Efecto para crear/actualizar las gráficas
  useEffect(() => {
    if (loading || error) return;

    console.log('Creando gráficas con datos:', { salesByMonth, salesByStatus });

    // Destruir gráficas existentes
    Object.values(chartsRef.current).forEach(chart => {
      if (chart) chart.destroy();
    });
    chartsRef.current = {};

    // Crear gráfica de ventas por mes (combinada) - CORREGIDO
    if (salesChartRef.current && salesByMonth && salesByMonth.length > 0) {
      const ctx = salesChartRef.current.getContext('2d');
      
      console.log('Creando gráfica de ventas con datos:', salesByMonth);
      
      chartsRef.current.sales = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: salesByMonth.map(item => item.month),
          datasets: [
            {
              label: 'Ventas',
              data: salesByMonth.map(item => item.sales),
              backgroundColor: 'rgba(52, 211, 153, 0.8)',
              borderColor: 'rgba(52, 211, 153, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Ingresos',
              data: salesByMonth.map(item => item.revenue),
              type: 'line',
              backgroundColor: 'rgba(255, 115, 0, 0.1)',
              borderColor: 'rgba(255, 115, 0, 1)',
              borderWidth: 3,
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            x: {
              display: true,
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Número de Ventas'
              },
              beginAtZero: true
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Ingresos (USD)'
              },
              beginAtZero: true,
              grid: {
                drawOnChartArea: false,
              },
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  if (context.dataset.label === 'Ingresos') {
                    return `Ingresos: ${formatCurrency(context.parsed.y)}`;
                  }
                  return `${context.dataset.label}: ${context.parsed.y}`;
                }
              }
            }
          }
        }
      });
    } else {
      console.log('No se puede crear gráfica de ventas:', { 
        hasRef: !!salesChartRef.current, 
        hasData: !!salesByMonth, 
        dataLength: salesByMonth?.length 
      });
    }

    // Crear gráfica de estados de ventas - CORREGIDO
    if (statusChartRef.current && salesByStatus && salesByStatus.length > 0) {
      const ctx = statusChartRef.current.getContext('2d');
      
      console.log('Creando gráfica de estados con datos:', salesByStatus);
      
      chartsRef.current.status = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: salesByStatus.map(item => item.name),
          datasets: [{
            data: salesByStatus.map(item => item.count),
            backgroundColor: COLORS.slice(0, salesByStatus.length),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed * 100) / total).toFixed(1);
                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      console.log('No se puede crear gráfica de estados:', { 
        hasRef: !!statusChartRef.current, 
        hasData: !!salesByStatus, 
        dataLength: salesByStatus?.length 
      });
    }

    // Cleanup function
    return () => {
      Object.values(chartsRef.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [loading, error, salesByMonth, salesByStatus, formatCurrency]);

  if (loading) {
    return (
      <div className="estadisticas-container">
        <Header title="Analytics" />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>
            Cargando analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estadisticas-container">
        <Header title="Analytics" />
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          <p>Error: {error}</p>
          <button 
            onClick={refreshAnalyticsData}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="estadisticas-container">
      <Header title="Analytics" />

      {/* Tarjetas resumen */}
      <div className="estadisticas-cards">
        <div className="estadisticas-card">
          <h2>{formatCurrency(totalRevenue || 0)}</h2>
          <p>Ganancias Totales</p>
        </div>
        <div className="estadisticas-card">
          <h2>{formatNumber(totalProducts || 0)}</h2>
          <p>Número de Productos</p>
        </div>
        <div className="estadisticas-card">
          <h2>{formatNumber(totalSales || 0)}</h2>
          <p>Cantidad de Ventas</p>
        </div>
        <div className="estadisticas-card">
          <h2>{(averageRating || 0).toFixed(1)} ★</h2>
          <p>Rating Promedio</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="estadisticas-charts">
        {/* Ventas e ingresos por mes */}
        <div className="estadisticas-chart">
          <h3>Ventas e Ingresos por Mes</h3>
          <div style={{ position: 'relative', height: '300px', padding: '10px' }}>
            {salesByMonth && salesByMonth.length > 0 ? (
              <canvas 
                ref={salesChartRef}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  backgroundColor: '#ffffff'
                }}
              ></canvas>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666',
                fontSize: '1rem'
              }}>
                No hay datos de ventas disponibles
              </div>
            )}
          </div>
        </div>

        {/* Estados de ventas */}
        <div className="estadisticas-chart">
          <h3>Estados de Ventas</h3>
          <div style={{ position: 'relative', height: '300px', padding: '10px' }}>
            {salesByStatus && salesByStatus.length > 0 ? (
              <canvas 
                ref={statusChartRef}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  backgroundColor: '#ffffff'
                }}
              ></canvas>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666',
                fontSize: '1rem'
              }}>
                No hay datos de estados disponibles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
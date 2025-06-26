import React, { useRef, useEffect } from 'react';
// CORREGIDO: Importación completa incluyendo controladores necesarios
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,  // ← AÑADIDO: Controller para gráficas doughnut
  BarController,       // ← AÑADIDO: Controller para gráficas de barras
  LineController,      // ← AÑADIDO: Controller para gráficas de línea
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Analytics.css';
import Header from '../components/Header';
import useAnalyticsData from '../components/Analytics/hooks/useAnalyticsData';

// CORREGIDO: Registrar todos los componentes necesarios incluyendo controladores
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,  // ← AÑADIDO
  BarController,       // ← AÑADIDO
  LineController,      // ← AÑADIDO
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
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    chartsRef.current = {};

    // Crear gráfica de ventas por mes
    if (salesChartRef.current && salesByMonth && salesByMonth.length > 0) {
      const ctx = salesChartRef.current.getContext('2d');
      
      console.log('Creando gráfica de ventas con datos:', salesByMonth);
      
      try {
        chartsRef.current.sales = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: salesByMonth.map(item => item.month || 'Sin fecha'),
            datasets: [
              {
                label: 'Ventas',
                data: salesByMonth.map(item => item.sales || 0),
                backgroundColor: 'rgba(52, 211, 153, 0.8)',
                borderColor: 'rgba(52, 211, 153, 1)',
                borderWidth: 1,
                yAxisID: 'y'
              },
              {
                label: 'Ingresos',
                data: salesByMonth.map(item => item.revenue || 0),
                type: 'line',
                backgroundColor: 'rgba(255, 115, 0, 0.1)',
                borderColor: 'rgba(255, 115, 0, 1)',
                borderWidth: 3,
                fill: false,
                yAxisID: 'y1',
                tension: 0.4
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
                title: {
                  display: true,
                  text: 'Mes'
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Número de Ventas'
                },
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
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
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Tendencia de Ventas e Ingresos'
              },
              legend: {
                display: true,
                position: 'top'
              },
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
        console.log('✅ Gráfica de ventas creada exitosamente');
      } catch (error) {
        console.error('❌ Error creando gráfica de ventas:', error);
      }
    } else {
      console.log('No se puede crear gráfica de ventas:', { 
        hasRef: !!salesChartRef.current, 
        hasData: !!salesByMonth, 
        dataLength: salesByMonth?.length 
      });
    }

    // CORREGIDO: Crear gráfica de estados de ventas con validación mejorada
    if (statusChartRef.current && salesByStatus && salesByStatus.length > 0) {
      const ctx = statusChartRef.current.getContext('2d');
      
      console.log('Creando gráfica de estados con datos:', salesByStatus);
      
      // Validar que los datos tengan la estructura correcta
      const validData = salesByStatus.filter(item => 
        item && 
        typeof item === 'object' && 
        (item.name || item.label) && 
        typeof (item.count || item.value) === 'number' &&
        (item.count || item.value) > 0
      );

      if (validData.length === 0) {
        console.warn('No hay datos válidos para la gráfica de estados');
        return;
      }
      
      try {
        chartsRef.current.status = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: validData.map(item => item.name || item.label || 'Sin estado'),
            datasets: [{
              data: validData.map(item => item.count || item.value || 0),
              backgroundColor: COLORS.slice(0, validData.length),
              borderWidth: 2,
              borderColor: '#fff',
              hoverBorderWidth: 3,
              hoverOffset: 10
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Distribución por Estado'
              },
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
                    const percentage = total > 0 ? ((context.parsed * 100) / total).toFixed(1) : 0;
                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                  }
                }
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true
            }
          }
        });
        console.log('✅ Gráfica de estados creada exitosamente');
      } catch (error) {
        console.error('❌ Error creando gráfica de estados:', error);
        console.error('Datos que causaron el error:', validData);
      }
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
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
      chartsRef.current = {};
    };
  }, [loading, error, salesByMonth, salesByStatus, formatCurrency]);

  // Loading state
  if (loading) {
    return (
      <div className="estadisticas-container">
        <Header title="Analytics" />
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>
            Cargando analytics...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="estadisticas-container">
        <Header title="Analytics" />
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#ef4444',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '1.5rem' }}>⚠️</div>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Error: {error}</p>
          <button 
            onClick={refreshAnalyticsData}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            🔄 Reintentar
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
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
             Ingresos acumulados
          </div>
        </div>
        <div className="estadisticas-card">
          <h2>{formatNumber(totalProducts || 0)}</h2>
          <p>Número de Productos</p>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
             Productos en catálogo
          </div>
        </div>
        <div className="estadisticas-card">
          <h2>{formatNumber(totalSales || 0)}</h2>
          <p>Cantidad de Ventas</p>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
            Ventas realizadas
          </div>
        </div>
        <div className="estadisticas-card">
          <h2>{(averageRating || 0).toFixed(1)} ★</h2>
          <p>Rating Promedio</p>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
             Satisfacción del cliente
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="estadisticas-charts">
        {/* Ventas e ingresos por mes */}
        <div className="estadisticas-chart">
          <h3> Ventas e Ingresos por Mes</h3>
          <div style={{ position: 'relative', height: '350px', padding: '15px' }}>
            {salesByMonth && salesByMonth.length > 0 ? (
              <canvas 
                ref={salesChartRef}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px'
                }}
              ></canvas>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666',
                fontSize: '1rem',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '2rem' }}>📊</div>
                <div>No hay datos de ventas disponibles</div>
                <button 
                  onClick={refreshAnalyticsData}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Actualizar datos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Estados de ventas */}
        <div className="estadisticas-chart">
          <h3> Estados de Ventas</h3>
          <div style={{ position: 'relative', height: '350px', padding: '15px' }}>
            {salesByStatus && salesByStatus.length > 0 ? (
              <canvas 
                ref={statusChartRef}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px'
                }}
              ></canvas>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666',
                fontSize: '1rem',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '2rem' }}>📋</div>
                <div>No hay datos de estados disponibles</div>
                <button 
                  onClick={refreshAnalyticsData}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Actualizar datos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
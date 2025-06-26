import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaShoppingBag, 
  FaEye, 
  FaClock, 
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaSpinner
} from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderDetailsModal from '../components/OrderDetailsModal'; // Importar el modal

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' o 'orders'
  const [userSales, setUserSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Usar el AuthContext
  const { 
    Login: loginUser, 
    logOut, 
    user, 
    isLoggedIn, 
    isLoading,
    auth 
  } = useAuth();

  // Hook de ventas - removido ya que usamos fetch directo
  // const { getSales } = useSales();

  // Cargar historial de ventas cuando el usuario esté logueado
  useEffect(() => {
    if (isLoggedIn && user?.id && activeTab === 'orders') {
      loadUserSales();
    }
  }, [isLoggedIn, user?.id, activeTab]);

  const loadUserSales = async () => {
    try {
      setLoadingSales(true);
      
      // Obtener ventas filtradas por cliente
      const response = await fetch(`http://localhost:4000/api/sales?clientId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserSales(data.sales || []);
      } else {
        console.error('Error loading sales:', response.statusText);
        setUserSales([]);
      }
    } catch (error) {
      console.error('Error loading user sales:', error);
      setUserSales([]);
    } finally {
      setLoadingSales(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(formData.email, formData.password);
    
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      }
      
      // Redirigir a home
      navigate('/');
    }
    // Los errores ya se manejan en el AuthContext con toast
  };

  const handleLogout = async () => {
    const success = await logOut();
    if (success) {
      localStorage.removeItem('rememberLogin');
      setUserSales([]); // Limpiar datos de ventas
      navigate('/'); // Redirigir a home
    }
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="text-yellow-500" />;
      case 'Processing':
        return <FaSpinner className="text-blue-500" />;
      case 'Shipped':
        return <FaTruck className="text-purple-500" />;
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Función para ver detalles de una orden
  const viewOrderDetails = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSale(null);
  };

  // Si el usuario está logueado, mostrar perfil con pestañas
  if (isLoggedIn && user) {
    return (
      <div className="page-container">
        <div className="login-page">
          <div className="login-container">
            <div className="login-left" style={{ minHeight: '600px' }}>
              <div className="login-header">
                <div className="logoLogin">
                  <img src={logo} alt="EcoGarden Logo" className="logoLogin-img" />
                  <h1>EcoGarden</h1>
                </div>
                <h2>Bienvenido de vuelta, {user.name}</h2>
              </div>

              {/* Navegación por pestañas */}
              <div className="profile-tabs" style={{ marginBottom: '2rem' }}>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    marginRight: '0.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: activeTab === 'profile' ? '#22c55e' : '#f3f4f6',
                    color: activeTab === 'profile' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaUserCircle style={{ marginRight: '0.5rem' }} />
                  Mi Perfil
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: activeTab === 'orders' ? '#22c55e' : '#f3f4f6',
                    color: activeTab === 'orders' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaShoppingBag style={{ marginRight: '0.5rem' }} />
                  Mis Órdenes
                </button>
              </div>

              {/* Contenido de la pestaña activa */}
              {activeTab === 'profile' && (
                <div className="profile-section">
                  <FaUserCircle className="profile-icon" size={80} />
                  <div className="profile-info">
                    <p><strong>Nombre:</strong> {auth.userFullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {user.telephone}</p>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="orders-section" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
                    Historial de Órdenes ({userSales.length})
                  </h3>
                  
                  {loadingSales ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <FaSpinner className="animate-spin" size={32} style={{ color: '#22c55e' }} />
                      <p style={{ marginTop: '1rem', color: '#6b7280' }}>Cargando órdenes...</p>
                    </div>
                  ) : userSales.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <FaShoppingBag size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                      <p style={{ color: '#6b7280' }}>No tienes órdenes aún</p>
                      <Link 
                        to="/Products" 
                        style={{ 
                          color: '#22c55e', 
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        ¡Explora nuestros productos!
                      </Link>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {userSales.map((sale) => (
                        <div 
                          key={sale._id} 
                          className="order-item"
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            marginBottom: '1rem',
                            backgroundColor: 'white'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: '0.75rem'
                          }}>
                            <div>
                              <p style={{ 
                                fontWeight: '600', 
                                color: '#374151',
                                marginBottom: '0.25rem'
                              }}>
                                Orden #{sale._id.slice(-6).toUpperCase()}
                              </p>
                              <p style={{ 
                                fontSize: '0.875rem', 
                                color: '#6b7280',
                                marginBottom: '0.5rem'
                              }}>
                                {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <span 
                              className={`status-badge ${getStatusColor(sale.status)}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                border: '1px solid'
                              }}
                            >
                              {getStatusIcon(sale.status)}
                              <span style={{ marginLeft: '0.5rem' }}>{sale.status}</span>
                            </span>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                          }}>
                            <div>
                              <p style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '600', 
                                color: '#22c55e'
                              }}>
                                ${sale.total.toFixed(2)}
                              </p>
                              <p style={{ 
                                fontSize: '0.875rem', 
                                color: '#6b7280'
                              }}>
                                {sale.idShoppingCart?.products?.length || 0} productos
                              </p>
                            </div>
                            <button
                              onClick={() => viewOrderDetails(sale)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                color: '#374151',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#e5e7eb';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#f3f4f6';
                              }}
                            >
                              <FaEye style={{ marginRight: '0.5rem' }} />
                              Ver detalles
                            </button>
                          </div>

                          {/* Información de entrega */}
                          <div style={{ 
                            marginTop: '0.75rem', 
                            paddingTop: '0.75rem', 
                            borderTop: '1px solid #f3f4f6'
                          }}>
                            <p style={{ 
                              fontSize: '0.875rem', 
                              color: '#6b7280'
                            }}>
                              <strong>Entrega:</strong> {sale.address}, {sale.city}, {sale.department}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleLogout} 
                className="submit-button logout-button"
                disabled={isLoading}
                style={{ marginTop: '2rem' }}
              >
                <FaSignOutAlt /> {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
            </div>

            <div className="login-right">
              <div className="image-overlay"></div>
              <img 
                src="https://cdn.pixabay.com/photo/2019/03/16/03/37/plants-4058406_960_720.jpg" 
                alt="Plantas naturales" 
                className="background-img"
              />
            </div>
          </div>
        </div>

        {/* Modal de detalles de orden */}
        <OrderDetailsModal 
          sale={selectedSale}
          isOpen={showModal}
          onClose={closeModal}
        />
      </div>
    );
  }

  // Formulario de login (sin cambios)
  return (
    <div className="page-container">
      <div className="login-page">
        <div className="login-container">
          <div className="login-left">
            <div className="login-header">
              <div className="logoLogin">
                <img src={logo} alt="EcoGarden Logo" className="logoLogin-img" />
                <h1>EcoGarden</h1>
              </div>
              <h2>Bienvenido de vuelta</h2>
              <p className="login-subtitle">Inicia sesión para acceder a tu cuenta</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder="correo@gmail.com" 
                  className="login-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password"
                  name="password"
                  placeholder="••••••••" 
                  className="login-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="login-options">
                <Link to="/forgot-password" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="register-section">
              <p>¿No tienes una cuenta? <Link to="/register" className="register-link">Regístrate aquí</Link></p>
            </div>
          </div>

          <div className="login-right">
            <div className="image-overlay"></div>
            <img 
              src="https://cdn.pixabay.com/photo/2019/03/16/03/37/plants-4058406_960_720.jpg" 
              alt="Plantas naturales" 
              className="background-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
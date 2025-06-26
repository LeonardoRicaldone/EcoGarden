import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import OrderDetailsModal from '../components/OrderDetailsModal';

const Login = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userSales, setUserSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur'
  });

  // Usar el AuthContext
  const { 
    Login: loginUser, 
    logOut, 
    user, 
    isLoggedIn, 
    isLoading,
    auth 
  } = useAuth();

  // Cargar historial de ventas cuando el usuario esté logueado
  useEffect(() => {
    if (isLoggedIn && user?.id && activeTab === 'orders') {
      loadUserSales();
    }
  }, [isLoggedIn, user?.id, activeTab]);

  const loadUserSales = async () => {
    try {
      setLoadingSales(true);
      
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

  // Validaciones para React Hook Form
  const validations = {
    email: {
      required: 'El correo electrónico es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de correo electrónico inválido'
      }
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  };

  // Manejar envío del formulario
  const onSubmit = async (formData) => {
    const result = await loginUser(formData.email, formData.password);
    
    if (result.success) {
      // Limpiar formulario
      reset();
      
      // Redirigir a home
      navigate('/');
    }
    // Los errores ya se manejan en el AuthContext con toast
  };

  const handleLogout = async () => {
    const success = await logOut();
    if (success) {
      setUserSales([]);
      navigate('/');
    }
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="status-icon status-pending" />;
      case 'Processing':
        return <FaSpinner className="status-icon status-processing" />;
      case 'Shipped':
        return <FaTruck className="status-icon status-shipped" />;
      case 'Delivered':
        return <FaCheckCircle className="status-icon status-delivered" />;
      case 'Cancelled':
        return <FaTimesCircle className="status-icon status-cancelled" />;
      default:
        return <FaClock className="status-icon status-default" />;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
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
            <div className="login-left profile-view">
              <div className="login-header">
                <div className="logoLogin">
                  <img src={logo} alt="EcoGarden Logo" className="logoLogin-img" />
                  <h1>EcoGarden</h1>
                </div>
                <h2>Bienvenido de vuelta, {user.name}</h2>
              </div>

              {/* Navegación por pestañas */}
              <div className="profile-tabs">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                >
                  <FaUserCircle className="tab-icon" />
                  Mi Perfil
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                >
                  <FaShoppingBag className="tab-icon" />
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
                <div className="orders-section">
                  <h3 className="orders-title">
                    Historial de Órdenes ({userSales.length})
                  </h3>
                  
                  {loadingSales ? (
                    <div className="loading-container">
                      <FaSpinner className="loading-spinner" size={32} />
                      <p className="loading-text">Cargando órdenes...</p>
                    </div>
                  ) : userSales.length === 0 ? (
                    <div className="empty-orders">
                      <FaShoppingBag size={48} className="empty-icon" />
                      <p className="empty-text">No tienes órdenes aún</p>
                      <Link to="/Products" className="explore-link">
                        ¡Explora nuestros productos!
                      </Link>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {userSales.map((sale) => (
                        <div key={sale._id} className="order-item">
                          <div className="order-header">
                            <div className="order-info">
                              <p className="order-number">
                                Orden #{sale._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="order-date">
                                {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <span className={`status-badge ${getStatusColor(sale.status)}`}>
                              {getStatusIcon(sale.status)}
                              <span className="status-text">{sale.status}</span>
                            </span>
                          </div>

                          <div className="order-details">
                            <div className="order-summary">
                              <p className="order-total">${sale.total.toFixed(2)}</p>
                              <p className="order-products">
                                {sale.idShoppingCart?.products?.length || 0} productos
                              </p>
                            </div>
                            <button
                              onClick={() => viewOrderDetails(sale)}
                              className="view-details-btn"
                            >
                              <FaEye className="btn-icon" />
                              Ver detalles
                            </button>
                          </div>

                          {/* Información de entrega */}
                          <div className="delivery-info">
                            <p className="delivery-text">
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

  // Formulario de login con React Hook Form
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

            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email"
                  {...register('email', validations.email)}
                  placeholder="correo@gmail.com" 
                  className={`login-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password"
                  {...register('password', validations.password)}
                  placeholder="••••••••" 
                  className={`login-input ${errors.password ? 'input-error' : ''}`}
                />
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>

              <div className="login-options">
                <Link to="/PasswordRecovery" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="register-section">
              <p>
                ¿No tienes una cuenta? 
                <Link to="/register" className="register-link">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Sección adicional para recuperación de contraseña */}
            <div className="password-recovery-section">
              <p className="recovery-text">
                ¿Problemas para acceder?
              </p>
              <Link to="/PasswordRecovery" className="recovery-button">
                Recuperar mi cuenta
              </Link>
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
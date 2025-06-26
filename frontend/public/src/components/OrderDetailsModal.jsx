import React from 'react';
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCreditCard,
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaSpinner,
  FaTimesCircle
} from 'react-icons/fa';

const OrderDetailsModal = ({ sale, isOpen, onClose }) => {
  if (!isOpen || !sale) return null;

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

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '0',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#111827',
              margin: 0
            }}>
              Detalles de la Orden
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem',
              margin: '0.25rem 0 0 0'
            }}>
              #{sale._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6b7280';
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          padding: '1.5rem',
          maxHeight: 'calc(90vh - 120px)',
          overflowY: 'auto'
        }}>
          {/* Estado y fecha */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <span 
              className={`status-badge ${getStatusColor(sale.status)}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '1px solid'
              }}
            >
              {getStatusIcon(sale.status)}
              <span style={{ marginLeft: '0.5rem' }}>{sale.status}</span>
            </span>
            
            <div style={{ textAlign: 'right' }}>
              <p style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: 0
              }}>
                <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Información de contacto */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.75rem'
            }}>
              Información de Contacto
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0
              }}>
                <strong>Nombre:</strong> {sale.name} {sale.lastname}
              </p>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaPhone style={{ marginRight: '0.5rem' }} />
                {sale.phone}
              </p>
            </div>
          </div>

          {/* Dirección de entrega */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
              Dirección de Entrega
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {sale.address}<br />
              {sale.city}, {sale.department}<br />
              Código Postal: {sale.zipCode}
            </p>
          </div>

          {/* Productos */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaShoppingCart style={{ marginRight: '0.5rem' }} />
              Productos ({sale.idShoppingCart?.products?.length || 0})
            </h3>
            
            {sale.idShoppingCart?.products && sale.idShoppingCart.products.length > 0 ? (
              <div style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                {sale.idShoppingCart.products.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      borderBottom: index < sale.idShoppingCart.products.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <img
                      src={item.idProduct?.imgProduct || '/placeholder-image.jpg'}
                      alt={item.idProduct?.name || 'Producto'}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        marginRight: '1rem'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const placeholder = document.createElement('div');
                        placeholder.style.width = '60px';
                        placeholder.style.height = '60px';
                        placeholder.style.backgroundColor = '#f3f4f6';
                        placeholder.style.borderRadius = '0.5rem';
                        placeholder.style.marginRight = '1rem';
                        placeholder.style.display = 'flex';
                        placeholder.style.alignItems = 'center';
                        placeholder.style.justifyContent = 'center';
                        placeholder.style.fontSize = '0.75rem';
                        placeholder.style.color = '#6b7280';
                        placeholder.textContent = 'Sin imagen';
                        parent.insertBefore(placeholder, e.target);
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontWeight: '500', 
                        color: '#374151',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {item.idProduct?.name || 'Producto no encontrado'}
                      </p>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280',
                        margin: 0
                      }}>
                        Cantidad: {item.quantity} × ${item.idProduct?.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontWeight: '600', 
                        color: '#22c55e',
                        margin: 0
                      }}>
                        ${item.subtotal?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ 
                color: '#6b7280', 
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '2rem'
              }}>
                No se encontraron productos en esta orden
              </p>
            )}
          </div>

          {/* Información de pago */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaCreditCard style={{ marginRight: '0.5rem' }} />
              Información de Pago
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              margin: 0
            }}>
              <strong>Tarjeta:</strong> **** **** **** {sale.creditCard?.slice(-4) || '****'}
            </p>
          </div>

          {/* Resumen de totales */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.75rem'
            }}>
              Resumen de la Orden
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <span>Subtotal:</span>
                <span>${(sale.total - (sale.total >= 70 ? 0 : 4)).toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <span>Envío:</span>
                <span>
                  {sale.total >= 70 ? (
                    <span style={{ color: '#22c55e', fontWeight: '500' }}>GRATIS</span>
                  ) : (
                    '$4.00'
                  )}
                </span>
              </div>
              
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827'
              }}>
                <span>Total:</span>
                <span style={{ color: '#22c55e' }}>${sale.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#16a34a';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#22c55e';
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
import React from "react";
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaCreditCard, 
  FaFileAlt,
  FaCalendarAlt,
  FaSyncAlt
} from "react-icons/fa";

const CardSale = ({ sale }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Procesando': 'bg-blue-100 text-blue-800 border-blue-200',
      'Enviado': 'bg-purple-100 text-purple-800 border-purple-200',
      'Entregado': 'bg-green-100 text-green-800 border-green-200',
      'Cancelado': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header de la tarjeta */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            {sale.name} {sale.lastname}
          </h3>
          <p className="text-sm text-gray-500">
            ID: {sale._id?.slice(-8) || 'N/A'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sale.status)}`}>
          {sale.status}
        </span>
      </div>
      
      {/* Información de contacto */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FaPhone className="text-gray-400 text-sm" />
          <span className="text-gray-700">{sale.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FaMapMarkerAlt className="text-gray-400 text-sm" />
          <span className="text-gray-700">{sale.city}, {sale.department}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FaEnvelope className="text-gray-400 text-sm" />
          <span className="text-gray-700">CP: {sale.zipCode}</span>
        </div>
      </div>

      {/* Dirección */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Dirección:</span> {sale.address || 'N/A'}
        </p>
      </div>

      {/* Información de pago */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex items-center gap-2 text-sm">
          <FaCreditCard className="text-gray-400 text-sm" />
          <span className="text-gray-700">
            Tarjeta: ****{String(sale.creditCard).slice(-4)}
          </span>
        </div>
      </div>

      {/* Fechas */}
      <div className="border-t pt-3 text-xs text-gray-500">
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400" />
            Creada: {formatDate(sale.createdAt)}
          </span>
          {sale.updatedAt && (
            <span className="flex items-center gap-1">
              <FaSyncAlt className="text-gray-400" />
              Actualizada: {formatDate(sale.updatedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSale;
import React, { useState } from "react";
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaCreditCard, 
  FaCalendarAlt,
  FaSyncAlt,
  FaCheck,
  FaEdit,
  FaTimes,
  FaDollarSign
} from "react-icons/fa";

const CardSale = ({ sale, updateSaleStatus }) => {
  // useState para manejar el estado de edición, el nuevo estado y si se está actualizando
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(sale.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = ['pendiente', 'recibido'];

  // Función para obtener el color del estado basado en el valor
  const getStatusColor = (status) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'recibido': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Función para formatear la fecha
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

  // Función para formatear el precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Función para manejar la actualización del estado
  const handleStatusUpdate = async () => {
    if (newStatus === sale.status) {
      setIsEditing(false);
      return;
    }

    // Validar que el nuevo estado sea diferente al actual
    setIsUpdating(true);
    try {
      // Aquí se llamaría a la función para actualizar el estado de la venta
      const success = await updateSaleStatus(sale._id, newStatus);
      if (success) {
        setIsEditing(false);
        sale.status = newStatus;
      } else {
        // Si falla, revertir el estado
        setNewStatus(sale.status);
        alert('Error al actualizar el estado. Inténtalo de nuevo.');
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al actualizar:", error);
      setNewStatus(sale.status);
      alert('Error al actualizar el estado. Inténtalo de nuevo.');
    } finally {
      // Restablecer el estado de actualización
      setIsUpdating(false);
    }
  };

  // Función para manejar la cancelación de la edición
  const handleCancelEdit = () => {
    setNewStatus(sale.status);
    setIsEditing(false);
  };

  // Función para iniciar la edición del estado
  const handleStartEdit = () => {
    setNewStatus(sale.status);
    setIsEditing(true);
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
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <select
                value={newStatus}
                // Selecciona el nuevo estado
                onChange={(e) => setNewStatus(e.target.value)}
                className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(newStatus)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isUpdating}
              >
                {statusOptions.map(option => (
                  // Mapea las opciones de estado
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <button
                // Maneja la actualización del estado
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Guardar cambios"
              >
                {isUpdating ? (
                  <FaSyncAlt className="text-sm animate-spin" />
                ) : (
                  <FaCheck className="text-sm" />
                )}
              </button>
              <button
                // Cancela la edición
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancelar"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sale.status)}`}>
                {/* Muestra el estado con la primera letra en mayúscula */}
                {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
              </span>
              <button
                // Inicia la edición del estado
                onClick={handleStartEdit}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Editar estado"
              >
                <FaEdit className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
      
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

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Dirección:</span> {sale.address || 'N/A'}
        </p>
      </div>

      {/* Campo Total añadido */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex items-center gap-2 text-sm">
          <FaDollarSign className="text-black-500 text-sm" />
          <span className="text-gray-700 font-medium">
            Total: {formatPrice(sale.total)}
          </span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex items-center gap-2 text-sm">
          <FaCreditCard className="text-gray-400 text-sm" />
          <span className="text-gray-700">
            Tarjeta: ****{String(sale.creditCard).slice(-4)}
          </span>
        </div>
      </div>

      <div className="border-t pt-3 text-xs text-gray-500">
        <div className="flex justify-between">
         
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
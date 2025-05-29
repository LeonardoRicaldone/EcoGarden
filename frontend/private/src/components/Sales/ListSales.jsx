import React from "react";
import CardSale from "./CardSale";
import { FaFileAlt, FaSpinner, FaDollarSign } from "react-icons/fa";

const ListSales = ({ sales, loading, filteredCount, totalSales, updateSaleStatus, totalRevenue, filteredRevenue }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        <span className="ml-3 text-gray-600">Cargando ventas...</span>
      </div>
    );
  }

  // Función para formatear el precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div>
      {/* Estadísticas */}
      <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Ventas Mostradas</div>
            <div className="text-xl font-bold text-blue-800">{filteredCount}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 font-medium">Total Ventas</div>
            <div className="text-xl font-bold text-green-800">{totalSales}</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-600 font-medium flex items-center justify-center gap-1">
              <FaDollarSign className="text-xs" />
              Ingresos Mostrados
            </div>
            <div className="text-xl font-bold text-purple-800">{formatPrice(filteredRevenue)}</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm text-orange-600 font-medium flex items-center justify-center gap-1">
              <FaDollarSign className="text-xs" />
              Ingresos Totales
            </div>
            <div className="text-xl font-bold text-orange-800">{formatPrice(totalRevenue)}</div>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      {sales.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaFileAlt className="text-5xl mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No se encontraron ventas
          </h3>
          <p className="text-gray-500">
            No hay ventas que coincidan con tu búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sales.map((sale) => (
            <CardSale 
              key={sale._id} 
              sale={sale} 
              updateSaleStatus={updateSaleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSales;
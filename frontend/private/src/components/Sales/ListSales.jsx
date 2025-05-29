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
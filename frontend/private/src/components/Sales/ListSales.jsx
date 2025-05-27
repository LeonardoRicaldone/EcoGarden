import React from "react";
import CardSale from "./CardSale";

const ListSales = ({ sales, loading, filteredCount, totalSales }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando ventas...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Estadísticas */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando {filteredCount} de {totalSales} ventas
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600 font-medium">
            Total ventas: {totalSales.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Lista de ventas */}
      {sales.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <span className="text-6xl">📋</span>
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
            <CardSale key={sale._id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSales;
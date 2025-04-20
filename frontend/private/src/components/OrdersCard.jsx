import React from "react";

const OrdersCard = ({ name, date, imageUrl }) => {
  return (
    <div className="bg-white border border-green-300 rounded-2xl p-4 w-64 flex flex-col items-center shadow-md hover:shadow-lg transition">
      {/* Imagen */}
      <div className="w-full flex justify-center mb-2">
        <img
          src={imageUrl}
          alt={name}
          className="h-40 object-contain rounded"
        />
      </div>

      {/* Nombre y fecha */}
      <div className="text-center">
        <h3 className="text-teal-900 font-semibold text-md leading-snug">
          {name}
        </h3>
        <p className="text-sm text-green-900 font-medium mt-1">{date}</p>
      </div>

      {/* Botones */}
      <div className="mt-3 w-full flex flex-col gap-2">
        <button className="bg-green-100 text-green-800 rounded-xl py-1 text-sm font-semibold hover:bg-green-200 transition">
          Ver detalles
        </button>
        <button className="bg-green-200 text-green-900 rounded-xl py-1 text-sm font-semibold hover:bg-green-300 transition">
          Estado
        </button>
      </div>
    </div>
  );
};

export default OrdersCard;

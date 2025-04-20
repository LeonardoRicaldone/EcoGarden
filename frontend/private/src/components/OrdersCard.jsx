import React from "react";

const OrdersCard = ({ name, date, imageUrl }) => {
  return (
    <div className="border border-green-200 rounded-2xl p-4 w-64 shadow-sm flex flex-col items-center text-center gap-2">
      <img
        src={imageUrl}   // Aquí ya coincide con 'imageUrl'
        alt={name}       // Aquí ya coincide con 'name'
        className="w-32 h-32 object-cover rounded"  // Cambié 'class' por 'className'
      />
      <h3 className="text-teal-900 font-medium text-lg">{name}</h3>

      <div className="text-teal-900 text-sm">
        <span>{date}</span>
      </div>

      <div className="mt-2 flex flex-col gap-2 w-full">
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

import React from "react";

const OrdersCard = ({ name, date, imageUrl }) => {
  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 w-64 flex flex-col items-center shadow-sm hover:shadow-md transition">
      {/* Imagen */}
      <div className="w-full h-48 flex justify-center mb-3">
        <img
          src={imageUrl}
          alt={name}
          className="h-full object-cover rounded-md"
        />
      </div>
      
      {/* Nombre */}
      <div className="text-center w-full">
        <h3 className="text-green-700 font-medium text-lg mb-2">
          {name}
        </h3>
      </div>
      
      {/* Fecha */}
      <div className="flex items-center justify-center mb-3">
        <span className="text-gray-600 text-sm">{date}</span>
      </div>
      
      {/* Botones */}
      <div className="mt-2 w-full flex flex-col gap-2">
        <button className="bg-green-100 text-green-700 rounded-full py-1 text-sm font-medium hover:bg-green-200 transition">
          Ver detalles
        </button>
        <button className="bg-green-100 text-green-700 rounded-full py-1 text-sm font-medium hover:bg-green-200 transition flex items-center justify-center">
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
          Estado
        </button>
      </div>
    </div>
  );
};

export default OrdersCard;

import React from "react";

const ModalEmployee = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
        <h3>Registro empleados</h3> <br />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalEmployee;
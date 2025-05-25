import React from "react";

const CardEmployee = ({ employee, deleteEmployee, setEditingEmployee, setShowModal }) => {
  return (
    <div className="border p-4 rounded shadow w-64 bg-white">
      <h2 className="font-bold">{employee.name} {employee.lastname}</h2>
      <p>Tel: {employee.phone}</p>
      <p>Email: {employee.email}</p>
      <p>Password: {employee.password}</p>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-yellow-400 text-white px-2 py-1 rounded"
          onClick={() => {
            setEditingEmployee(employee);
            setShowModal(true);
          }}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => deleteEmployee(employee._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CardEmployee;
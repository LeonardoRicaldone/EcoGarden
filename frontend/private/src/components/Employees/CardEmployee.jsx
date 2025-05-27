import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const CardEmployee = ({ employee, deleteEmployee, setEditingEmployee, setShowModal }) => {
  const handleDelete = () => {
    Swal.fire({
      title: "¿Eliminar empleado?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(employee._id);
        Swal.fire("Eliminado", "El empleado ha sido eliminado.", "success");
      }
    });
  };

  return (
    <div className="relative border p-4 rounded shadow w-64 bg-white">
      {/* Botones arriba a la derecha */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => {
            setEditingEmployee(employee);
            setShowModal(true);
          }}
          className="text-yellow-500 hover:text-yellow-600"
          title="Editar"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h2 className="font-bold mt-6 text-lg">{employee.name} {employee.lastname}</h2>

<p>
  <span className="font-bold text-slate-600">Tel:</span>{" "}
  <span className="text-gray-800">{employee.phone}</span>
</p>
<p>
  <span className="font-bold text-slate-600">Email:</span>{" "}
  <span className="text-gray-800">{employee.email}</span>
</p>
<p>
  <span className="font-bold text-slate-600">Password:</span>{" "}
  <span className="text-gray-800">{employee.password}</span>
</p>
    </div>
  );
};

export default CardEmployee;
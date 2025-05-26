import React from "react";
import CardEmployee from "../Employees/CardEmployee";

const ListEmployees = ({
  deleteEmployee,
  updateEmployees,
  loading,
  employees,
  setEditingEmployee,
  setShowModal
}) => {
  return (
    <>
    <div className="w-full h-[50vh] overflow-y-auto px-4">
      <h1 className="text-2xl font-bold underline text-center mb-4">Listado de empleados</h1>

      {loading && <div className="text-center text-gray-500">Cargando...</div>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {employees?.map((employee) => (
          <CardEmployee
            key={employee._id}
            employee={employee}
            deleteEmployee={deleteEmployee}
            setEditingEmployee={setEditingEmployee}
            setShowModal={setShowModal}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default ListEmployees;
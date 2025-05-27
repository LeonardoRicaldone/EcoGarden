import Header from "../components/Header";
import "./Employees.css";
import Searcher from "../components/Searcher";
import React, { useState, useEffect } from "react";
import RegisterEmployees from "../components/Employees/RegisterEmployees";
import ListEmployees from "../components/Employees/ListEmployees";
import Modal from "../components/Employees/ModalEmployee";
import { Toaster } from "react-hot-toast";
import useDataEmployees from "../components/Employees/hooks/useDataEmployees";

const Employees = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    id, setId,
    name, setName,
    lastname, setLastName,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    employees,
    loading,
    saveEmployee,
    handleEdit,
    deleteEmployee,
    resetForm,
  } = useDataEmployees();

  // Función para manejar el cambio en el campo teléfono
  const handlePhoneChange = (value) => {
    // Solo permite números, espacios, guiones y paréntesis
    const phoneRegex = /^[0-9\s\-\(\)]*$/;
    if (phoneRegex.test(value)) {
      setPhone(value);
    }
  };

  // Función alternativa más estricta (solo números)
  const handlePhoneChangeStrict = (value) => {
    // Solo permite números
    const phoneRegex = /^[0-9]*$/;
    if (phoneRegex.test(value)) {
      setPhone(value);
    }
  };

// Efecto para cargar los datos del empleado en el formulario cuando se edita
  // Este efecto se ejecuta cuando editingEmployee cambia
  useEffect(() => {
    if (editingEmployee) {
      setId(editingEmployee._id);
      setName(editingEmployee.name);
      setLastName(editingEmployee.lastname);
      setPhone(editingEmployee.phone);
      setEmail(editingEmployee.email);
      setPassword(editingEmployee.password);
    }
  }, [editingEmployee]);

  const handleSubmit = () => {
    if (id) {
      handleEdit();
    } else {
      saveEmployee();
    }
    setShowModal(false);
  };

  return (
    <div className="employees-container">
      <Header title="Employees" />
      <Searcher placeholder="Buscar empleados" />

      <div className="w-full bg-white shadow-md rounded-lg p-6">

        <button
          onClick={() => {
            // Resetea el formulario y abre el modal para crear un nuevo empleado
            setEditingEmployee(null);
            resetForm();
            setShowModal(true);
          }}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Empleado
        </button>

        <ListEmployees
        // lista de empleados, funciones para editar y eliminar
          deleteEmployee={deleteEmployee}
          employees={employees}
          loading={loading}
          setEditingEmployee={setEditingEmployee}
          setShowModal={setShowModal}
        />

        {/* Modal para registrar o editar empleados */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <RegisterEmployees
            name={name}
            setName={setName}
            lastname={lastname}
            setLastName={setLastName}
            phone={phone}
            setPhone={handlePhoneChangeStrict} // Usa la función de validación
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
        </Modal>
      </div>
      <Toaster toastOptions={{ duration: 1000 }} />
    </div>
  );
};

export default Employees;
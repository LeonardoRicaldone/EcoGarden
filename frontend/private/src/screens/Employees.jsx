import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./Employees.css";
import Searcher from "../components/Searcher";
import RegisterEmployees from "../components/Employees/RegisterEmployees";
import ListEmployees from "../components/Employees/ListEmployees";
import Modal from "../components/Employees/ModalEmployee";
// import { Toaster } from "react-hot-toast"; // Removido para evitar duplicados
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

  // Función para manejar el cambio en el campo teléfono (solo números)
  const handlePhoneChangeStrict = (value) => {
    const phoneRegex = /^[0-9]*$/;
    if (phoneRegex.test(value)) {
      setPhone(value);
    }
  };

  // Efecto para cargar los datos del empleado en el formulario cuando se edita
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

      {/* Botón sin contenedor - directamente en el fondo */}
      <button
        onClick={() => {
          setEditingEmployee(null);
          resetForm();
          setShowModal(true);
        }}
        className="new-employee-btn"
      >
        <i className="material-icons">add</i>
        Nuevo Empleado
      </button>

      {/* Lista de empleados - directamente en el fondo */}
      <ListEmployees
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
          setPhone={handlePhoneChangeStrict}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </Modal>

      {/* Toaster removido - debe estar solo en App.js o componente raíz */}
    </div>
  );
};

export default Employees;
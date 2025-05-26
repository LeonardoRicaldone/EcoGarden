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
            setEditingEmployee(null);
            resetForm();
            setShowModal(true);
          }}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Empleado
        </button>

        <ListEmployees
          deleteEmployee={deleteEmployee}
          employees={employees}
          loading={loading}
          setEditingEmployee={setEditingEmployee}
          setShowModal={setShowModal}
        />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <RegisterEmployees
            name={name}
            setName={setName}
            lastname={lastname}
            setLastName={setLastName}
            phone={phone}
            setPhone={setPhone}
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


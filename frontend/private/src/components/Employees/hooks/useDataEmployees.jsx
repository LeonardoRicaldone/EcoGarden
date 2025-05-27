import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useDataEmployees = () => {
  // Estados para manejar los datos del formulario y la lista de empleados
  const [id, setId] = useState("");
  const [nameEmployee, setNameEmployee] = useState("");
  const [lastnameEmployee, setLastnameEmployee] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL fija directamente en el código
  const API = "http://localhost:4000/api/employees";

  // Función para obtener empleados del backend
  // Esta función se ejecuta al cargar el componente
  const fetchEmployees = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener empleados", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const saveEmployee = async () => {
    const newEmployee = {
      name: nameEmployee,
      lastname: lastnameEmployee,
      phone,
      email,
      password,
    };

    try {
      // Verificar si el ID está vacío para determinar si es un nuevo registro
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) throw new Error();
      toast.success("Empleado registrado");
      fetchEmployees();
      resetForm();
    } catch {
      toast.error("Error al registrar el empleado");
    }
  };
// Función para eliminar un empleado
  const deleteEmployee = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      toast.success("Empleado eliminado");
      fetchEmployees();
    } catch {
      toast.error("Error al eliminar empleado");
    }
  };
// Función para editar un empleado
  const handleEdit = async () => {
    const editEmployee = {
      name: nameEmployee,
      lastname: lastnameEmployee,
      phone,
      email,
      password,
    };

    try {
      // Verificar si el ID está vacío para determinar si es un nuevo registro
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editEmployee),
      });
      if (!response.ok) throw new Error();
      toast.success("Empleado actualizado");
      fetchEmployees();
      resetForm();
    } catch {
      toast.error("Error al actualizar empleado");
    }
  };

  const resetForm = () => {
    setId("");
    setNameEmployee("");
    setLastnameEmployee("");
    setPhone("");
    setEmail("");
    setPassword("");
  };

  return {
    id,
    setId,
    name: nameEmployee,
    setName: setNameEmployee,
    lastname: lastnameEmployee,
    setLastName: setLastnameEmployee,
    phone,
    setPhone,
    email,
    setEmail,
    password,
    setPassword,
    employees,
    loading,
    saveEmployee,
    handleEdit,
    deleteEmployee,
    resetForm,
  };
};

export default useDataEmployees;
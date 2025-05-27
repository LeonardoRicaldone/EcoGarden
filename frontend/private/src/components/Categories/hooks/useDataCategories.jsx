import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useDataCategories = () => {
  // Estados para manejar los datos del formulario y la lista de categorías
  const [id, setId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL de tu API para categorías
  const API = "http://localhost:4000/api/categories";

  const fetchCategories = async () => {
    try {
      // Obtener categorías del backend
      const response = await fetch(API);
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener categorías", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveCategory = async () => {
    // Validar que el nombre de la categoría no esté vacío
    if (!categoryName.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    // Crear un nuevo objeto de categoría
    const newCategory = {
      name: categoryName.trim(),
    };

    try {
      // Verificar si el ID está vacío para determinar si es un nuevo registro
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) throw new Error();
      toast.success("Categoría registrada");
      fetchCategories();
      resetForm();
    } catch {
      toast.error("Error al registrar la categoría");
    }
  };


  // Función para eliminar una categoría
  const deleteCategory = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      toast.success("Categoría eliminada");
      fetchCategories();
    } catch {
      toast.error("Error al eliminar categoría");
    }
  };


  // Función para editar una categoría
  const handleEdit = async () => {
    if (!categoryName.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    const editCategory = {
      name: categoryName.trim(),
    };

    try {
      // Verificar si el ID está vacío para determinar si es un nuevo registro
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      });
      if (!response.ok) throw new Error();
      toast.success("Categoría actualizada");
      fetchCategories();
      resetForm();
    } catch {
      toast.error("Error al actualizar categoría");
    }
  };

  const resetForm = () => {
    setId("");
    setCategoryName("");
  };

  return {
    id,
    setId,
    categoryName,
    setCategoryName,
    categories,
    loading,
    saveCategory,
    handleEdit,
    deleteCategory,
    resetForm,
  };
};

export default useDataCategories;
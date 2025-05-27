import React from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const CardCategory = ({ category, deleteCategory, setEditingCategory, setShowModal }) => {
  const handleEdit = () => {
    setEditingCategory(category);
    setShowModal(true);
  };

 const handleDelete = async () => {
  const result = await Swal.fire({
    title: `Eliminar categoría`,
    html: `¿Estás seguro de que deseas eliminar <strong>"${category.name}"</strong>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    backdrop: `
      rgba(0,0,0,0.5)
      url("/images/trash-icon.gif")
      left top
      no-repeat
    `
  });

  if (result.isConfirmed) {
    try {
      await deleteCategory(category._id);
      await Swal.fire(
        '¡Eliminado!',
        `La categoría "${category.name}" ha sido eliminada.`,
        'success'
      );
    } catch (error) {
      await Swal.fire(
        'Error',
        'Ocurrió un error al eliminar la categoría',
        'error'
      );
    }
  }
};

  return (
    <div className="categoria-item">
      <span>🌱</span> {category.name}
      <div className="categoria-actions">
        <button
          className="edit-button"
          onClick={handleEdit}
        >
          Editar
        </button>
        <button
          className="delete-button"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CardCategory;
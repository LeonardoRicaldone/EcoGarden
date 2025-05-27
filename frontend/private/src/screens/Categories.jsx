import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Categories.css";
import HeaderProducts from '../components/HeaderProducts';
import CardCategory from '../components/Categories/CardCategorie';
import useDataCategories from '../components/Categories/hooks/useDataCategories';

const Categories = () => {
  const {
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
  } = useDataCategories();

  const handleSubmit = () => {
    if (id) {
      handleEdit();
    } else {
      saveCategory();
    }
  };

  const setEditingCategory = (category) => {
    setId(category._id);
    setCategoryName(category.name);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <>
      <div className="productos-container">
        <HeaderProducts title={"Categories"} />

        {/* Contenido */}
        <div className="categorias-content">
          {/* Sección Agregar categoría */}
          <div className="agregar-categoria">
            <h2>{id ? "Editar categoría" : "Agregar categoría"}</h2>
            <label>Nombre de categoría</label>
            <input 
              type="text" 
              className="input-categoria" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ingresa el nombre de la categoría"
            />
            <div className="button-group">
              <button 
                className="registrar-button" 
                onClick={handleSubmit}
                disabled={!categoryName.trim()}
              >
                {id ? "Actualizar categoría" : "Agregar categoría"}
              </button>
              {id && (
                <button 
                  className="cancel-button" 
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Separador */}
          <div className="separador"></div>

          {/* Sección Listado */}
          <div className="listado-categorias">
            <h2>Listado de categorías</h2>
            {loading ? (
              <div className="loading">Cargando categorías...</div>
            ) : (
              <div className="categoria-lista">
                {categories.length === 0 ? (
                  <div className="no-categories">No hay categorías registradas</div>
                ) : (
                  categories.map((category) => (
                    <CardCategory
                      key={category._id}
                      category={category}
                      deleteCategory={deleteCategory}
                      setEditingCategory={setEditingCategory}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
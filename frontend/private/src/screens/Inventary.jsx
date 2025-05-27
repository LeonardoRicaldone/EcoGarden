import React from "react";
import ProductsCard from '../components/Products/ProductsCard';
import { Link } from "react-router-dom";
import "./Inventary.css";
import HeaderProducts from '../components/HeaderProducts';
import Searcher from '../components/Searcher';
import useDataProducts from '../components/Products/hooks/useDataProducts';
import { useCustomAlert } from '../components/CustomAlert'; // Importar el hook

const Inventary = () => {
  const {
    filteredProducts,
    categories,
    editingProduct,
    formData,
    selectedImage,
    imagePreview,
    handleSearch,
    handleInputChange,
    handleImageChange,
    updateProduct,
    deleteProduct,
    startEditProduct,
    resetForm
  } = useDataProducts();

  // Usar el hook de alertas personalizadas
  const { showSuccess, showError, showConfirm, AlertComponent } = useCustomAlert();

  // Manejar actualización del producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    const result = await updateProduct(editingProduct._id, formData, selectedImage);
    
    if (result.success) {
      showSuccess(
        '✨ ¡Producto Actualizado!',
        `Los cambios en "${formData.name}" se han guardado correctamente.`
      );
      resetForm(); // Cerrar modal después del éxito
    } else {
      showError(
        '❌ Error al Actualizar',
        result.message || 'No se pudieron guardar los cambios. Por favor, intenta nuevamente.'
      );
    }
  };

  // Manejar eliminación del producto con alerta de confirmación personalizada
  const handleDelete = async (product) => {
    // Mostrar alerta de confirmación personalizada
    const confirmed = await showConfirm({
      title: '🚨 ¿Eliminar Producto?',
      message: `¿Estás seguro de que deseas eliminar "${product.name}"?\n\nEsta acción no se puede deshacer y se perderá toda la información del producto.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar'
    });
    
    if (confirmed) {
      const result = await deleteProduct(product._id);
      
      if (result.success) {
        showSuccess(
          '🗑️ Producto Eliminado',
          `"${product.name}" ha sido eliminado del inventario exitosamente.`
        );
      } else {
        showError(
          '❌ Error al Eliminar',
          result.message || 'No se pudo eliminar el producto. Por favor, intenta nuevamente.'
        );
      }
    }
  };

  return (
    <>
      <div className="productos-container">
        <HeaderProducts title={"Inventary"} />

        <Searcher
          placeholder={"Buscar producto"}
          onSearch={handleSearch}
        />

        {editingProduct && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>✏️ Editar Producto</h2>
                <button className="close-btn" onClick={resetForm}>✕</button>
              </div>

              <form onSubmit={handleSubmit} className="edit-form">
                {/* Sección de imagen centrada */}
                <div className="image-section">
                  <div className="upload-box" onClick={() => document.getElementById('imageInput').click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="preview-image" />
                    ) : (
                      <div className="upload-icon">
                        <span style={{ fontSize: '2rem' }}>📷</span>
                        <span>Seleccionar imagen</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => document.getElementById('imageInput').click()}
                  >
                    📁 {selectedImage ? 'Cambiar imagen' : 'Subir imagen'}
                  </button>
                </div>

                {/* Campos del formulario en grilla */}
                <div className="form-fields">
                  <label className="form-field-full">
                    Nombre del producto
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ingrese el nombre del producto"
                      required
                    />
                  </label>

                  <label className="form-field-full">
                    Descripción
                    <textarea
                      name="descripcion"
                      rows="4"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Descripción detallada del producto..."
                    />
                  </label>

                  <label>
                    Categoría
                    <select
                      name="idCategory"
                      value={formData.idCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Precio ($)
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </label>

                  <label className="form-field-full">
                    Stock disponible
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="Cantidad en inventario"
                      min="0"
                      required
                    />
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    💾 Guardar Cambios
                  </button>
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    ✕ Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="scrollable-cards">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductsCard
                key={product._id}
                name={product.name}
                price={product.price}
                imageUrl={product.imgProduct}
                descripcion={product.descripcion}
                stock={product.stock}
                category={product.idCategory?.name}
                onEdit={() => startEditProduct(product)}
                onDelete={() => handleDelete(product)} // Pasar el objeto completo del producto
                showActions={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Componente de alerta personalizada */}
      <AlertComponent />
    </>
  );
};

export default Inventary;
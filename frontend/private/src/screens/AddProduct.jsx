import React from "react";
import "./AddProduct.css";
import HeaderProducts from '../components/HeaderProducts';
import useDataProducts from '../components/Products/hooks/useDataProducts';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const AddProduct = () => {
  const {
    categories,
    formData,
    selectedImage,
    imagePreview,
    handleInputChange,
    handleImageChange,
    createProduct,
    resetForm
  } = useDataProducts();

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mostrar loading mientras se procesa
    Swal.fire({
      title: 'Registrando producto...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    const result = await createProduct(formData, selectedImage);
    
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: '🎉 ¡Producto Registrado!',
        text: `El producto "${formData.name}" se ha agregado exitosamente al inventario.`,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#28a745',
        timer: 3000,
        timerProgressBar: true
      });
      resetForm(); // Limpiar formulario después del éxito
    } else {
      Swal.fire({
        icon: 'error',
        title: '❌ Error al Registrar',
        text: result.message || 'No se pudo registrar el producto. Por favor, intenta nuevamente.',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  return (
    <div className="productos-container">
      <HeaderProducts title="Registrar Producto" />

      <div className="product-form-content">
        <div className="upload-section">
          <div className="upload-box" onClick={() => document.getElementById('imageInput').click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
            ) : (
              <div className="upload-icon">📷 Imagen</div>
            )}
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{display: 'none'}}
          />
          <button 
            type="button" 
            className="submit-button"
            onClick={() => document.getElementById('imageInput').click()}
          >
            📁 {selectedImage ? 'Cambiar foto' : 'Subir foto'}
          </button>
        </div>

        <form className="form-section" onSubmit={handleSubmit}>
          <label>
            Nombre del producto
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
          </label>

          <label>
            Descripción
            <textarea 
              name="descripcion" 
              rows="3" 
              value={formData.descripcion}
              onChange={handleInputChange}
            />
          </label>

          <div className="form-row">
            <label className="categoria-label">
              Categoría
              <select 
                name="idCategory" 
                value={formData.idCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="precio-label">
              Precio
              <input 
                type="number" 
                name="price" 
                placeholder="$" 
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </label>
          </div>

          <label>
            Stock
            <input 
              type="number" 
              name="stock" 
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
            />
          </label>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button type="submit" className="submit-button">
              ➕ Registrar Producto
            </button>
            <button type="button" className="submit-button" onClick={resetForm} style={{backgroundColor: '#6c757d'}}>
              🔄 Limpiar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
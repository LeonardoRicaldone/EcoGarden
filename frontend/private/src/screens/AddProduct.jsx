import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import HeaderProducts from '../components/HeaderProducts';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    price: "",
    stock: "",
    idCategory: ""
  });

  // Fetch solo categorías
  const fetchCategories = async () => {
    try {
      const categoriesResponse = await fetch("http://localhost:4000/api/categories");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Crear producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Crear FormData para enviar archivo
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('idCategory', formData.idCategory);
    
    // Solo agregar imagen si hay una seleccionada
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      const response = await fetch("http://localhost:4000/api/products", {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        resetForm();
        alert(result.message || 'Producto creado exitosamente');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el producto');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: "",
      descripcion: "",
      price: "",
      stock: "",
      idCategory: ""
    });
    setSelectedImage(null);
    setImagePreview(null);
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
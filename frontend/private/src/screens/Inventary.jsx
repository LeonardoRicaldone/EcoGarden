import React, { useState, useEffect } from "react";
import ProductsCard from '../components/ProductsCard';
import { Link } from "react-router-dom"
import "./Inventary.css"
import HeaderProducts from '../components/HeaderProducts';
import Searcher from '../components/Searcher';

const Inventary = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    price: "",
    stock: "",
    idCategory: ""
  });

  // Fetch productos y categorías
  const fetchData = async () => {
    try {
      const productsResponse = await fetch("http://localhost:4000/api/products");
      const categoriesResponse = await fetch("http://localhost:4000/api/categories");

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar productos por búsqueda
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

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

  // Actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('idCategory', formData.idCategory);

    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      const response = await fetch(`http://localhost:4000/api/products/${editingProduct._id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        fetchData();
        resetForm();
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el producto');
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
          fetchData();
          alert(result.message);
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  // Editar producto
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      descripcion: product.descripcion || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      idCategory: product.idCategory._id || product.idCategory
    });
    setImagePreview(product.imgProduct);
    setSelectedImage(null);
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
    setEditingProduct(null);
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
                onEdit={() => handleEdit(product)}
                onDelete={() => handleDelete(product._id)}
                showActions={true}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Inventary;
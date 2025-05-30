import { useState, useEffect } from 'react';
import API from '../../../api/URL.js'


const useDataProducts = () => {
  // Estados para productos y categorías
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para formularios
  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    price: "",
    stock: "",
    idCategory: ""
  });

  // Estados para manejo de imágenes
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Estados para edición
  const [editingProduct, setEditingProduct] = useState(null);

  // Función para obtener productos del backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/products`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar los productos. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener categorías
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Función para obtener tanto productos como categorías
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`${API}/api/products`),
        fetch(`${API}/api/categories`)
      ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para manejar selección de imagen
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

  // Función para manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Función para crear producto
  const createProduct = async (productData, image) => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', productData.name);
    formDataToSend.append('descripcion', productData.descripcion);
    formDataToSend.append('price', productData.price);
    formDataToSend.append('stock', productData.stock);
    formDataToSend.append('idCategory', productData.idCategory);
    
    // Si hay una imagen seleccionada, la agregamos al FormData
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      // Enviamos el FormData al backend
      const response = await fetch(`${API}/api/products`, {
        method: 'POST',
        body: formDataToSend
      });

      // Procesamos la respuesta
      const result = await response.json();

      if (response.ok) {
        await fetchData(); // Recargar datos
        resetForm();
        return { success: true, message: result.message || 'Producto creado exitosamente' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al crear el producto' };
    }
  };

  // Función para actualizar producto
  const updateProduct = async (productId, productData, image) => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', productData.name);
    formDataToSend.append('descripcion', productData.descripcion);
    formDataToSend.append('price', productData.price);
    formDataToSend.append('stock', productData.stock);
    formDataToSend.append('idCategory', productData.idCategory);

    // Si hay una imagen seleccionada, la agregamos al FormData
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const response = await fetch(`${API}/api/products/${productId}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        await fetchData(); // Recargar datos
        resetForm();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al actualizar el producto' };
    }
  };

  // Función para eliminar producto
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API}/api/products/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        await fetchData(); // Recargar datos
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error al eliminar el producto' };
    }
  };

  // Función para preparar edición de producto
  const startEditProduct = (product) => {
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

  // Función para resetear formulario
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

  // Función para calcular estadísticas simuladas
  const calculateStats = (product) => {
    const salesSimulated = Math.floor(Math.random() * product.stock * 0.3);
    const revenueSimulated = salesSimulated * product.price;
    
    return {
      sales: salesSimulated,
      revenue: revenueSimulated
    };
  };

  // Effect para filtrar productos por búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.idCategory?.name && product.idCategory.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  // Effect inicial para cargar datos
  useEffect(() => {
    fetchData();
  }, []);

  // Retornamos todo lo que necesitan los componentes
  return {
    // Estados
    products,
    categories,
    filteredProducts,
    searchTerm,
    loading,
    error,
    formData,
    selectedImage,
    imagePreview,
    editingProduct,

    // Funciones de API
    fetchProducts,
    fetchCategories,
    fetchData,
    createProduct,
    updateProduct,
    deleteProduct,

    // Funciones de manejo de formulario
    handleInputChange,
    handleImageChange,
    handleSearch,
    startEditProduct,
    resetForm,

    // Funciones utilitarias
    calculateStats,

    // Setters directos (por si necesitas usarlos)
    setProducts,
    setCategories,
    setFilteredProducts,
    setSearchTerm,
    setLoading,
    setError,
    setFormData,
    setSelectedImage,
    setImagePreview,
    setEditingProduct
  };
};

export default useDataProducts;
const productsController = {};
import productsModel from "../models/Products.js"
import multer from 'multer';
import  cloudinaryConfig  from "../utils/cloudinaryConfig.js"

// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB límite
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Middleware para subir imagen
productsController.uploadImage = upload.single('image');

const uploadToCloudinary = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
         cloudinaryConfig.uploader.upload_stream(
             {
                 resource_type: 'image',
                 public_id: `products/${fileName}`,
                 folder: 'products'
             },
             (error, result) => {
                 if (error) {
                     reject(error);
                } else {
                    resolve(result.secure_url);
                 }
             }
         ).end(fileBuffer);
        
    });
};

// SELECT - Obtener todos los productos
productsController.getProducts = async (req, res) => {
    try {
        const products = await productsModel.find().populate('idCategory')
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error });
    }
}

// NUEVO - SELECT por ID - Obtener un producto específico
productsController.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Getting product by ID:', id);

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "ID del producto requerido" 
            });
        }

        const product = await productsModel.findById(id).populate('idCategory');
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Producto no encontrado" 
            });
        }

        console.log('Product found:', product.name);
        res.json(product);
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "ID de producto inválido" 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener producto", 
            error: error.message 
        });
    }
}

// INSERT
productsController.createProducts = async (req, res) => {
    try {
        const { name, descripcion, price, stock, idCategory } = req.body;
        let imgProduct = '';

        // Si hay archivo de imagen, subirlo a Cloudinary
        if (req.file) {
            const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}`;
            imgProduct = await uploadToCloudinary(req.file.buffer, fileName);
        }

        const newProduct = new productsModel({
            name, 
            descripcion, 
            price: parseFloat(price), 
            stock: parseInt(stock), 
            imgProduct, 
            idCategory
        });
        
        await newProduct.save();
        
        // Populate para devolver el producto completo
        const savedProduct = await productsModel.findById(newProduct._id).populate('idCategory');
        
        res.status(201).json({ 
            message: "Producto guardado exitosamente", 
            product: savedProduct 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
}

// DELETE
productsController.deleteProducts = async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (product.imgProduct && product.imgProduct.includes('cloudinary')) {
             const publicId = extractPublicId(product.imgProduct);
             await cloudinaryConfig.uploader.destroy(publicId);
        }

        await productsModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
}

// UPDATE 
productsController.updateProducts = async (req, res) => {
    try {
        const { name, descripcion, price, stock, idCategory } = req.body;
        const productId = req.params.id;
        
        // Buscar el producto existente
        const existingProduct = await productsModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        let imgProduct = existingProduct.imgProduct;

        // Si hay nueva imagen, subirla y eliminar la anterior
        if (req.file) {
            const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}`;
            const newImageUrl = await uploadToCloudinary(req.file.buffer, fileName);
            
            // Eliminar imagen anterior de Cloudinary si existe
            if (existingProduct.imgProduct && existingProduct.imgProduct.includes('cloudinary')) {
                 const publicId = extractPublicId(existingProduct.imgProduct);
                 await cloudinaryConfig.uploader.destroy(publicId);
            }
            
            imgProduct = newImageUrl;
        }

        const updatedProduct = await productsModel.findByIdAndUpdate(
            productId, 
            {
                name, 
                descripcion, 
                price: parseFloat(price), 
                stock: parseInt(stock), 
                imgProduct, 
                idCategory
            }, 
            { new: true }
        ).populate('idCategory');

        res.json({
            message: "Producto actualizado exitosamente",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error: error.message });
    }
};

// NUEVO - Actualizar solo el stock de un producto (para compras)
productsController.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation = 'subtract' } = req.body; // 'subtract' or 'add'

        console.log('Updating stock for product:', id, 'quantity:', quantity, 'operation:', operation);

        const product = await productsModel.findById(id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Producto no encontrado" 
            });
        }

        let newStock;
        if (operation === 'subtract') {
            newStock = product.stock - quantity;
            if (newStock < 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Stock insuficiente" 
                });
            }
        } else if (operation === 'add') {
            newStock = product.stock + quantity;
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Operación inválida. Use 'subtract' o 'add'" 
            });
        }

        const updatedProduct = await productsModel.findByIdAndUpdate(
            id,
            { stock: newStock },
            { new: true }
        );

        res.json({
            success: true,
            message: "Stock actualizado exitosamente",
            product: updatedProduct,
            previousStock: product.stock,
            newStock: newStock
        });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error al actualizar stock", 
            error: error.message 
        });
    }
};

 const extractPublicId = (cloudinaryUrl) => {
     const parts = cloudinaryUrl.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
 };

export default productsController;
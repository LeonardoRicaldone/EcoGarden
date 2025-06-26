import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

const useShoppingCart = (clientId) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartId, setCartId] = useState(null);

    const CART_API = "http://localhost:4000/api/shoppingCart";
    const PRODUCTS_API = "http://localhost:4000/api/products";

    console.log('useShoppingCart initialized with clientId:', clientId);

    // Función para validar ObjectId
    const isValidObjectId = (id) => {
        return /^[0-9a-fA-F]{24}$/.test(id);
    };

    // Función para obtener el carrito del cliente
    const fetchCart = useCallback(async () => {
        // Si no hay cliente autenticado, no hacer nada
        if (!clientId) {
            console.log('No clientId provided, clearing cart');
            setCartItems([]);
            setCartId(null);
            setLoading(false);
            return;
        }

        // AGREGADO: Validar que clientId sea un ObjectId válido
        if (!isValidObjectId(clientId)) {
            console.error('Invalid clientId format:', clientId);
            setError("ID de cliente inválido");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Fetching cart for client:', clientId);
            
            const response = await fetch(`${CART_API}/client/${clientId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    // No hay carrito para este cliente
                    console.log('No cart found for client, starting with empty cart');
                    setCartItems([]);
                    setCartId(null);
                    setError(null);
                    return;
                }
                
                // MEJORADO: Manejar errores específicos
                if (response.status === 400) {
                    const errorData = await response.json();
                    console.error('Client ID error:', errorData.message);
                    setError("ID de cliente inválido");
                    return;
                }
                
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const userCart = await response.json();
            console.log('Cart response:', userCart);
            
            if (userCart && userCart._id) {
                console.log('User cart found:', userCart._id);
                setCartId(userCart._id);
                
                // Transformar productos del carrito
                const transformedItems = await Promise.all(
                    userCart.products.map(async (item) => {
                        try {
                            // Verificar si ya tenemos la información del producto poblada
                            if (item.idProduct && typeof item.idProduct === 'object') {
                                // El producto ya está poblado
                                return {
                                    id: item.idProduct._id.toString(),
                                    name: item.idProduct.name,
                                    price: parseFloat(item.idProduct.price),
                                    img: item.idProduct.imgProduct,
                                    quantity: parseInt(item.quantity),
                                    subtotal: parseFloat(item.subtotal),
                                    stock: item.idProduct.stock
                                };
                            } else {
                                // Necesitamos obtener información del producto
                                const productResponse = await fetch(`${PRODUCTS_API}/${item.idProduct}`);
                                if (productResponse.ok) {
                                    const productData = await productResponse.json();
                                    return {
                                        id: productData._id.toString(),
                                        name: productData.name,
                                        price: parseFloat(productData.price),
                                        img: productData.imgProduct,
                                        quantity: parseInt(item.quantity),
                                        subtotal: parseFloat(item.subtotal),
                                        stock: productData.stock
                                    };
                                }
                                return null;
                            }
                        } catch (error) {
                            console.error('Error processing cart item:', error);
                            return null;
                        }
                    })
                );

                const validItems = transformedItems.filter(item => item !== null);
                setCartItems(validItems);
                console.log('Cart items loaded:', validItems.length);
            } else {
                console.log('No cart found for user, starting with empty cart');
                setCartItems([]);
                setCartId(null);
            }
            
            setError(null);
        } catch (error) {
            console.error("Error al obtener carrito:", error);
            setError("Error al cargar carrito");
            // En caso de error, limpiar el carrito
            setCartItems([]);
            setCartId(null);
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    // Función para agregar producto al carrito
    const addToCart = async (productId, quantity = 1) => {
        console.log('Adding to cart:', { productId, quantity, clientId });

        // Verificar si el usuario está autenticado
        if (!clientId) {
            toast.error("Debes iniciar sesión para agregar productos al carrito");
            return false;
        }

        if (!isValidObjectId(clientId)) {
            toast.error("Error: ID de cliente inválido");
            return false;
        }

        try {
            // Obtener información del producto
            const productResponse = await fetch(`${PRODUCTS_API}/${productId}`);
            if (!productResponse.ok) {
                throw new Error('Producto no encontrado');
            }

            const product = await productResponse.json();
            console.log('Product to add:', product.name);

            if (product.stock < quantity) {
                toast.error(`Solo hay ${product.stock} unidades disponibles`);
                return false;
            }

            const productPrice = parseFloat(product.price);
            const productQuantity = parseInt(quantity);
            const calculatedSubtotal = parseFloat((productPrice * productQuantity).toFixed(2));

            const newItem = {
                id: product._id.toString(),
                name: product.name,
                price: productPrice,
                img: product.imgProduct,
                quantity: productQuantity,
                subtotal: calculatedSubtotal,
                stock: product.stock
            };

            // Actualizar estado local y obtener los items actualizados
            let updatedItems;
            await new Promise((resolve) => {
                setCartItems(prevItems => {
                    const existingItemIndex = prevItems.findIndex(item => item.id === productId);

                    if (existingItemIndex >= 0) {
                        // Si el producto ya existe, actualizar cantidad
                        const existingItem = prevItems[existingItemIndex];
                        const newQuantity = existingItem.quantity + productQuantity;
                        
                        if (newQuantity > product.stock) {
                            toast.error(`Solo hay ${product.stock} unidades disponibles`);
                            updatedItems = prevItems;
                            resolve();
                            return prevItems;
                        }

                        const newSubtotal = parseFloat((newQuantity * existingItem.price).toFixed(2));

                        updatedItems = prevItems.map((item, index) => 
                            index === existingItemIndex 
                                ? { 
                                    ...item, 
                                    quantity: newQuantity,
                                    subtotal: newSubtotal
                                  }
                                : item
                        );
                    } else {
                        // Si es nuevo, agregarlo
                        updatedItems = [...prevItems, newItem];
                    }

                    resolve();
                    return updatedItems;
                });
            });

            // Sincronizar con el servidor usando los items actualizados
            await syncCartWithServerItems(updatedItems);

            toast.success(`${product.name} agregado al carrito`);
            return true;
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            toast.error(error.message || "Error al agregar producto al carrito");
            return false;
        }
    };

    // Función para actualizar cantidad de un producto
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        console.log('Updating quantity:', { productId, newQuantity });

        let updatedItems;
        await new Promise((resolve) => {
            setCartItems(prevItems => {
                updatedItems = prevItems.map(item => 
                    item.id === productId 
                        ? { 
                            ...item, 
                            quantity: parseInt(newQuantity),
                            subtotal: parseFloat((parseInt(newQuantity) * item.price).toFixed(2))
                          }
                        : item
                );
                resolve();
                return updatedItems;
            });
        });

        // Sincronizar con servidor usando los items actualizados
        await syncCartWithServerItems(updatedItems);
    };

    // Función para eliminar producto del carrito
    const removeFromCart = async (productId) => {
        console.log('Removing from cart:', productId);

        let updatedItems;
        await new Promise((resolve) => {
            setCartItems(prevItems => {
                updatedItems = prevItems.filter(item => item.id !== productId);
                resolve();
                return updatedItems;
            });
        });

        // Sincronizar con servidor usando los items actualizados
        await syncCartWithServerItems(updatedItems);

        toast.success("Producto eliminado del carrito");
    };

    // Función para vaciar el carrito
    const clearCart = async () => {
        console.log('Clearing cart');
        
        setCartItems([]);

        // Sincronizar con servidor (carrito vacío)
        await syncCartWithServerItems([]);

        toast.success("Carrito vaciado");
    };

    // Función para sincronizar carrito con el servidor usando items específicos
    const syncCartWithServerItems = async (items) => {
        if (!clientId) return;

        if (!isValidObjectId(clientId)) {
            console.error('Cannot sync cart: Invalid clientId format:', clientId);
            return;
        }

        try {
            console.log('Syncing cart with server using specific items...');
            
            // Calcular subtotal de productos
            const productsSubtotal = parseFloat(
                items.reduce((total, item) => total + item.subtotal, 0).toFixed(2)
            );
            
            // Calcular envío
            const shippingCost = productsSubtotal >= 70 ? 0 : 4;
            
            // Total final (subtotal + envío) - ESTO DEBE COINCIDIR CON EL FRONTEND
            const totalWithShipping = parseFloat((productsSubtotal + shippingCost).toFixed(2));
            
            console.log('=== SYNC CART DEBUG ===');
            console.log('Products subtotal:', productsSubtotal);
            console.log('Shipping cost:', shippingCost);
            console.log('Total with shipping:', totalWithShipping);
            console.log('=======================');
            
            const cartData = {
                idClient: clientId,
                products: items.map(item => ({
                    idProduct: item.id,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                })),
                total: totalWithShipping, // ENVIAR EL TOTAL CON ENVÍO
                status: "Pending"
            };

            console.log('Cart data to sync:', cartData);

            let response;
            if (cartId && items.length > 0) {
                // Actualizar carrito existente
                console.log('Updating existing cart:', cartId);
                response = await fetch(`${CART_API}/${cartId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartData)
                });
            } else if (items.length > 0) {
                // Crear nuevo carrito solo si hay productos
                console.log('Creating new cart');
                response = await fetch(`${CART_API}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartData)
                });

                if (response && response.ok) {
                    const result = await response.json();
                    if (result.cart && result.cart._id) {
                        setCartId(result.cart._id);
                        console.log('New cart created with ID:', result.cart._id);
                    }
                }
            } else if (cartId) {
                // Si no hay productos pero hay cartId, vaciar el carrito en el servidor
                console.log('Clearing cart on server:', cartId);
                response = await fetch(`${CART_API}/${cartId}/clear`, {
                    method: 'PATCH'
                });
            }

            if (response && response.ok) {
                console.log('Cart synced successfully with server');
                // AGREGADO: Limpiar cualquier error anterior después de sincronización exitosa
                setError(null);
            } else if (response) {
                console.error('Error syncing cart:', response.status, response.statusText);
                
                // MEJORADO: Manejar errores específicos de sincronización
                if (response.status === 400) {
                    const errorData = await response.json();
                    console.error('Sync error details:', errorData);
                    
                    if (errorData.message && errorData.message.includes('ObjectId')) {
                        setError("Error de sincronización: ID inválido");
                        toast.error("Error al sincronizar carrito");
                    }
                }
            }
        } catch (error) {
            console.error('Error syncing cart with server:', error);
            
            // MEJORADO: Manejar errores de conexión
            if (error.message.includes('fetch')) {
                setError("Error de conexión al servidor");
                toast.error("Error de conexión. Verifica tu internet.");
            }
        }
    };

    // Función para sincronizar carrito con el servidor (usa cartItems actual)
    const syncCartWithServer = async () => {
        return syncCartWithServerItems(cartItems);
    };

    // Función para procesar la compra (marcar como Paid)
    const processCheckout = async () => {
        if (!cartId || cartItems.length === 0) {
            toast.error("No hay productos en el carrito");
            return false;
        }

        try {
            console.log('Processing checkout for cart:', cartId);
            
            const response = await fetch(`${CART_API}/${cartId}/paid`, {
                method: 'PATCH'
            });

            if (response.ok) {
                // Limpiar el carrito local después del checkout exitoso
                setCartItems([]);
                setCartId(null);
                
                toast.success("Compra procesada exitosamente");
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al procesar la compra');
            }
        } catch (error) {
            console.error('Error processing checkout:', error);
            toast.error("Error al procesar la compra: " + error.message);
            return false;
        }
    };

    // Calcular subtotal CON PRECISIÓN
    const getSubtotal = () => {
        const total = cartItems.reduce((total, item) => {
            const itemSubtotal = item.subtotal || (item.price * item.quantity);
            return total + itemSubtotal;
        }, 0);
        
        console.log('=== getSubtotal DEBUG ===');
        console.log('Cart items for subtotal calculation:');
        cartItems.forEach((item, index) => {
            const itemSubtotal = item.subtotal || (item.price * item.quantity);
            console.log(`Item ${index + 1}: ${item.name}, Price: ${item.price}, Qty: ${item.quantity}, Subtotal: ${itemSubtotal}`);
        });
        console.log('Total calculated:', total);
        console.log('Total with toFixed(2):', parseFloat(total.toFixed(2)));
        console.log('========================');
        
        return parseFloat(total.toFixed(2));
    };

    // Calcular total con envío CON PRECISIÓN
    const getTotalAmount = (shippingCost = 4) => {
        const subtotal = getSubtotal();
        
        console.log('=== getTotalAmount DEBUG ===');
        console.log('Subtotal:', subtotal);
        console.log('Shipping cost parameter:', shippingCost);
        console.log('Subtotal >= 70?', subtotal >= 70);
        
        if (subtotal === 0) {
            console.log('Subtotal is 0, returning 0');
            return 0;
        }
        
        const shipping = subtotal >= 70 ? 0 : parseFloat(shippingCost);
        const total = parseFloat((subtotal + shipping).toFixed(2));
        
        console.log('Shipping cost applied:', shipping);
        console.log('Final total:', total);
        console.log('============================');
        
        return total;
    };

    // Obtener cantidad total de productos
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Verificar si un producto está en el carrito
    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    // Obtener cantidad de un producto específico en el carrito
    const getProductQuantity = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    // Cargar carrito al montar el componente o cambiar clientId
    useEffect(() => {
        fetchCart();
    }, [clientId, fetchCart]);

    return {
        // Estado del carrito
        cartItems,
        loading,
        error,
        cartId,
        
        // Funciones principales
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        processCheckout,
        
        // Utilidades
        getSubtotal,
        getTotalAmount,
        getTotalItems,
        isInCart,
        getProductQuantity,
        
        // Estados calculados
        isEmpty: cartItems.length === 0,
        itemCount: getTotalItems(),
        subtotal: getSubtotal(),
        
        // Funciones de control
        refetch: fetchCart
    };
};

export default useShoppingCart;
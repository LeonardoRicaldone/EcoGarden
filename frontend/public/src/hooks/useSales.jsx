import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const useSales = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sales, setSales] = useState([]);

    const SALES_API = "http://localhost:4000/api/sales";

    // Función para obtener todas las ventas - CORREGIDA
    const getSales = useCallback(async (clientId = null) => {
        try {
            setLoading(true);
            setError(null);

            // Construir URL con filtro opcional de cliente
            const url = clientId ? `${SALES_API}?clientId=${clientId}` : SALES_API;
            console.log('Fetching sales from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Para incluir cookies si es necesario
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('No sales found');
                    setSales([]);
                    return {
                        success: true,
                        sales: []
                    };
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const salesData = await response.json();
            console.log('Sales response structure:', salesData);
            
            // El backend devuelve { success: true, sales: [...] }
            // Extraer el array de sales de la respuesta
            let salesArray = [];
            
            if (salesData.success && salesData.sales) {
                salesArray = Array.isArray(salesData.sales) ? salesData.sales : [];
            } else if (Array.isArray(salesData)) {
                // Por si el backend devuelve directamente el array
                salesArray = salesData;
            }
            
            console.log('Sales array extracted:', salesArray.length, 'sales');
            setSales(salesArray);
            
            return {
                success: true,
                sales: salesArray
            };

        } catch (error) {
            console.error('Error fetching sales:', error);
            setError(error.message);
            setSales([]); // Limpiar sales en caso de error
            
            // Solo mostrar toast si no es un error de CORS o conexión
            if (!error.message.includes('CORS') && !error.message.includes('fetch')) {
                toast.error(`Error al cargar ventas: ${error.message}`, {
                    duration: 4000,
                    position: 'top-center'
                });
            }
            
            return {
                success: false,
                error: error.message,
                sales: []
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para crear una nueva venta
    const createSale = useCallback(async (saleData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Creating sale with data:', saleData);

            // Validar datos requeridos
            const requiredFields = [
                'idShoppingCart', 'name', 'lastname', 'phone', 
                'department', 'city', 'zipCode', 'address', 
                'creditCard', 'total'
            ];

            for (const field of requiredFields) {
                if (!saleData[field]) {
                    throw new Error(`Campo requerido faltante: ${field}`);
                }
            }

            // Validar que el total sea un número válido
            if (typeof saleData.total !== 'number' || saleData.total <= 0) {
                throw new Error('El total debe ser un número mayor a 0');
            }

            const response = await fetch(SALES_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...saleData,
                    status: saleData.status || 'Pending'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Sale created successfully:', result);

            toast.success('Venta creada exitosamente', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#93A267',
                    color: 'white',
                    fontSize: '16px',
                    padding: '16px',
                    borderRadius: '8px'
                },
                icon: '🎉'
            });

            return {
                success: true,
                sale: result.sale || result,
                saleId: result.sale?._id || result._id
            };

        } catch (error) {
            console.error('Error creating sale:', error);
            setError(error.message);
            
            toast.error(`Error al crear la venta: ${error.message}`, {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '14px',
                    padding: '12px 16px',
                    borderRadius: '8px'
                }
            });

            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener una venta por ID
    const getSaleById = useCallback(async (saleId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${SALES_API}/${saleId}`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Venta no encontrada');
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const saleData = await response.json();
            
            return {
                success: true,
                sale: saleData
            };

        } catch (error) {
            console.error('Error fetching sale:', error);
            setError(error.message);
            
            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para actualizar el estado de una venta
    const updateSaleStatus = useCallback(async (saleId, newStatus) => {
        try {
            setLoading(true);
            setError(null);

            const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
            if (!validStatuses.includes(newStatus)) {
                throw new Error(`Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
            }

            const response = await fetch(`${SALES_API}/${saleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            toast.success(`Estado actualizado a: ${newStatus}`, {
                duration: 3000,
                position: 'bottom-center'
            });

            return {
                success: true,
                sale: result.sale || result
            };

        } catch (error) {
            console.error('Error updating sale status:', error);
            setError(error.message);
            
            toast.error(`Error al actualizar: ${error.message}`, {
                duration: 4000,
                position: 'bottom-center'
            });

            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // NUEVA: Función para validar datos del checkout
    const validateCheckoutData = useCallback((formData, totalAmount) => {
        const errors = {};

        // Validar campos requeridos
        if (!formData.name?.trim()) {
            errors.name = 'El nombre es requerido';
        }

        if (!formData.lastname?.trim()) {
            errors.lastname = 'El apellido es requerido';
        }

        if (!formData.phone?.trim()) {
            errors.phone = 'El teléfono es requerido';
        } else if (!/^\+?[\d\s\-\(\)]{8,}$/.test(formData.phone)) {
            errors.phone = 'Formato de teléfono inválido';
        }

        if (!formData.department) {
            errors.department = 'El departamento es requerido';
        }

        if (!formData.city?.trim()) {
            errors.city = 'La ciudad es requerida';
        }

        if (!formData.zipCode?.trim()) {
            errors.zipCode = 'El código postal es requerido';
        }

        if (!formData.address?.trim()) {
            errors.address = 'La dirección es requerida';
        }

        if (!formData.creditCard?.trim()) {
            errors.creditCard = 'El número de tarjeta es requerido';
        } else if (formData.creditCard.replace(/\s/g, '').length < 16) {
            errors.creditCard = 'Número de tarjeta inválido';
        }

        if (!formData.expiryDate?.trim()) {
            errors.expiryDate = 'La fecha de expiración es requerida';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            errors.expiryDate = 'Formato de fecha inválido (MM/AA)';
        }

        if (!formData.cvv?.trim()) {
            errors.cvv = 'El CVV es requerido';
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            errors.cvv = 'CVV inválido (3-4 dígitos)';
        }

        if (!formData.cardName?.trim()) {
            errors.cardName = 'El nombre en la tarjeta es requerido';
        }

        if (!totalAmount || totalAmount <= 0) {
            errors.total = 'El total debe ser mayor a 0';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }, []);

    // NUEVA: Función para procesar checkout completo
    const processCompleteCheckout = useCallback(async (formData, cartId, processCheckoutFn) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Processing complete checkout...');
            console.log('FormData:', formData);
            console.log('CartId:', cartId);

            // 1. Primero crear la venta
            const saleData = {
                idShoppingCart: cartId,
                name: formData.name,
                lastname: formData.lastname,
                phone: formData.phone,
                department: formData.department,
                city: formData.city,
                zipCode: formData.zipCode,
                address: formData.address,
                creditCard: formData.creditCard,
                total: formData.total,
                status: 'Pending'
            };

            console.log('Creating sale with data:', saleData);
            const saleResult = await createSale(saleData);

            if (!saleResult.success) {
                throw new Error(saleResult.error || 'Error al crear la venta');
            }

            console.log('Sale created successfully:', saleResult.saleId);

            // 2. Procesar el checkout del carrito
            console.log('Processing cart checkout...');
            const checkoutResult = await processCheckoutFn();

            if (!checkoutResult) {
                console.error('Cart checkout failed');
                // Si falla el checkout del carrito, deberíamos considerar cancelar la venta
                throw new Error('Error al procesar el carrito');
            }

            console.log('Complete checkout successful');

            return {
                success: true,
                saleId: saleResult.saleId,
                sale: saleResult.sale
            };

        } catch (error) {
            console.error('Error in complete checkout:', error);
            setError(error.message);
            
            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    }, [createSale]);

    return {
        // Estado
        loading,
        error,
        sales,

        // Funciones principales
        createSale,
        getSales,
        getSaleById,
        updateSaleStatus,

        // Nuevas funciones para checkout
        validateCheckoutData,
        processCompleteCheckout,

        // Limpiar estado
        clearError: () => setError(null)
    };
};

export default useSales;
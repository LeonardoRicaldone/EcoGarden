import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const useSales = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sales, setSales] = useState([]);

    const SALES_API = "http://localhost:4000/api/sales";

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
                    background: '#10b981',
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

    // Función para obtener todas las ventas
    const getSales = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(SALES_API);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const salesData = await response.json();
            setSales(salesData);
            
            return {
                success: true,
                sales: salesData
            };

        } catch (error) {
            console.error('Error fetching sales:', error);
            setError(error.message);
            
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

            const response = await fetch(`${SALES_API}/${saleId}`);
            
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

    // Función para procesar el checkout completo (crear venta + marcar carrito como pagado)
    const processCompleteCheckout = useCallback(async (checkoutData, cartId, processCartCheckout) => {
        try {
            setLoading(true);
            console.log('Processing complete checkout...');

            // 1. Crear la venta
            const saleResult = await createSale({
                idShoppingCart: cartId,
                name: checkoutData.name,
                lastname: checkoutData.lastname,
                phone: checkoutData.phone,
                department: checkoutData.department,
                city: checkoutData.city,
                zipCode: checkoutData.zipCode,
                address: checkoutData.address,
                creditCard: checkoutData.creditCard.replace(/\s/g, ''), // Limpiar espacios
                total: checkoutData.total,
                status: 'Pending'
            });

            if (!saleResult.success) {
                throw new Error(`Error al crear venta: ${saleResult.error}`);
            }

            // 2. Marcar el carrito como pagado
            const cartResult = await processCartCheckout();
            
            if (!cartResult) {
                // Si falla el carrito, intentar rollback de la venta (opcional)
                console.error('Cart checkout failed, but sale was created:', saleResult.saleId);
                throw new Error('Error al procesar el carrito');
            }

            console.log('Complete checkout successful:', {
                saleId: saleResult.saleId,
                cartProcessed: cartResult
            });

            return {
                success: true,
                saleId: saleResult.saleId,
                sale: saleResult.sale
            };

        } catch (error) {
            console.error('Error in complete checkout:', error);
            
            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    }, [createSale]);

    // Función para validar datos de checkout antes de enviar
    const validateCheckoutData = useCallback((formData, totalAmount) => {
        const errors = {};

        // Validar campos personales
        if (!formData.name || formData.name.length < 2) {
            errors.name = 'Nombre debe tener al menos 2 caracteres';
        }
        if (!formData.lastname || formData.lastname.length < 2) {
            errors.lastname = 'Apellido debe tener al menos 2 caracteres';
        }
        if (!formData.phone || !/^[\d\-\+\(\)\s]+$/.test(formData.phone)) {
            errors.phone = 'Formato de teléfono inválido';
        }

        // Validar dirección
        if (!formData.department) {
            errors.department = 'Selecciona un departamento';
        }
        if (!formData.city) {
            errors.city = 'La ciudad es requerida';
        }
        if (!formData.zipCode || !/^\d{4,5}$/.test(formData.zipCode)) {
            errors.zipCode = 'Código postal inválido';
        }
        if (!formData.address || formData.address.length < 10) {
            errors.address = 'La dirección debe tener al menos 10 caracteres';
        }

        // Validar tarjeta de crédito
        const cleanCard = formData.creditCard.replace(/\s/g, '');
        if (!cleanCard || cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
            errors.creditCard = 'La tarjeta debe tener 16 dígitos';
        }

        if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            errors.expiryDate = 'Formato de fecha inválido (MM/AA)';
        } else {
            const [month, year] = formData.expiryDate.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (parseInt(month) < 1 || parseInt(month) > 12) {
                errors.expiryDate = 'Mes inválido';
            } else if (parseInt(year) < currentYear || 
                      (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                errors.expiryDate = 'Tarjeta vencida';
            }
        }

        if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
            errors.cvv = 'CVV debe tener 3 o 4 dígitos';
        }

        if (!formData.cardName || formData.cardName.length < 3) {
            errors.cardName = 'Nombre en tarjeta muy corto';
        }

        // Validar total
        if (!totalAmount || totalAmount <= 0) {
            errors.total = 'Total inválido';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }, []);

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
        processCompleteCheckout,

        // Utilidades
        validateCheckoutData,

        // Limpiar estado
        clearError: () => setError(null)
    };
};

export default useSales;
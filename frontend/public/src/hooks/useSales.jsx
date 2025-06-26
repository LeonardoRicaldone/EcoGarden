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

        // Limpiar estado
        clearError: () => setError(null)
    };
};

export default useSales;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaCreditCard, FaUser, FaMapMarkerAlt, FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import useShoppingCart from '../hooks/useShoppingCart';
import useSales from '../hooks/useSales';

const Checkout = () => {
    const navigate = useNavigate();
    
    // Hooks de autenticación y carrito
    const { auth, user } = useAuth();
    const { isAuthenticated } = auth;
    const clientId = user?.id || null;

    const {
        cartItems,
        cartId,
        getSubtotal,
        getTotalAmount,
        getTotalItems,
        isEmpty,
        processCheckout,
        loading: cartLoading
    } = useShoppingCart(isAuthenticated ? clientId : null);

    // Hook de ventas
    const {
        loading: salesLoading,
        processCompleteCheckout
    } = useSales();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            lastname: user?.lastname || '',
            phone: user?.phone || '',
            department: '',
            city: '',
            zipCode: '',
            address: '',
            creditCard: '',
            expiryDate: '',
            cvv: '',
            cardName: ''
        },
        mode: 'onBlur'
    });

    const shippingCost = 4;
    const subtotal = getSubtotal();
    const totalAmount = getTotalAmount(shippingCost);
    const totalItems = getTotalItems();

    // Actualizar valores del usuario cuando cambien
    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('lastname', user.lastname || '');
            setValue('phone', user.phone || '');
        }
    }, [user, setValue]);

    // Verificar autenticación y carrito al cargar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                console.log('User not authenticated, redirecting to login');
                toast.error('Debes iniciar sesión para continuar');
                navigate('/Login');
                return;
            }

            if (!cartLoading) {
                if (isEmpty) {
                    console.log('Cart is empty, redirecting to cart');
                    toast.error('Tu carrito está vacío');
                    navigate('/ShoppingCart');
                    return;
                }

                if (!cartId) {
                    console.log('CartId missing, redirecting to cart');
                    toast.error('Error: No se encontró el carrito');
                    navigate('/ShoppingCart');
                    return;
                }
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [isAuthenticated, isEmpty, cartId, navigate, cartLoading]);

    // Formatear número de tarjeta
    const formatCardNumber = (value) => {
        const cleanValue = value.replace(/\s/g, '');
        const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim();
        return formattedValue.substring(0, 19);
    };

    // Formatear fecha de expiración
    const formatExpiryDate = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length >= 2) {
            return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
        }
        return cleanValue;
    };

    // Validaciones personalizadas
    const validations = {
        name: {
            required: 'El nombre es requerido',
            minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
            },
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'Solo se permiten letras'
            }
        },
        lastname: {
            required: 'El apellido es requerido',
            minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres'
            },
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'Solo se permiten letras'
            }
        },
        phone: {
            required: 'El teléfono es requerido',
            pattern: {
                value: /^[\+]?[(]?[\d\s\-\(\)]{8,}$/,
                message: 'Formato de teléfono inválido'
            }
        },
        department: {
            required: 'El departamento es requerido'
        },
        city: {
            required: 'La ciudad es requerida',
            minLength: {
                value: 2,
                message: 'La ciudad debe tener al menos 2 caracteres'
            }
        },
        zipCode: {
            required: 'El código postal es requerido',
            pattern: {
                value: /^\d{4,5}$/,
                message: 'Código postal inválido (4-5 dígitos)'
            }
        },
        address: {
            required: 'La dirección es requerida',
            minLength: {
                value: 10,
                message: 'La dirección debe ser más específica'
            }
        },
        creditCard: {
            required: 'El número de tarjeta es requerido',
            validate: {
                validLength: (value) => {
                    const cleanValue = value.replace(/\s/g, '');
                    return cleanValue.length === 16 || 'El número de tarjeta debe tener 16 dígitos';
                },
                validFormat: (value) => {
                    const cleanValue = value.replace(/\s/g, '');
                    return /^\d+$/.test(cleanValue) || 'Solo se permiten números';
                }
            }
        },
        expiryDate: {
            required: 'La fecha de expiración es requerida',
            pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: 'Formato inválido (MM/AA)'
            },
            validate: {
                notExpired: (value) => {
                    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return true;
                    
                    const [month, year] = value.split('/');
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear() % 100;
                    const currentMonth = currentDate.getMonth() + 1;
                    
                    const cardYear = parseInt(year);
                    const cardMonth = parseInt(month);
                    
                    if (cardYear > currentYear) return true;
                    if (cardYear === currentYear && cardMonth >= currentMonth) return true;
                    
                    return 'La tarjeta está vencida';
                }
            }
        },
        cvv: {
            required: 'El CVV es requerido',
            pattern: {
                value: /^\d{3,4}$/,
                message: 'CVV inválido (3-4 dígitos)'
            }
        },
        cardName: {
            required: 'El nombre en la tarjeta es requerido',
            minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres'
            },
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'Solo se permiten letras'
            }
        }
    };

    // Manejar envío del formulario
    const onSubmit = async (formData) => {

        if (!cartId) {
            toast.error('Error: No se encontró el carrito');
            return;
        }

        if (isEmpty) {
            toast.error('Tu carrito está vacío');
            return;
        }

        try {
            console.log('Starting complete checkout process...');
            
            // Procesar el checkout completo
            const result = await processCompleteCheckout(
                {
                    ...formData,
                    total: totalAmount
                },
                cartId,
                processCheckout
            );

            if (result.success) {
                // Limpiar formulario
                reset();
                
                toast.success('¡Compra realizada exitosamente!', {
                    duration: 5000,
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
                
                // Redirigir a página de confirmación
                setTimeout(() => {
                    navigate('/Products', { 
                        state: { 
                            orderConfirmed: true,
                            saleId: result.saleId 
                        }
                    });
                }, 2000);
            } else {
                throw new Error(result.error || 'Error desconocido en el checkout');
            }

        } catch (error) {
            console.error('Error en checkout:', error);
            toast.error('Error al procesar la compra: ' + error.message);
        }
    };

    const departamentos = [
        'San Salvador', 'La Libertad', 'Santa Ana', 'Sonsonate', 'La Paz',
        'San Vicente', 'Cabañas', 'Cuscatlán', 'Chalatenango', 'Ahuachapán',
        'Usulután', 'San Miguel', 'Morazán', 'La Unión'
    ];

    // Mostrar loading
    if (cartLoading || (!cartItems || !Array.isArray(cartItems))) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4 mx-auto"></div>
                    <p className="text-lg">Preparando checkout...</p>
                    <p className="text-sm text-gray-500 mt-2">
                        ClientId: {clientId || 'No ID'} | 
                        Authenticated: {isAuthenticated ? 'Sí' : 'No'} | 
                        Loading: {cartLoading ? 'Sí' : 'No'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/ShoppingCart')}
                        className="flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Volver al carrito
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Finalizar compra</h1>
                    <p className="text-gray-600 mt-2">
                        Completa tu información para procesar el pedido
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Información personal */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaUser className="mr-2 text-green-600" />
                                    Información personal
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name', validations.name)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('lastname', validations.lastname)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.lastname ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.lastname && (
                                            <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            {...register('phone', validations.phone)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="+503 1234-5678"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dirección de envío */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-green-600" />
                                    Dirección de envío
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Departamento *
                                        </label>
                                        <select
                                            {...register('department', validations.department)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.department ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {departamentos.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        {errors.department && (
                                            <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('city', validations.city)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Código postal *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('zipCode', validations.zipCode)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="1234"
                                        />
                                        {errors.zipCode && (
                                            <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dirección completa *
                                        </label>
                                        <textarea
                                            {...register('address', validations.address)}
                                            rows={3}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Calle, número de casa, referencias..."
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Información de pago */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaCreditCard className="mr-2 text-green-600" />
                                    Información de pago
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Número de tarjeta *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('creditCard', {
                                                ...validations.creditCard,
                                                onChange: (e) => {
                                                    const formatted = formatCardNumber(e.target.value);
                                                    setValue('creditCard', formatted);
                                                }
                                            })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.creditCard ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                        {errors.creditCard && (
                                            <p className="text-red-500 text-xs mt-1">{errors.creditCard.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de expiración *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('expiryDate', {
                                                ...validations.expiryDate,
                                                onChange: (e) => {
                                                    const formatted = formatExpiryDate(e.target.value);
                                                    setValue('expiryDate', formatted);
                                                }
                                            })}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="MM/AA"
                                            maxLength={5}
                                        />
                                        {errors.expiryDate && (
                                            <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CVV *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('cvv', validations.cvv)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.cvv ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="123"
                                            maxLength={4}
                                        />
                                        {errors.cvv && (
                                            <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre en la tarjeta *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('cardName', validations.cardName)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                errors.cardName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Nombre completo como aparece en la tarjeta"
                                        />
                                        {errors.cardName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.cardName.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <button
                                    type="submit"
                                    disabled={salesLoading || cartLoading || !cartId}
                                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {salesLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <FaLock className="mr-2" />
                                            Finalizar compra por ${totalAmount?.toFixed(2) || '0.00'}
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    <FaLock className="inline mr-1" />
                                    Tu información está protegida y segura
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                            <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
                            
                            {/* Productos */}
                            <div className="space-y-3 mb-4">
                                {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentElement;
                                                parent.innerHTML = '<div class="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded">Sin imagen</div>';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">${item.subtotal?.toFixed(2) || '0.00'}</p>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500">No hay productos en el carrito</p>
                                )}
                            </div>
                            
                            <hr className="my-4" />
                            
                            {/* Totales */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal ({totalItems || 0} productos)</span>
                                    <span>${subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Envío</span>
                                    <span>
                                        {subtotal >= 70 ? (
                                            <span className="text-green-600 font-medium">GRATIS</span>
                                        ) : (
                                            `$${shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${totalAmount?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                            
                            {subtotal > 0 && subtotal < 70 && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
                                    <p className="text-green-700">
                                        Agrega ${(70 - subtotal).toFixed(2)} más para envío gratis
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
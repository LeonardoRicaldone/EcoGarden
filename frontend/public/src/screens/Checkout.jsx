import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaCreditCard, FaUser, FaMapMarkerAlt, FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import useShoppingCart from '../hooks/useShoppingCart';
import useSales from '../hooks/useSales';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
        loading: cartLoading,
        error: cartError
    } = useShoppingCart(isAuthenticated ? clientId : null);

    // Hook de ventas
    const {
        loading: salesLoading,
        processCompleteCheckout,
        error: salesError
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

    // Verificar autenticación y carrito al cargar - SIN TOAST DUPLICADOS
    useEffect(() => {
        // Dar tiempo para que el carrito se cargue completamente
        const timer = setTimeout(() => {
            if (cartLoading) return; // Aún está cargando

            if (!isAuthenticated) {
                console.log('User not authenticated, redirecting to login');
                navigate('/Login');
                return;
            }

            if (isEmpty) {
                console.log('Cart is empty, redirecting to cart');
                navigate('/ShoppingCart');
                return;
            }

            if (!cartId) {
                console.log('CartId missing, redirecting to cart');
                navigate('/ShoppingCart');
                return;
            }
        }, 1000); // Dar 1 segundo para que cargue

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
                value: /^\d{3}$/,
                message: 'CVV inválido (3 dígitos)'
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

    // Manejar envío del formulario - CORREGIDO
    const onSubmit = async (formData) => {
        // Prevenir múltiples envíos
        if (isSubmitting) return;
        
        setIsSubmitting(true);

        try {
            // Validaciones básicas sin toast
            if (!cartId) {
                console.error('Error: No cartId available');
                toast.error('Error: No se encontró el carrito. Recarga la página.');
                return;
            }

            if (isEmpty || !cartItems || cartItems.length === 0) {
                console.error('Error: Cart is empty');
                toast.error('Tu carrito está vacío');
                return;
            }

            // Calcular el total correctamente - CON MAYOR PRECISIÓN
            const currentSubtotal = parseFloat(getSubtotal().toFixed(2));
            const currentShippingCost = currentSubtotal >= 70 ? 0 : parseFloat(shippingCost.toFixed(2));
            const calculatedTotal = parseFloat((currentSubtotal + currentShippingCost).toFixed(2));
            
            
            if (!calculatedTotal || calculatedTotal <= 0) {
                console.error('Error: Invalid total amount:', calculatedTotal);
                toast.error('Error en el cálculo del total');
                return;
            }

            console.log('Starting complete checkout process...');
            
            // Procesar el checkout completo
            const result = await processCompleteCheckout(
                {
                    ...formData,
                    total: calculatedTotal // Usar el total calculado con precisión
                },
                cartId,
                processCheckout
            );

            if (result.success) {
                // Limpiar formulario
                reset();
                
                
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
            toast.error('Error al procesar la compra. Intenta nuevamente.', {
                duration: 4000,
                position: 'top-center'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const departamentos = [
        'San Salvador', 'La Libertad', 'Santa Ana', 'Sonsonate', 'La Paz',
        'San Vicente', 'Cabañas', 'Cuscatlán', 'Chalatenango', 'Ahuachapán',
        'Usulután', 'San Miguel', 'Morazán', 'La Unión'
    ];

    // Mostrar loading solo si realmente está cargando
    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4 mx-auto"></div>
                    <p className="text-lg">Preparando checkout...</p>
                </div>
            </div>
        );
    }

    // Solo mostrar redirigiendo si hay problemas después de cargar
    if (!cartLoading && (!isAuthenticated || isEmpty || !cartId)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4 mx-auto"></div>
                    <p className="text-lg">Redirigiendo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <br /><br />
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/ShoppingCart')}
                        className="back-button flex items-center mb-4 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Volver al carrito
                    </button>
                    <h1 className="title-color text-3xl font-bold">Finalizar compra</h1>
                    <p className="text-gray-600 mt-2">
                        Completa tu información para procesar el pedido
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Información personal */}
                            <div className="form-section">
                                <h2 className="section-title">
                                    <FaUser className="icon" />
                                    Información personal
                                </h2>
                                <div className="form-row form-row-2">
                                    <div>
                                        <label className="form-label block text-sm mb-1">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name', validations.name)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.name ? 'error' : ''
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="error-message">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label block text-sm mb-1">
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('lastname', validations.lastname)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.lastname ? 'error' : ''
                                            }`}
                                        />
                                        {errors.lastname && (
                                            <p className="error-message">{errors.lastname.message}</p>
                                        )}
                                    </div>
                                    <div className="form-row-full">
                                        <label className="form-label block text-sm mb-1">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            {...register('phone', validations.phone)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.phone ? 'error' : ''
                                            }`}
                                            placeholder="+503 1234-5678"
                                        />
                                        {errors.phone && (
                                            <p className="error-message">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dirección de envío */}
                            <div className="form-section">
                                <h2 className="section-title">
                                    <FaMapMarkerAlt className="icon" />
                                    Dirección de envío
                                </h2>
                                <div className="form-row form-row-2">
                                    <div>
                                        <label className="form-label block text-sm mb-1">
                                            Departamento *
                                        </label>
                                        <select
                                            {...register('department', validations.department)}
                                            className={`form-select w-full px-3 py-2 ${
                                                errors.department ? 'error' : ''
                                            }`}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {departamentos.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        {errors.department && (
                                            <p className="error-message">{errors.department.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label block text-sm mb-1">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('city', validations.city)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.city ? 'error' : ''
                                            }`}
                                        />
                                        {errors.city && (
                                            <p className="error-message">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label block text-sm mb-1">
                                            Código postal *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('zipCode', validations.zipCode)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.zipCode ? 'error' : ''
                                            }`}
                                            placeholder="1234"
                                        />
                                        {errors.zipCode && (
                                            <p className="error-message">{errors.zipCode.message}</p>
                                        )}
                                    </div>
                                    <div className="form-row-full">
                                        <label className="form-label block text-sm mb-1">
                                            Dirección completa *
                                        </label>
                                        <textarea
                                            {...register('address', validations.address)}
                                            rows={3}
                                            className={`form-textarea w-full px-3 py-2 ${
                                                errors.address ? 'error' : ''
                                            }`}
                                            placeholder="Calle, número de casa, referencias..."
                                        />
                                        {errors.address && (
                                            <p className="error-message">{errors.address.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Información de pago */}
                            <div className="form-section">
                                <h2 className="section-title">
                                    <FaCreditCard className="icon" />
                                    Información de pago
                                </h2>
                                <div className="form-row form-row-2">
                                    <div className="form-row-full">
                                        <label className="form-label block text-sm mb-1">
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
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.creditCard ? 'error' : ''
                                            }`}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                        {errors.creditCard && (
                                            <p className="error-message">{errors.creditCard.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label block text-sm mb-1">
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
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.expiryDate ? 'error' : ''
                                            }`}
                                            placeholder="MM/AA"
                                            maxLength={5}
                                        />
                                        {errors.expiryDate && (
                                            <p className="error-message">{errors.expiryDate.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label block text-sm mb-1">
                                            CVV *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('cvv', validations.cvv)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.cvv ? 'error' : ''
                                            }`}
                                            placeholder="123"
                                            maxLength={3}
                                        />
                                        {errors.cvv && (
                                            <p className="error-message">{errors.cvv.message}</p>
                                        )}
                                    </div>
                                    <div className="form-row-full">
                                        <label className="form-label block text-sm mb-1">
                                            Nombre en la tarjeta *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('cardName', validations.cardName)}
                                            className={`form-input w-full px-3 py-2 ${
                                                errors.cardName ? 'error' : ''
                                            }`}
                                            placeholder="Nombre completo como aparece en la tarjeta"
                                        />
                                        {errors.cardName && (
                                            <p className="error-message">{errors.cardName.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="form-section">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || salesLoading || cartLoading || !cartId}
                                    className="primary-button w-full py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting || salesLoading ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <FaLock className="mr-2" />
                                            Finalizar compra por ${totalAmount?.toFixed(2) || '0.00'}
                                        </>
                                    )}
                                </button>
                                <p className="security-message">
                                    <FaLock className="security-icon" />
                                    Tu información está protegida y segura
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="order-summary">
                            <h2 className="order-summary-title">Resumen del pedido</h2>
                            
                            {/* Productos */}
                            <div className="space-y-3 mb-4">
                                {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
                                    <div key={item.id} className="product-item">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentElement;
                                                parent.innerHTML = '<div class="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded">Sin imagen</div>';
                                            }}
                                        />
                                        <div className="product-info">
                                            <p className="product-name">{item.name}</p>
                                            <p className="product-quantity">Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className="product-price">${item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500">No hay productos en el carrito</p>
                                )}
                            </div>
                            
                            <hr className="my-4" />
                            
                            {/* Totales */}
                            <div className="space-y-2">
                                <div className="summary-row">
                                    <span>Subtotal ({totalItems || 0} productos)</span>
                                    <span>${subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Envío</span>
                                    <span>
                                        {subtotal >= 70 ? (
                                            <span className="free-shipping">GRATIS</span>
                                        ) : (
                                            `$${shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <hr className="my-2" />
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>${totalAmount?.toFixed(2) || '0.00'}</span>
                                </div>
                                
                            </div>
                            
                            {subtotal > 0 && subtotal < 70 && (
                                <div className="shipping-message">
                                    <p className="shipping-message-text">
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
import { useState, useEffect } from 'react';
import { FaHeart, FaSearch, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Nav.css';
import logo from '../../assets/logo.png';

const Nav = () => {
    // Guarda la posición anterior del scroll
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    // Controla la visibilidad de la navbar según el scroll
    const [visible, setVisible] = useState(true);
    // Controla si el menú móvil (hamburguesa) está abierto o cerrado
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // useEffect se ejecuta cuando cambia el scroll
    useEffect(() => {
        // Función que maneja el comportamiento del scroll
        const handleScroll = () => {
            const currentScrollPos = window.scrollY; // Posición actual del scroll
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
            // Si el usuario sube o está al principio, se muestra la navbar
            setPrevScrollPos(currentScrollPos); // Actualiza la posición anterior del scroll
            setVisible(isVisible); //cambia la visibilidad
        };

        // Agrega el evento de scroll al window
        window.addEventListener('scroll', handleScroll);

        // Limpia el evento de scroll al desmontar el componente
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]); //Dependencia: solo se ejecuta cuando cambia prevScrollPos

    // Efecto para manejar clics fuera del menú
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el menú está abierto y el clic no es en el botón de hamburguesa o en el menú
            if (isMenuOpen && !event.target.closest('.menu-toggle') && 
                !event.target.closest('.mobile-menu-container')) {
                setIsMenuOpen(false);
            }
        };

        // Solo agregar el evento si el menú está abierto
        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Función para alternar el menú móvil (hamburguesa)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`navbar ${visible ? "navbar-visible" : "navbar-hidden"}`}>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>

            {/* Menú para pantallas grandes */}
            <div className="nav-links">
                <a href="/" className="nav-link">Inicio</a>
                <a href="/products" className="nav-link">Productos</a>
                <a href="/favorites" className="nav-link">Favoritos</a>
                <a href="/contact" className="nav-link">Contáctanos</a>
                <a href="/about" className="nav-link">Sobre nosotros</a>
            </div>

            

            {/* Iconos para pantallas grandes */}
            <div className="nav-icons">
                <Link to="/login" className="icon-button">
                    <FaUser className="person-icon" />
                </Link>
                <Link to="/ShoppingCart" className="icon-button">
                    <FaShoppingCart className="cart-icon" />
                </Link>
            </div>

            {/* Botón Hamburguesa */}
            <button className="menu-toggle" onClick={toggleMenu}>
                <FaBars />
            </button>

            {/* Menú móvil que contiene todo */}
            <div className={`mobile-menu-container ${isMenuOpen ? 'active' : ''}`}>
                {/* Enlaces de navegación móvil */}
                <div className="nav-links">
                    <a href="/" className="nav-link">Inicio</a>
                    <a href="/products" className="nav-link">Productos</a>
                    <a href="/favorites" className="nav-link">Favoritos</a>
                    <a href="/contact" className="nav-link">Contáctanos</a>
                    <a href="/about" className="nav-link">Sobre nosotros</a>
                </div>

               

                {/* Iconos móviles */}
                <div className="nav-icons">
                    <Link to="/login" className="icon-button">
                        <FaUser className="person-icon" />
                    </Link>
                    <Link to="/ShoppingCart" className="icon-button">
                        <FaShoppingCart className="cart-icon" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
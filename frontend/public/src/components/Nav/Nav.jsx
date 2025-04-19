import { useState, useEffect } from 'react';
import { FaHeart, FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Nav.css';
import '../../screens/Login.jsx'
import logo from '../../assets/logo.png';

const Nav = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Obtiene la posición actual del scroll
            const currentScrollPos = window.scrollY;

            // Define si la navbar debe ser visible basado en la dirección del scroll
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
        };

        // Agregar event listener para el scroll
        window.addEventListener('scroll', handleScroll);

        // Limpieza del event listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    return (
        <nav className={`navbar ${visible ? "navbar-visible" : "navbar-hidden"}`}>
            {/* Logo */}
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>

            {/* Navigation Links */}
            <div className="nav-links">
                <a href="/" className="nav-link">Inicio</a>
                <a href="/offers" className="nav-link">Ofertas</a>
                <a href="/products" className="nav-link">Productos</a>
                <a href="/favorites" className="nav-link">Favoritos</a>
                <a href="/contact" className="nav-link">Contáctanos</a>
                <a href="/about" className="nav-link">Sobre nosotros</a>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar"
                    className="search-input"
                />
                <button className="search-button">
                    <FaSearch />
                </button>
            </div>

            {/* User and Cart Icons */}
            <div className="nav-icons">
                <Link to="/login" className="icon-button">
                    <FaUser className="person-icon" />
                </Link>
                <button className="icon-button">
                    <FaHeart className='fav-icon' />
                </button>
                <button className="icon-button">
                    <FaShoppingCart className='cart-icon' />
                </button>
            </div>
        </nav>
    );
};

export default Nav;
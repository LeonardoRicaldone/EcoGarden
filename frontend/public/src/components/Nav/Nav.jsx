import { useState, useEffect } from 'react';
import { FaHeart, FaSearch, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Nav.css';
import logo from '../../assets/logo.png';

const Nav = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`navbar ${visible ? "navbar-visible" : "navbar-hidden"}`}>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>

            {/* Botón Hamburguesa */}
            <button className="menu-toggle" onClick={toggleMenu}>
                <FaBars />
            </button>

            {/* Navigation Links */}
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <a href="/" className="nav-link">Inicio</a>
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
                <Link to="/ShoppingCart" className="icon-button">
                    <FaShoppingCart className="cart-icon" />
                </Link>
            </div>
        </nav>
    );
};

export default Nav;

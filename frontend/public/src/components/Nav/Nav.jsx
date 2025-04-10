import { FaHeart, FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import './Nav.css';
import logo from '../../assets/logo.png'


const Nav = () => {
    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="logo-container">
                <img src= {logo}alt="Logo" className="logo" />
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
                <button className="icon-button">
                    <FaUser />
                </button>
                <button className="icon-button">
                    <FaShoppingCart />
                </button>
            </div>
        </nav>
    );
};

export default Nav;
//import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import './Nav.css';

const Nav = () => {

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="logo-container">
                <img src="" alt="Logo" className="logo" />
            </div>

            {/* Navigation Links */}
            <div className="nav-links">
                <a href="/" className="nav-link">Home</a>

                <a href="/About" className="nav-link">About</a>

                <a href="/Contact" className="nav-link">
                    Contact
                </a>

                <a href="/Register" className="nav-link">
                    Register
                </a>

                <a href="/Login" className="nav-link">
                    Login
                </a>

                <a href="/Favorites" className="nav-link">
                    Favorites
                </a>

                <a href="/Products" className="nav-link">
                    Products
                </a>

                <a href="/Profile" className="nav-link">
                    Profile
                </a>

                <a href="/ShoppingCart" className="nav-link">
                    ShoppingCart
                </a>

                <a href="/TermsConditions" className="nav-link">
                    TermsConditions
                </a>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                
            </div>

            {/* User and Cart Icons */}
            <div className="nav-icons">
                
            </div>
        </nav>
    );
};

export default Nav;
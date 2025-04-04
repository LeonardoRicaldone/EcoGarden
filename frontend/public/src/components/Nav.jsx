import React from "react";

const Nav = () => {
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-lg font-bold">MyApp</div>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="hover:text-gray-200">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/About" className="hover:text-gray-200">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="/Contact" className="hover:text-gray-200">
                            Contact
                        </a>
                    </li>
                    <li>
                        <a href="/Register" className="hover:text-gray-200">
                        Register
                        </a>
                    </li>
                    <li>
                        <a href="/Login" className="hover:text-gray-200">
                        Login
                        </a>
                    </li>
                    <li>
                        <a href="/Favorites" className="hover:text-gray-200">
                        Favorites
                        </a>
                    </li>
                    <li>
                        <a href="/Products" className="hover:text-gray-200">
                        Products
                        </a>
                    </li>
                    <li>
                        <a href="/Profile" className="hover:text-gray-200">
                        Profile
                        </a>
                    </li>
                    <li>
                        <a href="/ShoppingCart" className="hover:text-gray-200">
                        ShoppingCart
                        </a>
                    </li>
                    <li>
                        <a href="/TermsConditions" className="hover:text-gray-200">
                        TermsConditions
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Nav;
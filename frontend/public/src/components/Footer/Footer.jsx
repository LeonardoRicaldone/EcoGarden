import React from 'react';
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <p>&copy; {new Date().getFullYear()} Mi Aplicación MERN</p>
    </footer>
  );
};

export default Footer;
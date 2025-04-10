import React from 'react';
import Nav from './Nav/Nav'; 

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default Layout;
// PrivateLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import { Toaster } from 'react-hot-toast';
import './PrivateLayout.css';

const PrivateLayout = () => {
  return (
    <div className="private-layout">
      <Nav />
      <main className="content-area">
        <Outlet />
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#f6faf6',
            color: '#2e7d32',
            border: '1px solid #d9e3d9',
          },
          success: {
            iconTheme: {
              primary: '#2e7d32',
              secondary: '#f6faf6',
            },
          },
          error: {
            iconTheme: {
              primary: '#d32f2f',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default PrivateLayout;
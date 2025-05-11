import React from 'react';
import "./Products.css"
import "./AddProduct.jsx"
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Products = () => {


    return (

        <>

<div className="productos-container">
      <div className="dashboard-btn">
        <button>
          <span className="material-icons">arrow_back</span>
          Dashboard
        </button>
      </div>
      
      

      <h1 className="titulo-productos">
        <span className="material-icons">inventory_2</span>
        Productos
      </h1>

      <div className="opciones-grid">
        <div className="opcion-card">
          <div className="opcion-titulo">Registrar productos</div>
          <div className="opcion-icono">
            <span className="material-icons">add_box</span>
          </div>
        </div>
        <div className="opcion-card">
          <div className="opcion-titulo">Inventario</div>
          <div className="opcion-icono">
            <span className="material-icons">shopping_cart</span>
          </div>
        </div>
        <div className="opcion-card">
          <div className="opcion-titulo">Categorías</div>
          <div className="opcion-icono">
            <span className="material-icons">park</span>
          </div>
        </div>
        <div className="opcion-card">
          <div className="opcion-titulo">Reporte general</div>
          <div className="opcion-icono">
            <span className="material-icons">description</span>
          </div>
        </div>
      </div>

      <div className="tabla-container">
        <div className="tabla-header">
          <h2>Productos destacados</h2>
          <div className="buscador">
            <span className="material-icons">search</span>
            <input type="text" placeholder="Buscar" />
          </div>
        </div>

        <div className="tabla-scroll">
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>PRODUCTOS</th>
                <th>STOCKS</th>
                <th>PRECIO</th>
                <th>VENTAS</th>
                <th>INGRESOS</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  nombre: 'Helecho de hogar',
                  stock: 657,
                  precio: 24.5,
                  ventas: 165,
                  ingresos: 4042.5,
                  img: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023',
                },
                {
                  nombre: 'Monstera para jardín',
                  stock: 456,
                  precio: 16.0,
                  ventas: 231,
                  ingresos: 3696,
                  img: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10093/10093154_1.jpg?12-11-2024',
                },
                {
                  nombre: 'Pachira aquatica Mini',
                  stock: 231,
                  precio: 26.0,
                  ventas: 97,
                  ingresos: 2522,
                  img: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10000/10000482_1.jpg?12-08-2024',
                },
                {
                  nombre: 'Chlorophytum orchidastrum',
                  stock: 579,
                  precio: 14.5,
                  ventas: 26,
                  ingresos: 377,
                  img: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/11060/11060472_1.jpg?01-08-2024',
                },
                {
                  nombre: 'Helecho Adiantum raddianum',
                  stock: 327,
                  precio: 19.0,
                  ventas: 106,
                  ingresos: 2014,
                  img: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023',
                },
                {
                  nombre: "Spathiphyllum wallisii 'Bellini'",
                  stock: 164,
                  precio: 12.65,
                  ventas: 126,
                  ingresos: 1593.9,
                  img: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10019/10019207_1.jpg?04-01-2024',
                },
              ].map((producto, index) => (
                <tr key={index}>
                  <td>
                    <div className="producto-nombre">
                      <img src={producto.img} alt="plant" />
                      {producto.nombre}
                    </div>
                  </td>
                  <td>{producto.stock}</td>
                  <td>$ {producto.precio.toFixed(2)}</td>
                  <td>{producto.ventas}</td>
                  <td>$ {producto.ingresos.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        
        </>
        
    )
}

export default Products;
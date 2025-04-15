import React from 'react';
import "./Dashboard.css"

const Dashboard = () => {

    return (

        <>

<div className="dashboard">
      <h1 className="dashboard-title">¡Bienvenido Administrador!</h1>

      <div className="dashboard-cards">
        <div className="card">
          <span className="card-title">Suma de ventas</span>
          <span className="card-value">118.73 mill.</span>
        </div>

        <div className="card">
          <span className="card-title">Recuento de productos</span>
          <span className="card-value">700</span>
        </div>

        <div className="card">
          <span className="card-title">Precio de manufactura</span>
          <span className="card-value">68 mil</span>
        </div>
      </div>
    </div>
        
        </>
    )

}

export default Dashboard;
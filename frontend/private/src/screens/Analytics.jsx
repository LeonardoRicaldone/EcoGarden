import React from 'react';
import { Link } from 'react-router-dom';
import "./Analytics.css"
import Header from '../components/Header';

const Analytics = () => {

    return (

        <>

<div className="estadisticas-container">
      <Header title={"Analytics"}/>

      {/* Tarjetas resumen */}
      <div className="estadisticas-cards">
        <div className="estadisticas-card">
          <h2>118.73 mill.</h2>
          <p>Suma de Sales</p>
        </div>
        <div className="estadisticas-card">
          <h2>700</h2>
          <p>Recuento de Product</p>
        </div>
        <div className="estadisticas-card">
          <h2>68 mil</h2>
          <p>Suma de Manufacturing Price</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="estadisticas-charts">
        <div className="estadisticas-chart">
          <h3>Suma de Sales por Country</h3>
          <div className="chart-bars">
            {[28, 27, 27, 26, 23].map((value, i) => (
              <div
                key={i}
                className="bar"
                style={{ height: `${value * 4}px` }}
              ></div>
            ))}
          </div>
          <div className="chart-labels">
            {['USA', 'Canada', 'France', 'Germany', 'Mexico'].map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>

        <div className="estadisticas-chart">
          <h3>Suma de Units Sold, Sale Price y Profit por Segment</h3>
          <div className="chart-multi-bars">
            {[[-80, 50, 30], [-40, 60, 35], [20, 50, 50], [50, 50, 40], [60, 60, 60]].map(
              (group, i) => (
                <div key={i} className="bar-group">
                  {group.map((val, j) => (
                    <div
                      key={j}
                      className={`bar-segment ${j === 2 ? 'profit' : 'price'}`}
                      style={{ height: `${Math.abs(val)}px`, marginTop: val < 0 ? `${Math.abs(val)}px` : '0' }}
                    ></div>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="chart-labels">
            {['Government', 'Midmarket', 'Enterprise', 'Channel Partners', 'Small Business'].map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>

        <div className="estadisticas-line-chart">
          <h3>Suma de Sales por Año, Trimestre, Mes y Día</h3>
          <div className="line-chart">
            <svg className="line-chart-svg">
              <polyline
                fill="none"
                stroke="#34D399"
                strokeWidth="3"
                points="0,140 40,80 80,120 120,100 160,110 200,90 240,130 280,70 320,140"
              />
            </svg> <br />
            <div className="line-chart-labels">
              <span>ene 2014</span>
              <span>jul 2014</span>
              <span>Año</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      
    

        
        </>
        
    )
}

export default Analytics;
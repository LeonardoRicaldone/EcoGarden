import React from "react";
import "./OrdersCard.css"

const OrdersCard = ({ name, date, imageUrl, onDetailsClick}) => {
  return (
    <div className="plant-card">
      <div className="card-content">
        <div className="image-container">
          <img
            src={imageUrl}
            alt={name}
            className="plant-image"
          />
        </div>
        
        <div className="info-container">
          <h3 className="plant-name">{name}</h3>
          <span className="plant-date">{date}</span>
          
          <div className="button-container">
            <button 
              onClick={onDetailsClick} 
              className="btn details-btn"
            >
              Ver detalles
            </button>
            
            <button className="btn status-btn">
              <svg
                className="edit-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Estado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;

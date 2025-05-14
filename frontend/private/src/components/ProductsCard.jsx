import React from "react";
import "./ProductsCard.css"

const ProductCard = ({ name, price, imageUrl }) => {

    return (

        <>

    <div className="cardPlant">
      <div className="centralDivPlant">
        <div className="imageContainerPlant">
          <img src={imageUrl} alt={name} className="plant-image" />
        </div>
        <div className="infoContainerPlant">
          <h3 className="plant-name">{name}</h3>
          <p className="price">$ <span>{price}</span></p>
          <div className="buttonGroup">
            <button className="btn details">Ver detalles</button>
            <button className="btn edit">Editar</button>
          </div>
        </div>
      </div>
    </div>

        
        </>
    )
}

export default ProductCard;
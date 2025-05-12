import React from "react";

const ProductCard = ({ name, price, imageUrl }) => {

    return (

        <>

<div className="cardPlant">
  <img src={imageUrl} alt={name} className="plant-image" />
  <h3 className="plant-name">{name}</h3>
  <p className="price">$ <span>{price}</span></p>
  <button className="btn details">Ver detalles</button>
  <button className="btn edit">Editar</button>
</div>

        
        </>
    )
}

export default ProductCard;
import React from "react";
import '../screens/Ratings.css';

const RatingsCard = ({ name, user, rating, imageUrl, comentario }) => {
  return (
    <div className="valoracion-card">
      <img src={imageUrl} alt={name} className="valoracion-img" />
      <div className="valoracion-info">
        <h2>{name}</h2>
        <p className="usuario">Usuario: <span>{user}</span></p>
        <div className="estrellas">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "estrella llena" : "estrella"}>★</span>
          ))}
          <span className="puntuacion">{rating.toFixed(1)}</span>
        </div>
        <p className="comentario"><strong>Comentario:</strong> <br />{comentario}</p>
      </div>
    </div>
  );
};

export default RatingsCard;
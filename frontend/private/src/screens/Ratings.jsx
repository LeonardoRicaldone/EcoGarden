import React from "react";
import "./Ratings.css";
import HeaderProducts from '../components/HeaderProducts';
import CardRating from '../components/Ratings/CardRating';
import useDataRatings from '../components/Ratings/hooks/useDataRatings';

const Ratings = () => {
  const {
    ratings,
    loading,
  } = useDataRatings();

  // Calcular estadísticas
  const totalRatings = ratings.length;
  const averageScore = totalRatings > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings).toFixed(1)
    : 0;

  // Función para redondear las calificaciones
  const roundScore = (score) => Math.round(score);

  const scoreDistribution = [5, 4, 3, 2, 1].map(score => ({
    score,
    count: ratings.filter(rating => roundScore(rating.score) === score).length,
    percentage: totalRatings > 0 
      ? ((ratings.filter(rating => roundScore(rating.score) === score).length / totalRatings) * 100).toFixed(1)
      : 0
  }));

  return (
    <>
      <div className="productos-container">
        <HeaderProducts title={"Ratings"} />

        {/* Contenido */}
        <div className="ratings-content">
          {/* Sección de estadísticas */}
          <div className="ratings-stats">
            <h2>Estadísticas de Calificaciones</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Promedio General</h3>
                <div className="average-score">
                  <span className="score-large">{averageScore}</span>
                  <div className="stars-large">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span 
                        key={star} 
                        className={star <= Math.round(averageScore) ? "star filled" : "star empty"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <h3>Total de Reseñas</h3>
                <span className="total-reviews">{totalRatings}</span>
              </div>
            </div>

            {/* Distribución de puntuaciones */}
            <div className="score-distribution">
              <h3>Distribución de Puntuaciones</h3>
              {scoreDistribution.map(({ score, count, percentage }) => (
                <div key={score} className="score-bar">
                  <span className="score-label">{score} ★</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="score-count">{count} ({percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Separador */}
          <div className="separador"></div>

          {/* Sección Listado de Ratings */}
          <div className="listado-ratings">
            <h2>Reseñas de Productos</h2>
            {loading ? (
              <div className="loading">Cargando reseñas...</div>
            ) : (
              <div className="ratings-grid">
                {ratings.length === 0 ? (
                  <div className="no-ratings">No hay reseñas registradas</div>
                ) : (
                  ratings.map((rating) => (
                    <CardRating
                      key={rating._id}
                      rating={rating}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ratings;
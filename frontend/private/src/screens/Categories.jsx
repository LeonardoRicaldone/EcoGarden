import { Link } from "react-router-dom"
import "./Categories.css"

const Categories = () => {

    return (

        <>

<div className="productos-container">
<div className="dashboard-btn">
      <Link to={"/products"}><button>
          <span className="material-icons">arrow_back</span>
          Regresar
        </button></Link>
      </div>

      <h1 className="titulo-productos">
        <span className="material-icons">inventory_2</span>
        Categorías
      </h1>

      {/* Contenido */}
      <div className="categorias-content">
        {/* Sección Agregar categoría */}
        <div className="agregar-categoria">
          <h2>Agregar categoría</h2>
          <label>Nombre de categoría</label>
          <input type="text" className="input-categoria" />
          <button className="registrar-button">Agregar categoría</button>
        </div>

        {/* Separador */}
        <div className="separador"></div>

        {/* Sección Listado */}
        <div className="listado-categorias">
          <h2>Listado de categorías</h2>
          <div className="categoria-lista">
            {[
              "Árboles frutales",
              "Flores",
              "Orquídeas",
              "Arbustos",
              "Árboles frutales",
              "Flores",
              "Orquídeas",
              "Arbustos"
            ].map((cat, index) => (
              <div key={index} className="categoria-item">
                <span>🌱</span> {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>


        
        </>
    )
}

export default Categories;
import { Link } from "react-router-dom"

const ProductsNav = () => {

    return (

        <>
        <div className="opciones-grid">
              <Link to={"/products/addproduct"}><div className="opcion-card">
                  <div className="opcion-titulo">Registrar productos</div>
                  <div className="opcion-icono">
                    <span className="material-icons">add_box</span>
                  </div>
                </div></Link>
                <Link to={"/products/inventary"}><div className="opcion-card">
                  <div className="opcion-titulo">Inventario</div>
                  <div className="opcion-icono">
                    <span className="material-icons">shopping_cart</span>
                  </div>
                </div></Link>
                <Link to={"/products/categories"}><div className="opcion-card">
                  <div className="opcion-titulo">Categorías</div>
                  <div className="opcion-icono">
                    <span className="material-icons">park</span>
                  </div>
                </div></Link>
                <div className="opcion-card">
                  <div className="opcion-titulo">Reporte general</div>
                  <div className="opcion-icono">
                    <span className="material-icons">description</span>
                  </div>
                </div>
              </div>
        </>
    )
}

export default ProductsNav;
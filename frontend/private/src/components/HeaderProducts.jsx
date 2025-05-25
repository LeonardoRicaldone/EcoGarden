import { Link } from "react-router-dom"

const HeaderProducts = ({title}) => {

    return (
        <>
        <div className="dashboard-btn">
        <Link to={"/products"}><button> 
        <span className="material-icons">arrow_back</span>
          Products
        </button></Link>
      </div>
      
      

      <h1 className="titulo-productos">
        <span className="material-icons">inventory_2</span>
        {title}
      </h1>
        </>
    )
}

export default HeaderProducts;
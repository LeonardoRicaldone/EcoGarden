import { Link } from "react-router-dom"

const Header = ({title}) => {

    return (
        <>
        <div className="dashboard-btn">
        <Link to={"/"}><button> 
        <span className="material-icons">arrow_back</span>
          Dashboard
        </button></Link>
      </div>
      
      

      <h1 className="titulo-productos">
        <span className="material-icons">inventory_2</span>
        {title}
      </h1>
        </>
    )
}

export default Header;
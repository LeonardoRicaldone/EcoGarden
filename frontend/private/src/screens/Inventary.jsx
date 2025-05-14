import ProductsCard from '../components/ProductsCard';
import { Link } from "react-router-dom"

const Inventary = () => {

    const products = [
        {
          name: 'Pachira aquatica Mini',
          price: 16.95,
          imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023', // reemplaza por la ruta real de la imagen
        },
        {
          name: 'Helecho Adiantum raddinum',
          price: 9.95,
          imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10093/10093154_1.jpg?12-11-2024',
        },
        {
          name: 'Helecho Aspleium antiquum',
          price: 8.25,
          imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10000/10000482_1.jpg?12-08-2024',
        },
        {
          name: 'Helecho Nephrópis exaltata',
          price: 9.95,
          imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/11060/11060472_1.jpg?01-08-2024',
        },
        {
          name: 'Monstera deliciosa',
          price: 15.95,
          imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023',
        },
        {
          name: "Peperomia 'Bohemian Bravour'",
          price: 17.95,
          imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10019/10019207_1.jpg?04-01-2024',
        }
      ];

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
        Inventario
      </h1>

      <div className="buscador">
        <span className="material-icons">search</span>
        <input type="text" placeholder="Buscar productos" />
      </div> <br />

      <div className="scrollable-cards">
        <div className="products-grid">
          {products.map((item, index) => (
            <ProductsCard
              key={index}
              name={item.name}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
        
        </>
    )
}

export default Inventary;
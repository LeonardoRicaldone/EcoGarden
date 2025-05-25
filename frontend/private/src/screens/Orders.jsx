import OrdersCard from '../components/OrdersCard';
import { Link } from 'react-router-dom';
import "./Orders.css"
import Header from '../components/Header';
import Searcher from '../components/Searcher';

const pedidos = [
  {
    name: 'Pachira aquatica Mini',
    date: '29/03/25',
    imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10000/10000482_1.jpg?12-08-2024',
  },
  {
    name: 'Helecho Adiantum raddinum',
    date: '06/04/25',
    imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023',
  },
  {
    name: 'Helecho Aspleium antiquum',
    date: '11/11/25',
    imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10001/10001990_1.jpg?26-03-2025',
  },
  {
    name: 'Helecho Nephropis exaltata',
    date: '01/06/25',
    imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10000/10000848_1.jpg?14-09-2023',
  },
  {
    name: 'Monstera deliciosa',
    date: '23/05/25',
    imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10093/10093154_1.jpg?12-11-2024',
  },
  {
    name: "Peperomia 'Bohemian Bravour'",
    date: '12/04/25',
    imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/11203/11203807_1.jpg?18-09-2023',
  },
];

const Orders = () => {
  return (

    <div className="productos-container">
    <Header title={"Orders"}/>

    <Searcher placeholder={"Buscar ordenes"}/>
 

    
      <div className="scrollable-cards">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {pedidos.map((pedido, index) => (
          <OrdersCard
            key={index}
            name={pedido.name}  // Cambié 'nombre' por 'name'
            date={pedido.date}    // Cambié 'fecha' por 'date'
            imageUrl={pedido.imageUrl}  // Cambié 'imagen' por 'imageUrl'
          />
        ))}
      </div>
    </div>
    </div>

    
  );
};

export default Orders;

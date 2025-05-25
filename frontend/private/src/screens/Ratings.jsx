import React from 'react';
import RatingsCard from '../components/RatingsCard';
import './Ratings.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const valoraciones = [
    {
      name: 'Pachira aquatica Mini',
      user: 'Gabriel Soto',
      rating: 5.0,
      imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10000/10000482_1.jpg?12-08-2024',
      comentario: '¡Increíble calidad! La Monstera llegó en perfecto estado, con hojas grandes y sanas. Se nota que la cuidan bien antes de enviarla. Además, el empaque fue excelente, sin daños en el transporte. Definitivamente compraré más plantas aquí.',
    },
    {
      name: 'Helecho Adiantum raddinum',
      user: 'Luis Rodríguez',
      rating: 4.0,
      imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023',
      comentario: 'Me encantó esta suculenta, es aún más bonita en persona. Llegó muy bien protegida y en excelente estado. No necesita muchos cuidados, perfecta para decorar mi escritorio. ¡Recomendada al 100%!',
    },
    {
      name: 'Monstera deliciosa silvestre',
      user: 'Javier Castillo',
      rating: 4.0,
      imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10093/10093154_1.jpg?12-11-2024',
      comentario: '¡Hermosa y elegante! Las flores son espectaculares y duraderas, la recibí bien hidratada y en floración, lista para decorar mi sala. El servicio fue muy amable y resolvió todas mis dudas. ¡Volveré a comprar!',
    },
    {
        name: "Peperomia 'Bohemian Bravour'",
        user: 'Paula Vasquez',
        rating: 5.0,
        imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/11203/11203807_1.jpg?18-09-2023',
        comentario: 'Excelente opción para empezar a cultivar en casa. Las semillas germinaron rápido y el sustrato era de gran calidad. Súper recomendada para principiantes.',
      },
    {
      name: "Pachira aquatica Mini'",
      user: 'Sandra Barrera',
      rating: 5.0,
      imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10000/10000482_1.jpg?12-08-2024',
      comentario: 'Excelente opción para empezar a cultivar en casa. Las semillas germinaron rápido y el sustrato era de gran calidad. Súper recomendada para principiantes.',
    },
    {
        name: "Helecho Adiantum raddinum'",
        user: 'Ariel Castillo',
        rating: 3.0,
        imageUrl: 'https://res.cloudinary.com/fronda/image/upload/f_auto,q_auto,c_fill,g_center,w_702,h_936/productos/fol/10003/10003600_1.jpg?14-09-2023',
        comentario: 'Excelente opción para empezar a cultivar en casa. Las semillas germinaron rápido y el sustrato era de gran calidad. Súper recomendada para principiantes.',
      },
  ];

const Ratings = () => {

    return (

        <>

<div className="productos-container">
      <Header title={"Ratings"} where={"/"}/>

      <div className="buscador">
        <span className="material-icons">search</span>
        <input type="text" placeholder="Buscar valoraciones" />
      </div> <br />

      <div className="scrollable-cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          {valoraciones.map((item, index) => (
            <RatingsCard
              key={index}
              name={item.name}
              user={item.user}
              rating={item.rating}
              imageUrl={item.imageUrl}
              comentario={item.comentario}
            />
          ))}
        </div>
      </div>
    </div>
        
        </>
        
    )
}

export default Ratings;
import React, { useState } from 'react';

const Searcher = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // cuando se cambia el input, actualiza el estado y llama a la función onSearch
  const handleChange = (e) => {
    const value = e.target.value;
    // Evita que se envíe el formulario al presionar Enter
    setSearchTerm(value);
    if (onSearch) {
      // Llama a la función onSearch con el valor actual del input
      onSearch(value);
    }
  };

  return (
    <>
    <div className="buscador">
      <span>🔍</span>
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={searchTerm}
        // Elimina el valor del input al hacer clic en el icono de búsqueda
        onChange={handleChange}
      />
    </div> <br />
    </>
  );
};

export default Searcher;


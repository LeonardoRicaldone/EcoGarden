import React, { useState } from 'react';

const Searcher = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="buscador">
      <span>🔍</span>
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default Searcher;
import React from 'react';

const BarraPesquisa = ({ placeholder, onChange }) => {
  return (
    <input
      type="text"
      className="form-control mb-4"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default BarraPesquisa;

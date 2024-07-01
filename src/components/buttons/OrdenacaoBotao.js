
import React from 'react';

const Ordenacao = ({ onClick, direction }) => {
  return (
    <button className="btn btn-secondary" onClick={onClick}>
      Ordenar por ID {direction === 'asc' ? '⬆️' : '⬇️'}
    </button>
  );
};

export default Ordenacao;

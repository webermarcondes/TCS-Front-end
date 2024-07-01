import React, { useEffect, useState } from 'react';
import apiCoordenadores from "../../services/apiCoordenadores/apiCoordenadores";
import { useNavigate } from 'react-router-dom';
import Pagination from '../buttons/Paginacao';
import BarraPesquisa from '../buttons/BarraPesquisa';
import Ordenacao from '../buttons/OrdenacaoBotao';
import FormatarCPF from '../Formatações/FormatarCPF';
const ListaCoordenadores = () => {
  const [coordenadores, setCoordenadores] = useState([]);

  //campo de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);  // Número de itens por página
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const carregarCoordenadores = async () => {
      try {
        const data = await apiCoordenadores.getCoordenadores();
        console.log(data)
        if (Array.isArray(data)) {
          const coordenadores = data.filter(coordenador => coordenador.nivelPermissao === 'COORDENADOR');
          setCoordenadores(coordenadores);
        } else {
          console.error('Não há coordenadores cadastrados no sistema:', data);
        }
      } catch (error) {
        console.error('Erro ao carregar coordenadores:', error);
      }
    };
    carregarCoordenadores();
  }, []);

  const atualizarStatusCoordenador = async (id, novoStatus) => {
    try {
      await apiCoordenadores.updateCoordenadorStatus(id, novoStatus);
      setCoordenadores(coordenadores.map(cod => cod.id === id ? { ...cod, status: novoStatus } : cod));
    } catch (error) {
      console.error(`Erro ao atualizar status do coordenador para ${novoStatus}:`, error);
    }
  };
  
  const editarCoordenador = (id) => {
    navigate(`/editarCoordenador/${id}`);
  };

  // Filtrar coordenadores com base no termo de pesquisa
  const filteredCoordenadores = coordenadores.filter(coordenador =>
    coordenador.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar coordenadores com base na direção de ordenação
  const sortedCoordenadores = filteredCoordenadores.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });
  
  // Obter os itens atuais para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCoordenadores.slice(indexOfFirstItem, indexOfLastItem);

  // Alterar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Alternar a direção de ordenação
  const toggleSortDirection = () => {
    setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };
  
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lista de Coordenadores</h2>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <BarraPesquisa placeholder="Pesquisar por nome de coordenador..." onChange={setSearchTerm} />
        </div>
        <div>
          <Ordenacao onClick={toggleSortDirection} direction={sortDirection} />
        </div>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((coordenador) => (
              <tr key={coordenador.id}>
                <td>{coordenador.id}</td>
                <td>{coordenador.nome}</td>
                <td>{coordenador.email}</td>
                <td>{FormatarCPF(coordenador.cpf)}</td>
                <td>{coordenador.status}</td>
                <td>
                  <button 
                    onClick={() => editarCoordenador(coordenador.id)} 
                    className="btn btn-warning btn-sm text-white me-2"
                  >
                    Editar
                  </button>
                  {coordenador.status === 'ATIVO' ? (
                    <button 
                      onClick={() => atualizarStatusCoordenador(coordenador.id, 'INATIVO')} 
                      className="btn btn-danger btn-sm"
                    >
                      Desativar
                    </button>
                  ) : (
                    <button 
                      onClick={() => atualizarStatusCoordenador(coordenador.id, 'ATIVO')} 
                      className="btn btn-success btn-sm"
                    >
                      Ativar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">Nenhum coordenador encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination 
        itemsPerPage={itemsPerPage} 
        totalItems={filteredCoordenadores.length} 
        paginate={paginate} 
        currentPage={currentPage} 
      />
      <button 
        className='btn btn-lg btn-primary' 
        onClick={() => navigate('/cadastroCoordenador/')}
      >
        Cadastrar novo coordenador
      </button>
    </div>
  );
}

export default ListaCoordenadores;

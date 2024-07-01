import React, { useEffect, useState } from 'react';
import apiProfessores from "../../services/apiProfessores.js/ApiProfessores";
import { useNavigate } from 'react-router-dom';
import Pagination from '../buttons/Paginacao';
import BarraPesquisa from '../buttons/BarraPesquisa';
import Ordenacao from '../buttons/OrdenacaoBotao';
import FormatarTelefone from '../Formatações/FormatarTelefone';
import FormatarCPF from '../Formatações/FormatarCPF';

const ListaProfessores = () => {
  const [professores, setProfessores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de itens por página
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const carregarProfessores = async () => {
      try {
        const data = await apiProfessores.getProfessores();
        if (Array.isArray(data)) {
          setProfessores(data);
        } else {
          console.error('Não há professores cadastrados no sistema:', data);
        }
      } catch (error) {
        console.error('Erro ao carregar professores:', error);
      }
    };
    carregarProfessores();
  }, []);

  const editarProfessor = (id) => {
    navigate(`/editarProfessor/${id}`);
  };
  
  const atualizarStatusProfessor = async (id, novoStatus) => {
    try {
      await apiProfessores.updateProfessorStatus(id, novoStatus);
      setProfessores(professores.map(prof => prof.id === id ? { ...prof, status: novoStatus } : prof));
    } catch (error) {
      console.error(`Erro ao atualizar status do professor para ${novoStatus}:`, error);
    }
  };

  // Filtrar professores com base no termo de pesquisa
  const filteredProfessores = professores.filter(professor =>
    professor.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar professores com base na direção de ordenação
  const sortedProfessores = filteredProfessores.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  // Obter os itens atuais para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProfessores.slice(indexOfFirstItem, indexOfLastItem);

  // Alterar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSortDirection = () => {
    setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };
  return (
    <div className="container mt-5">
      <div className="">
        <h2>Lista de Professores</h2>
        <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <BarraPesquisa placeholder="Pesquisar por nome de professor..." onChange={setSearchTerm} />
        </div>
        <div>
          <Ordenacao onClick={toggleSortDirection} direction={sortDirection} />
        </div>
      </div>
      </div>
      <table className="table table-striped table-bordered mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome Completo</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Quantidade de Dias de Aula</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((professor) => (
              <tr key={professor.id}>
                <td>{professor.id}</td>
                <td>{professor.nomeCompleto}</td>
                <td>{FormatarTelefone(professor.telefone)}</td>
                <td>{FormatarCPF(professor.cpf)}</td>
                <td>{professor.qtdeDiasDeAula}</td>
                <td>{professor.status}</td>
                <td>
                  <button onClick={() => editarProfessor(professor.id)} className="btn btn-sm btn-warning px-2 me-2">Editar</button>
                  {professor.status === 'ATIVO' ? (
                    <button onClick={() => atualizarStatusProfessor(professor.id, 'INATIVO')} className='btn btn-sm btn-danger'>Desativar</button>
                  ) : (
                    <button onClick={() => atualizarStatusProfessor(professor.id, 'ATIVO')} className='btn btn-sm btn-success'>Ativar</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Nenhum professor encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination itemsPerPage={itemsPerPage} totalItems={professores.length} paginate={paginate} currentPage={currentPage} />
      <button className='btn btn-lg btn-primary' onClick={() => navigate('/cadastro/')}>Cadastrar novo professor</button>
    </div>
  );
}

export default ListaProfessores;

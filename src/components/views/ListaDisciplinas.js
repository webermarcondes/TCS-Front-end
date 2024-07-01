import React, { useEffect, useState } from 'react';
import apiDisciplinas from "../../services/apiDisciplinas/apiDisciplinas";
import apiFases from "../../services/apiFases/apiFases";
import apiCursos from "../../services/apiCursos/ApiCursos";
import { useNavigate } from 'react-router-dom';
import ExclusaoModal from '../modals/ExclusaoModal';
import Pagination from '../buttons/Paginacao';
import BarraPesquisa from '../buttons/BarraPesquisa';
import Ordenacao from '../buttons/OrdenacaoBotao'; 
import ModalCadastros from '../modals/ModalCadastros';

const ListaDisciplinas = () => {
    const [disciplinas, setDisciplinas] = useState([]);
    const [coordenadores, setCoordenadores] = useState({});
    const [fases, setFases] = useState({});
    const [cursos, setCursos] = useState({});
    //Confirmação de modal cadastros
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);
    
  //campo de busca
        const [searchTerm, setSearchTerm] = useState('');
        const [sortDirection, setSortDirection] = useState('asc');
    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);  // Número de itens por página
    
    // Modal de exclusão
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [disciplinasResponse, fasesResponse, cursosResponse] = await Promise.all([
                    apiDisciplinas.getDisciplinas(),
                    apiFases.getFases(),
                    apiCursos.getCursos()
                ]);

                setDisciplinas(disciplinasResponse);

                const cursosMap = cursosResponse.data.reduce((acc, curso) => {
                    acc[curso.id] = curso.nome;
                    return acc;
                }, {});
                setCursos(cursosMap);

                const fasesMap = fasesResponse.data.reduce((acc, fase) => {
                    acc[fase.id] = {
                        numero: fase.numero,
                        curso: cursosMap[fase.cursoId]
                    };
                    return acc;
                }, {});
                setFases(fasesMap);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };
        carregarDados();
    }, []);
    
    const excluirDisciplina = async (id) => {
        try {
            await apiDisciplinas.excludeDisciplinas(id);
            setDisciplinas(disciplinas.filter(disciplina => disciplina.id !== id));
            setFeedbackSuccess(true);
            setFeedbackMessage('disciplina excluída com sucesso.');
            setShowFeedbackModal(true);
        } catch (erro) {
            setFeedbackSuccess(false);
            setFeedbackMessage('Erro ao excluir curso.');
            setShowFeedbackModal(true); 
        }
        setShowModal(false); 
    };

    const confirmarExclusao = (id) => {
        setSelectedItem(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        excluirDisciplina(selectedItem);
    };

    const handleClose = () => {
        setShowModal(false);
    };
    
    
    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
        if (feedbackSuccess) {
            const reloadDisciplinas = async () => {
                try {
                    const disciplinasResponse = await apiDisciplinas.getDisciplinas()
                    setCursos(disciplinasResponse.data);
                } catch (error) {
                    console.error('Erro ao recarregar dados após exclusão:', error);
                }
            };
            reloadDisciplinas();
        }
    };
    
    const editarDisciplina = (id) => {
        navigate(`/editarDisciplina/${id}`);
    };

    // Ordenar disciplinas por ID
    const sortedDisciplinas = [...disciplinas].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.id - b.id;
        } else {
            return b.id - a.id;
        }
    });

    // Filtrar disciplinas pelo termo de busca
    const filteredDisciplinas = sortedDisciplinas.filter(disciplina =>
        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obter os itens atuais
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  
    // Alterar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Alternar a ordenação
    const toggleSortDirection = () => {
        setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
      };
    
    // Atualizar o termo de busca
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="container mt-5">
            <h2>Lista de Disciplinas</h2>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <BarraPesquisa placeholder="Pesquisar por nome de disciplina..." onChange={setSearchTerm} />
                </div>
                <div>
                    <Ordenacao onClick={toggleSortDirection} direction={sortDirection} />
                </div>
      </div>
            <table className='table table-striped table-bordered'>
                <thead className=''>
                    <tr className='fs-5 mb-2'>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Carga Horária</th>
                        <th>Fase</th>
                        <th>Curso</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className=' table-group-divider '>
                    {currentItems.length > 0 ? (
                        currentItems.map((disciplina) => (
                            <tr key={disciplina.id} className='fs-6'>
                                <td>{disciplina.id}</td>
                                <td>{disciplina.nome}</td>
                                <td>{disciplina.cargaHoraria}</td>
                                <td>{disciplina.fase.numero}</td>
                                <td>{disciplina.fase.curso.nome}</td>
                                <td className=''>
                                    <button onClick={() => editarDisciplina(disciplina.id)} className='btn btn-warning btn-sm text-white me-2'>Editar</button>
                                    
                                    <button onClick={() => confirmarExclusao(disciplina.id)} className='btn btn-sm btn-danger'>Excluir</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Nenhuma disciplina encontrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination itemsPerPage={itemsPerPage} totalItems={filteredDisciplinas.length} paginate={paginate} currentPage={currentPage} />
            
            <button className='btn btn-lg btn-primary' onClick={() => navigate('/cadastroDisciplina/')}>Cadastrar nova disciplina</button>
            <ExclusaoModal 
                show={showModal} 
                handleClose={handleClose} 
                handleConfirm={handleConfirm} 
                item={`Disciplina ${selectedItem}`} 
            />
            
            <ModalCadastros
                show={showFeedbackModal}
                handleClose={handleCloseFeedbackModal}
                message={feedbackMessage}
                success={feedbackSuccess}
            />
        </div>
    );
}

export default ListaDisciplinas;

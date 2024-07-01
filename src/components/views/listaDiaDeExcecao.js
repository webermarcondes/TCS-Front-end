import React, { useEffect, useState } from 'react';
import apiDiaExcecao from '../../services/apiDiaExcecao/apiDiaExcecao';
import { useNavigate } from 'react-router-dom';
import ExclusaoModal from '../modals/ExclusaoModal';
import ModalCadastros from '../modals/ModalCadastros';
import Pagination from '../buttons/Paginacao';
import BarraPesquisa from '../buttons/BarraPesquisa'; // Importação da BarraPesquisa
import Ordenacao from '../buttons/OrdenacaoBotao'; // Importação da Ordenacao

const ListaDiaExcecao = () => {
    const [diasExcecao, setDiasExcecao] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);  // Número de itens por página
    
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Feedback modal states
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarDiasExcecao = async () => {
            try {
                const response = await apiDiaExcecao.getDiaExcecoes();
                const data = response;
                if (Array.isArray(data)) {
                    setDiasExcecao(data);
                } else {
                    console.error('Não há dias de exceção cadastrados no sistema:', data);
                }
            } catch (error) {
                console.error('Erro ao carregar dias de exceção:', error);
            }
        };
        carregarDiasExcecao();
    }, []);
    
    const editarDiaExcecao = (id) => {
        navigate(`/editarDiaExcecao/${id}`);
    };

    const excluirDiaExcecao = async (id) => {
        try {
            await apiDiaExcecao.excludeDiaExcecao(id);
            setDiasExcecao(diasExcecao.filter(diaExcecao => diaExcecao.id !== id));
            setFeedbackSuccess(true);
            setFeedbackMessage('Dia de exceção excluído com sucesso.');
        } catch (erro) {
            console.log('Erro na exclusão de dia de exceção', erro);
            setFeedbackSuccess(false);
            setFeedbackMessage('Erro ao excluir dia de exceção.');
        } finally {
            setShowFeedbackModal(true);
            setShowModal(false);
        }
    };

    const confirmarExclusao = (id) => {
        setSelectedItem(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        excluirDiaExcecao(selectedItem);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleFeedbackClose = () => {
        setShowFeedbackModal(false);
    };

    // Ordenar dias de exceção por ID
    const sortedDiasExcecao = [...diasExcecao].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.id - b.id;
        } else {
            return b.id - a.id;
        }
    });

    // Filtrar dias de exceção pelo termo de busca
    const filteredDiasExcecao = sortedDiasExcecao.filter(dia =>
        dia.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obter os itens atuais
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDiasExcecao.slice(indexOfFirstItem, indexOfLastItem);
      
    // Alterar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Alternar a ordenação
    const toggleSortOrder = () => {
        setSortDirection(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };
    
    // Atualizar o termo de busca
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="container mt-5">
            <h2>Lista de Dias de Exceção</h2>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <BarraPesquisa placeholder="Pesquisar por motivo..." onChange={handleSearch} />
                </div>
                <div>
                    <Ordenacao onClick={toggleSortOrder} direction={sortDirection} />
                </div>
            </div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Motivo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((dia) => (
                            <tr key={dia.id}>
                                <td>{dia.id}</td>
                                <td>{dia.data}</td>
                                <td>{dia.motivo}</td>
                                <td>
                                    <button 
                                        onClick={() => editarDiaExcecao(dia.id)} 
                                        className='btn btn-warning btn-sm text-white px-2 me-2'>
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => confirmarExclusao(dia.id)} 
                                        className='btn btn-sm btn-danger'>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Nenhum dia de exceção encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination itemsPerPage={itemsPerPage} totalItems={filteredDiasExcecao.length} paginate={paginate} currentPage={currentPage} />
            <button className='btn btn-lg btn-primary' onClick={() => navigate('/cadastroDiaExcecao/')}>Cadastrar novo dia especial</button>
            <ExclusaoModal 
                show={showModal} 
                handleClose={handleClose} 
                handleConfirm={handleConfirm} 
                item={`DiaExcecao ${selectedItem}`} 
            />
            <ModalCadastros
                show={showFeedbackModal}
                handleClose={handleFeedbackClose}
                message={feedbackMessage}
                success={feedbackSuccess}
            />
        </div>
    );
}

export default ListaDiaExcecao;

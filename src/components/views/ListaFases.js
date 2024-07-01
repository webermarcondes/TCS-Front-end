import React, { useEffect, useState } from 'react';
import apiFases from "../../services/apiFases/apiFases";
import { useNavigate } from 'react-router-dom';
import ExclusaoModal from '../modals/ExclusaoModal';
import Pagination from '../buttons/Paginacao';
import ModalCadastros from '../modals/ModalCadastros';

const ListaFases = () => {
    const [fases, setFases] = useState([]);
    
    //Paginacao
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);  // Número de itens por página
    
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    
    const navigate = useNavigate();

    useEffect(() => {
        const carregarFases = async () => {
            try {
                const response = await apiFases.getFases();
                const data = response.data;
                if (Array.isArray(data)) {
                    setFases(data);
                } else {
                    console.error('Não há fases cadastradas no sistema:', data);
                }
            } catch (error) {
                console.error('Erro ao carregar fases:', error);
            }
        };
        carregarFases();
    }, []);
    const excluirFase = async (id) => {
        try {
            await apiFases.excludeFase(id);
            setFases(fases.filter(fase => fase.id !== id));
            setFeedbackSuccess(true);
            setFeedbackMessage('fase excluída com sucesso.');
            setShowFeedbackModal(true);
        } catch (erro) {
            setFeedbackSuccess(false);
            setFeedbackMessage('Erro ao excluir curso.');
            setShowFeedbackModal(true);
        }
        setShowModal(false); // Fecha o modal após a exclusão
    };

    const confirmarExclusao = (id) => {
        setSelectedItem(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        excluirFase(selectedItem);
    };

    const handleClose = () => {
        setShowModal(false);
    };
    
    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
        if (feedbackSuccess) {
            const reloadFases = async () => {
                try {
                    const fasesResponse = await apiFases.getFases()
                    setFases(fasesResponse.data)
                } catch (error) {
                    console.error('Erro ao recarregar dados após exclusão:', error);
                }
            };
            reloadFases();
        }
    };
    
    const editarFase = (id) => {
        navigate(`/editarFase/${id}`);
    };

      // Obter os itens atuais
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = fases.slice(indexOfFirstItem, indexOfLastItem);
    
      // Alterar página
      const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Lista de Fases</h2>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Curso</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((fase) => (
                            <tr key={fase.id}>
                                <td>{fase.id}</td>
                                <td>{fase.numero}</td>
                                <td>{fase.curso.nome}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => editarFase(fase.id)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => confirmarExclusao(fase.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Nenhuma fase encontrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination itemsPerPage={itemsPerPage} totalItems={fases.length} paginate={paginate} currentPage={currentPage} />
            
            <button className='btn btn-lg btn-primary' onClick={() => navigate('/cadastroFase/')}>Cadastrar nova Fase</button>
            <ExclusaoModal 
                show={showModal} 
                handleClose={handleClose} 
                handleConfirm={handleConfirm} 
                item={`Fase ${selectedItem}`} 
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

export default ListaFases;

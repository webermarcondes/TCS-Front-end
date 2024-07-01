import React, { useEffect, useState } from 'react';
import apiCursos from "../../services/apiCursos/ApiCursos";
import apiCoordenadores from "../../services/apiCoordenadores/apiCoordenadores";
import { useNavigate } from 'react-router-dom';
import ExclusaoModal from '../modals/ExclusaoModal';
import ModalCadastros from '../modals/ModalCadastros'; // Importe o componente ModalCadastros aqui
import Pagination from '../buttons/Paginacao';

const ListaCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [coordenadores, setCoordenadores] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);  // Número de itens por página
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [cursosResponse, coordenadoresResponse] = await Promise.all([
                    apiCursos.getCursos(),
                    apiCoordenadores.getCoordenadores()
                ]);

                setCursos(cursosResponse.data);
                const coordenadoresMap = coordenadoresResponse.data.reduce((acc, coordenador) => {
                    acc[coordenador.id] = coordenador.nome;
                    return acc;
                }, {});
                setCoordenadores(coordenadoresMap);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };
        carregarDados();
    }, []);

    const excluirCurso = async (id) => {
        try {
            await apiCursos.excludeCurso(id);
            setCursos(cursos.filter(curso => curso.id !== id));
            setFeedbackSuccess(true);
            setFeedbackMessage('Curso excluído com sucesso.');
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
        excluirCurso(selectedItem);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
        if (feedbackSuccess) {
            const reloadCursos = async () => {
                try {
                    const cursosResponse = await apiCursos.getCursos();
                    setCursos(cursosResponse.data);
                } catch (error) {
                    console.error('Erro ao recarregar dados após exclusão:', error);
                }
            };
            reloadCursos();
        }
    };

    const editarCurso = (id) => {
        navigate(`/editarCurso/${id}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cursos.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Lista de Cursos</h2>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Coordenador</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((curso) => (
                            <tr key={curso.id}>
                                <td>{curso.id}</td>
                                <td>{curso.nome}</td>
                                <td>{curso.usuarioCoordenador.nome}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => editarCurso(curso.id)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => confirmarExclusao(curso.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Nenhum curso encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination itemsPerPage={itemsPerPage} totalItems={cursos.length} paginate={paginate} currentPage={currentPage} />
            
            <button className='btn btn-lg btn-primary' onClick={() => navigate('/cadastroCurso/')}>Cadastrar novo curso</button>
            
            <ExclusaoModal 
                show={showModal} 
                handleClose={handleClose} 
                handleConfirm={handleConfirm} 
                item={`curso ${selectedItem}`} 
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

export default ListaCursos;

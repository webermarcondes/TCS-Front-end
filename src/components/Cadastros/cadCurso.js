import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import apiCoordenadores from "../../services/apiCoordenadores/apiCoordenadores"; 
import apiCursos from "../../services/apiCursos/ApiCursos";
import ModalCadastros from "../modals/ModalCadastros";

const CadCurso = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [coordenadores, setCoordenadores] = useState([]);
    
    //Funcionamentos dos modal
        const [showModal, setShowModal] = useState(false);
        const [modalMessage, setModalMessage] = useState('');
        const [success, setSuccess] = useState(false);
    //
    
    const [curso, setCurso] = useState({
        id: '',
        nome: '',
        qtdeFases: '',
        usuarioCoordenador: ''
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const coordenadoresResponse = await apiCoordenadores.getCoordenadores();
                setCoordenadores(coordenadoresResponse);
            } catch (error) {
                console.error("Erro ao carregar dados de coordenadores:", error);
            }
        };

        const carregarCurso = async () => {
            if (id) {
                try {
                    const response = await apiCursos.getCurso(id);
                    const dadosCurso = response;
                    setCurso(dadosCurso);
                    setValue('nome', dadosCurso.nome);
                    setValue('qtdeFases', dadosCurso.qtdeFases);
                    setValue('usuarioCoordenador', dadosCurso.usuarioCoordenador.id);
                } catch (error) {
                    console.error("Erro ao carregar dados do curso:", error);
                }
            }
        };

        carregarDados();
        carregarCurso();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const coordenadorSelecionado = coordenadores.find(coordenador => coordenador.id === parseInt(data.usuarioCoordenador));
        
        const dadosCurso = {
            nome: data.nome,
            qtdeFases: parseInt(data.qtdeFases),
            usuarioCoordenador: coordenadorSelecionado ? { id: coordenadorSelecionado.id } : null
        };

        try {
            if (curso.id) {
                await apiCursos.updateCurso(curso.id, dadosCurso);
                setSuccess(true)
                setModalMessage('curso atualizado com sucesso')
            } else {
                await apiCursos.addCurso(dadosCurso);
                setSuccess(true)
                setModalMessage('curso registrado com sucesso')
            }
        } catch (error) {
            setSuccess(false)
            setModalMessage('erro ao salvar curso', error)
        }
        setShowModal(true)
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (success) {
            navigate('/cursos');
        }
    };
    return (
<div class="container mt-5">
    <div class="card p-4">
        <h2 class="mb-4 text-center">
            {id ? 'Editar curso' : 'Cadastro de curso'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="nome" class="form-label">Nome do Curso:</label>
                    <input
                        type="text"
                        id="nome"
                        className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                        {...register("nome", { required: "O nome do curso é obrigatório" })}
                    />
                    {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
                </div>

                <div class="col-md-6">
                    <label for="qtdeFases" class="form-label">Quantidade de Fases:</label>
                    <input
                        type="number"
                        id="qtdeFases"
                        className={`form-control ${errors.qtdeFases ? 'is-invalid' : ''}`}
                        {...register("qtdeFases", { required: "A quantidade de fases é obrigatória" })}
                    />
                    {errors.qtdeFases && <div className="invalid-feedback">{errors.qtdeFases.message}</div>}
                </div>
            </div>

            <div class="mb-3">
                <label for="usuarioCoordenador" class="form-label">Coordenador:</label>
                <select
                    id="usuarioCoordenador"
                    className={`form-select ${errors.usuarioCoordenador ? 'is-invalid' : ''}`}
                    {...register("usuarioCoordenador", { required: "O coordenador é obrigatório" })}
                >
                    <option value="">Selecione um coordenador</option>
                    {coordenadores.map(coordenador => (
                        <option key={coordenador.id} value={coordenador.id}>{coordenador.nome}</option>
                    ))}
                </select>
                {errors.usuarioCoordenador && <div className="invalid-feedback">{errors.usuarioCoordenador.message}</div>}
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary">Cadastrar Curso</button>
            </div>
        </form>
    </div>
        
    <ModalCadastros show={showModal} handleClose={handleCloseModal} message={modalMessage} success={success} />
</div>

    );
}

export default CadCurso;

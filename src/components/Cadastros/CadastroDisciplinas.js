import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import apiFases from "../../services/apiFases/apiFases";
import apiDisciplinas from "../../services/apiDisciplinas/apiDisciplinas";
import ModalCadastros from "../modals/ModalCadastros";

const CadDisciplina = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [fases, setFases] = useState([]);
    
    
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [success, setSuccess] = useState(false);
    
    const [disciplina, setDisciplina] = useState({
        id: '',
        nome: '',
        cargaHoraria: '',
        codigoCor: '#000000',
        fase: '',
        curso: ''
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await apiFases.getFases();
                setFases(response.data);
            } catch (error) {
                console.error("Erro ao carregar dados de fases:", error);
            }
        };

        const carregarDisciplina = async () => {
            if (id) { // Verifica se há um ID na URL
                try {
                    const response = await apiDisciplinas.getDisciplina(id);
                    const dadosDisciplina = response.data;
                    setDisciplina(dadosDisciplina);
                    setValue('nome', dadosDisciplina.nome);
                    setValue('cargaHoraria', dadosDisciplina.cargaHoraria);
                    setValue('codigoCor', dadosDisciplina.codigoCor);
                    if (dadosDisciplina.fase && dadosDisciplina.fase.id) {
                        setValue('fase', dadosDisciplina.fase.id.toString());
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados da disciplina:", error);
                }
            }
        };

        carregarDados();
        carregarDisciplina();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const faseSelecionada = fases.find(fase => fase.id === parseInt(data.fase));

        const dadosDisciplina = {
            nome: data.nome,
            cargaHoraria: parseInt(data.cargaHoraria),
            codigoCor: data.codigoCor,
            fase: {
                id: faseSelecionada ? faseSelecionada.id : null,
                numero: faseSelecionada ? faseSelecionada.numero : null,
                curso: faseSelecionada && faseSelecionada.curso ? faseSelecionada.curso : null
            }
        };

        try {
            if (disciplina.id) {
                await apiDisciplinas.updateDisciplinas(disciplina.id, dadosDisciplina);
                setSuccess(true);
                setModalMessage('Disciplina atualizada com sucesso');
            } else {
                await apiDisciplinas.addDisciplinas(dadosDisciplina);
                setSuccess(true);
                setModalMessage('Disciplina registrada com sucesso');
            }
        } catch (error) {
            setSuccess(false);
            setModalMessage('Houve um erro ao salvar a disciplina', error);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (success) {
            navigate('/disciplinas');
        }
    };

    const validarCor = (value) => {
        if (value === "#ffffff") {
            return "A cor definida não pode ser branca";
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">
                {id ? 'Editar disciplina' : 'Cadastro de disciplina'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation card p-4" noValidate>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="nome" className="form-label">Nome da Disciplina:</label>
                        <input
                            type="text"
                            id="nome"
                            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                            {...register("nome", { required: "O nome da disciplina é obrigatório" })}
                        />
                        {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="cargaHoraria" className="form-label">Carga Horária:</label>
                        <input
                            type="number"
                            id="cargaHoraria"
                            className={`form-control ${errors.cargaHoraria ? 'is-invalid' : ''}`}
                            {...register("cargaHoraria", { required: "A carga horária é obrigatória" })}
                        />
                        {errors.cargaHoraria && <div className="invalid-feedback">{errors.cargaHoraria.message}</div>}
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="codigoCor" className="form-label">Código da cor:</label>
                        <input
                            type="color"
                            id="codigoCor"
                            className={`form-control  ${errors.codigoCor ? 'is-invalid' : ''}`}
                            {...register("codigoCor", { validate: validarCor })}
                        />
                        {errors.codigoCor && <div className="invalid-feedback">{errors.codigoCor.message}</div>}
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="fase" className="form-label">Fase:</label>
                        <select
                            id="fase"
                            className={`form-select ${errors.fase ? 'is-invalid' : ''}`}
                            {...register("fase", { required: "A fase é obrigatória" })}
                        >
                            <option value="">Selecione uma fase</option>
                            {fases.map((fase) => (
                                <option key={fase.id} value={fase.id}>{`Fase ${fase.numero} de ${fase.curso.nome}`}</option>
                            ))}
                        </select>
                        {errors.fase && <div className="invalid-feedback">{errors.fase.message}</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </div>
                </div>
            </form>

            <ModalCadastros show={showModal} handleClose={handleCloseModal} message={modalMessage} success={success} />
        </div>
    );
}

export default CadDisciplina;

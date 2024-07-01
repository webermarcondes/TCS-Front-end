import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import apiProfessores from "../../services/apiProfessores.js/ApiProfessores"; 
import apiDiasDaSemana from "../../services/apiDiasDaSemana/apiDiasDaSemana";
import apiDisciplinas from "../../services/apiDisciplinas/apiDisciplinas";
import apiAgendaProfessor from "../../services/apiAgendaProfessor/apiAgendaProfessor"; 
import ModalCadastros from "../modals/ModalCadastros";

const CadAgendaProfessor = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [professores, setProfessores] = useState([]);
    const [diasDaSemana, setDiasDaSemana] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);    
        
    
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [success, setSuccess] = useState(false);
    

    const [agenda, setAgenda] = useState({
        id: '',
        professor: '',
        diaDaSemana: '',
        disciplina: ''
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [professoresResponse, diasDaSemanaResponse, disciplinasResponse] = await Promise.all([
                    apiProfessores.getProfessores(),
                    apiDiasDaSemana.getDiasDaSemana(),
                    apiDisciplinas.getDisciplinas()
                ]);

                setProfessores(professoresResponse);
                setDiasDaSemana(diasDaSemanaResponse);
                setDisciplinas(disciplinasResponse);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };

        const carregarAgenda = async () => {
            if (id) {
                try {
                    const response = await apiAgendaProfessor.getAgendaProfessor(id);
                    const dadosAgenda = response;
                    setAgenda(dadosAgenda);
                    setValue('professor', dadosAgenda.professor.id);
                    setValue('diaDaSemana', dadosAgenda.diaDaSemana.id);
                    setValue('disciplina', dadosAgenda.disciplina.id);
                } catch (error) {
                    console.error("Erro ao carregar dados da agenda:", error);
                }
            }
        };

        carregarDados();
        carregarAgenda();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const professorSelecionado = professores.find(professor => professor.id === parseInt(data.professor));
        const diaSelecionado = diasDaSemana.find(dia => dia.id === parseInt(data.diaDaSemana));
        const disciplinaSelecionada = disciplinas.find(disciplina => disciplina.id === parseInt(data.disciplina));

        const dadosAgenda = {
            professor: {
                id: professorSelecionado.id,
                nomeCompleto: professorSelecionado.nomeCompleto
            },
            diaDaSemana: {
                id: diaSelecionado.id,
                descricao: diaSelecionado.descricao
            },
            disciplina: {
                id: disciplinaSelecionada.id,
                nome: disciplinaSelecionada.nome
            }
        };

        try {

            if (agenda.id) {
                await apiAgendaProfessor.updateAgendaProfessor(agenda.id, dadosAgenda);
                setSuccess(true)
                setModalMessage('Agenda atualizada com sucesso')
            } else {
                await apiAgendaProfessor.addAgendaProfessor(dadosAgenda);
                setSuccess(true)
                setModalMessage('Agenda registrada com sucesso')
            }
            
        } catch (error) {
            setSuccess(false)
            setModalMessage('Erro ao registrar a agenda', error)
        }
        setShowModal(true)
    };
    const handleCloseModal = () => {
        setShowModal(false);
        if (success) {
            navigate('/agendaprofessores');
        }
    };
    return (
<div className="container mt-5">
    <h2 className="mb-4">
        {id ? 'Editar Agenda professor' : 'Cadastro de agenda professor'}
    </h2>
    <form onSubmit={handleSubmit(onSubmit)} className="needs-validation card p-4">
        <div className="row mb-3">
            <div className="col-md-6">
                <label htmlFor="professor" className="form-label">Professor:</label>
                <select 
                    id="professor" 
                    className={`form-control ${errors.professor ? 'is-invalid' : ''}`} 
                    {...register("professor")}
                >
                    <option value="">Selecione um professor</option>
                    {professores.map(professor => (
                        <option key={professor.id} value={professor.id}>{professor.nomeCompleto}</option>
                    ))}
                </select>
                {errors.professor && <div className="invalid-feedback">{errors.professor.message}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="diaDaSemana" className="form-label">Dia da Semana:</label>
                <select 
                    id="diaDaSemana" 
                    className={`form-control ${errors.diaDaSemana ? 'is-invalid' : ''}`} 
                    {...register("diaDaSemana", { required: "O dia da semana é obrigatório" })}
                >
                    <option value="">Selecione um dia da semana</option>
                    {diasDaSemana.map(dia => (
                        <option key={dia.id} value={dia.id}>{dia.descricao}</option>
                    ))}
                </select>
                {errors.diaDaSemana && <div className="invalid-feedback">{errors.diaDaSemana.message}</div>}
            </div>
        </div>
        
        <div className="row mb-3">
            <div className="col-md-12">
                <label htmlFor="disciplina" className="form-label">Disciplina:</label>
                <select 
                    id="disciplina" 
                    className={`form-control ${errors.disciplina ? 'is-invalid' : ''}`} 
                    {...register("disciplina")}
                >
                    <option value="">Selecione uma disciplina</option>
                    {disciplinas.map(disciplina => (
                        <option key={disciplina.id} value={disciplina.id}>{disciplina.nome}</option>
                    ))}
                </select>
                {errors.disciplina && <div className="invalid-feedback">{errors.disciplina.message}</div>}
            </div>
        </div>
        
        <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Cadastrar Agenda</button>
            </div>
        </div>
    </form>
    <ModalCadastros show={showModal} handleClose={handleCloseModal} message={modalMessage} success={success} />
</div>

    );
}

export default CadAgendaProfessor;

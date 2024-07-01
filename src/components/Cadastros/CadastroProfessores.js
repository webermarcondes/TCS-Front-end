import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import apiProfessores from "../../services/apiProfessores.js/ApiProfessores";
import ModalCadastros from "../modals/ModalCadastros";

const CadProfessor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
      //Funcionamentos dos modal
      const [showModal, setShowModal] = useState(false);
      const [modalMessage, setModalMessage] = useState('');
      const [success, setSuccess] = useState(false);
      //
  
  const [professor, setProfessor] = useState({
    id: '',
    nomeCompleto: '',
    telefone: '',
    cpf:'',
    qtdeDiasDeAula: '',
    status:'',
    urlFotoPerfil:''
  });

  useEffect(() => {
    const carregarProfessor = async () => {
      if (id) {
        try {
          const dadosProfessor = await apiProfessores.getProfessor(id);
          setProfessor(dadosProfessor);
          setValue('nomeCompleto', dadosProfessor.nomeCompleto);
          setValue('telefone', dadosProfessor.telefone);
          setValue('cpf', dadosProfessor.cpf);
          setValue('qtdeDiasDeAula', dadosProfessor.qtdeDiasDeAula);
          setValue('status', dadosProfessor.status);
          setValue('urlFotoDePerfil', dadosProfessor.urlFotoPerfil);
        } catch (error) {
          console.error('Erro ao carregar dados do professor:', error);
        }
      }
    };

    carregarProfessor();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    // Remove a pontuação do CPF antes de enviar
    data.cpf = data.cpf.replace(/[^\d]/g, '');
    data.telefone = data.telefone.replace(/[^\d]/g, '');
    try {
      if (professor.id) {
        await apiProfessores.updateProfessores(professor.id, data);
        setSuccess(true);
        setModalMessage('professor atualizado com sucesso');
      } else {
        data.status = 'ATIVO'
        await apiProfessores.addProfessores(data);
        setSuccess(true);
        setModalMessage('professor cadastrado com sucesso');
      }
    } catch (error) {
      setSuccess(false);
      setModalMessage('Erro ao salvar o professor',error);
    }
    setShowModal(true)
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (success) {
        navigate('/professores');
    }
};
  return (   
<div className="container mt-5">
    <h1 className="mb-4">
      {id ? 'Editar professor' : 'Cadastro de professor'}
    </h1>
    <form onSubmit={handleSubmit(onSubmit)} className="card p-4">
        <div className="row mb-3">
            <div className="col-md-6">
                <label htmlFor="nome" className="form-label">Nome:</label>
                <input
                    type="text"
                    id="nome"
                    className={`form-control ${errors.nomeCompleto ? 'is-invalid' : ''}`}
                    {...register('nomeCompleto', { required: "O campo não pode estar vazio" })}
                />
                {errors.nomeCompleto && <div className="invalid-feedback">{errors.nomeCompleto.message}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="telefone" className="form-label">Telefone:</label>
                <InputMask
                mask="(99) 99999-9999"
                className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                {...register('telefone', { 
                    required: "O telefone não pode estar vazio"
                })}
                />
                {errors.telefone && <div className="invalid-feedback">{errors.telefone.message}</div>}
            </div>
        </div>
        
        <div className="row mb-3">
            <div className="col-md-6">
                <label htmlFor="cpf" className="form-label">CPF:</label>
                <InputMask
                    mask="999.999.999-99"
                    id="cpf"
                    className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                    {...register('cpf', { 
                        required: "O CPF do coordenador é obrigatório"
                    })}
                />
                {errors.cpf && <div className="invalid-feedback">{errors.cpf.message}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="qtdeDiasDeAula" className="form-label">Quantidade de Aulas Semanais:</label>
                <input
                    type="number"
                    id="qtdeDiasDeAula"
                    className={`form-control ${errors.qtdeDiasDeAula ? 'is-invalid' : ''}`}
                    {...register('qtdeDiasDeAula', {
                        required: 'Por favor, insira um número.',
                        min: {
                            value: 1,
                            message: 'O professor deve dar ao mínimo 1 aula por semana'
                        },
                        max: {
                            value: 6,
                            message: 'O professor não pode dar mais de 6 dias de aula por semana.'
                        }
                    })}
                />
                {errors.qtdeDiasDeAula && <div className="invalid-feedback">{errors.qtdeDiasDeAula.message}</div>}
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
};

export default CadProfessor;

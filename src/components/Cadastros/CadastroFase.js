import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import apiFases from '../../services/apiFases/apiFases';
import apiCursos from '../../services/apiCursos/ApiCursos';
import ModalCadastros from '../modals/ModalCadastros';


const CadFase = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    
   
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [success, setSuccess] = useState(false);
    
    
    
    const [fase, setFase] = useState({
        id: '',
        numero: '',
        curso: ''
    });
    const [cursos, setCursos] = useState([]);
    
    useEffect(() => {
        const carregarFase = async () => {
            if (id) {
                try {
                    const response = await apiFases.getFase(id);
                    const dadosFase = response.data;
                    console.log(dadosFase)
                    setFase(dadosFase);
                    setValue('numero', dadosFase.numero);
                    setValue('curso', dadosFase.curso.id);
                } catch (error) {
                    console.error('Erro ao carregar dados da fase:', error);
                }
            }
        };

        const carregarCursos = async () => {
            try {
                const response = await apiCursos.getCursos();
                setCursos(response.data);
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            }
        };


        carregarFase();
        carregarCursos();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const dadosFase = {
            numero: data.numero,
            curso: { id: data.curso } 
        };
        try {
            if (fase.id) {
                await apiFases.updatefase(fase.id,dadosFase);
                setSuccess(true)
                setModalMessage('Fase atualizada com sucesso')
            } else {
                await apiFases.addFase(dadosFase);
                setSuccess(true)
                setModalMessage('fase registrada com sucesso')
            }
        } catch (error) {
            setSuccess(false)
            setModalMessage('Erro ao registrar fase:', error);
        }
        setShowModal(true)
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (success) {
            navigate('/fases');
        }
    };
    
    return (
<div class="container mt-5">
    <div class="card p-4">
        <h2 class="mb-4 text-center">
            {id ? 'Editar fase' : 'Cadastro de fase'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div class="row mb-3">
                <div class="col-md-6 mb-3">
                    <label for="numero" class="form-label">Número:</label>
                    <input
                        type="text"
                        id="numero"
                        className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                        {...register('numero', { required: "O número da fase é obrigatório" })}
                    />
                    {errors.numero && <div className="invalid-feedback">{errors.numero.message}</div>}
                </div>

                <div class="col-md-6 mb-3">
                    <label for="curso" class="form-label">Curso:</label>
                    <select
                        id="curso"
                        className={`form-select ${errors.curso ? 'is-invalid' : ''}`}
                        {...register('curso', { required: "O curso é obrigatório" })}
                    >
                        <option value=''>Selecione...</option>
                        {cursos.map(curso => (
                            <option key={curso.id} value={curso.id}>{curso.nome}</option>
                        ))}
                    </select>
                    {errors.curso && <div className="invalid-feedback">{errors.curso.message}</div>}
                </div>
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary">Enviar</button>
            </div>
        </form>
    </div>
    {/* Modal de feedback de cadastros */}
    <ModalCadastros show={showModal} handleClose={handleCloseModal} message={modalMessage} success={success} />
</div>

    );
}

export default CadFase;

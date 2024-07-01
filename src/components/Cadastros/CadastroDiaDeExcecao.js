import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import apiDiaExcecao from "../../services/apiDiaExcecao/apiDiaExcecao";
import ModalCadastros from "../modals/ModalCadastros";
import DatePicker from 'react-datepicker';
import '../../../node_modules/react-datepicker/dist/react-datepicker.module.css'
import '../../css/index.css'
import moment from 'moment';

const CadDiaExcecao = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [success, setSuccess] = useState(false);
    
    const [diaExcecao, setDiaExcecao] = useState({
        id: '',
        data: '',
        motivo: ''
    });
    
    const [data, setData] = useState(null);

    useEffect(() => {
        const carregarDiaExcecao = async () => {
            if (id) {
                try {
                    const response = await apiDiaExcecao.getDiaExcecao(id);
                    const dadosDiaExcecao = response;
                    setDiaExcecao(dadosDiaExcecao);
                    const dataISO = moment(dadosDiaExcecao.data, 'DD/MM/YYYY').toDate();
                    setData(dataISO);
                    setValue('motivo', dadosDiaExcecao.motivo);
                } catch (error) {
                    console.error("Erro ao carregar dados do dia de exceção:", error);
                }
            }
        };

        carregarDiaExcecao();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const dataFormatada = moment(data).format('DD/MM/YYYY');
        const dadosDiaExcecao = {
            data: dataFormatada,
            motivo: formData.motivo
        };
        try {
            if (diaExcecao.id) {
                await apiDiaExcecao.updateDiaExcecao(diaExcecao.id, dadosDiaExcecao);
                setSuccess(true);
                setModalMessage('Dia de Exceção atualizado com sucesso');
            } else {
                await apiDiaExcecao.addDiaExcecao(dadosDiaExcecao);
                setSuccess(true);
                setModalMessage('Dia de Exceção cadastrado com sucesso');
            }
        } catch (error) {
            console.error('Erro ao salvar dia de exceção:', error);
            setSuccess(false);
            setModalMessage('Erro ao salvar dia de exceção');
        }
        setShowModal(true)
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (success) {
            navigate('/diaExcecao');
        }
    };

    return (
        <div className="container mt-5">
            <div>
                <h2 className="mb-4 text-center">
                    {id ? 'Editar dia de exceção' : 'Cadastro dia de exceção'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="card p-4">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="data" className="form-label">Data:</label>
                            <DatePicker
                                selected={data}
                                onChange={(date) => setData(date)}
                                dateFormat="dd/MM/yyyy"
                                className={`form-control react-datepicker__input-container ${errors.data ? 'is-invalid' : ''}`}
                                placeholderText="DD/MM/AAAA"
                            />
                            {errors.data && <div className="invalid-feedback">{errors.data.message}</div>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="motivo" className="form-label">Motivo:</label>
                            <textarea
                                id="motivo"
                                className={`form-control ${errors.motivo ? 'is-invalid' : ''}`}
                                {...register("motivo", { required: "O motivo é obrigatório" })}
                            ></textarea>
                            {errors.motivo && <div className="invalid-feedback">{errors.motivo.message}</div>}
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
            <ModalCadastros show={showModal} handleClose={handleCloseModal} message={modalMessage} success={success} />
        </div>
    );
}

export default CadDiaExcecao;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import apiLogin from '../services/Login/Login';
import ModalCadastros from '../components/modals/ModalCadastros';
import axios from 'axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  // Funcionamento do modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('')
  const [success, setSuccess] = useState(false);
  
  const [error, setError] = useState('');

  
  const onSubmit = async (data) => {
    console.log(data)
    try {
      const response = await apiLogin(data)
      setSuccess(true)
      setModalMessage("Usuario logado com sucesso")
    } catch (error) {
      setSuccess(false)
      setModalMessage("Email ou senha invalidos")
    }
    setShowModal(true)
  };
  
  
  const handleCloseModal = () => {
    setShowModal(false);
    if (success) {
        navigate('/');
        window.location.reload();
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4" style={{ width: '700px' }}>
        <h2 className="text-center mb-4">LOGIN</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="digite o email"
                    {...register('email', { required: 'o email é necessário' })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="form-group mb-3">
                <label htmlFor="password">Senha</label>
                <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="senha"
                    placeholder="digite a senha"
                    {...register('senha', { required: 'A senha é necesária' })}
                />
                {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-4">Entrar</button>
        </form>
    </div>
    <ModalCadastros show={showModal} handleClose={handleCloseModal} message={modalMessage} success={success}/>
</div>
  );
};

export default Login;

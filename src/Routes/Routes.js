import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaProfessores from '../components/views/ListaProfessores';
import ListaCoordenadores from '../components/views/ListaCoordenador';
import ListaDisciplinas from '../components/views/ListaDisciplinas';
import ListaFases from '../components/views/ListaFases';
import ListaCurso from '../components/views/ListaCurso';
import CadDiaExcecao from '../components/Cadastros/CadastroDiaDeExcecao';
import ListaAgendaProfessor from '../components/views/ListaAgendaProfessor';
import CadProfessor from '../components/Cadastros/CadastroProfessores';
import CadCoordenador from '../components/Cadastros/Coordenador';
import CadDisciplina from '../components/Cadastros/CadastroDisciplinas';
import CadCurso from '../components/Cadastros/cadCurso';
import CadAgendaProfessor from '../components/Cadastros/CadastroAgendaProfessor';
import CadFase from '../components/Cadastros/CadastroFase';
import ListaDiaExcecao from '../components/views/listaDiaDeExcecao';
import Home from '../pages/TelaHome';
import Layout from '../components/layouts/layout';
import Login from '../pages/Login';
import GeradorCronograma from '../pages/GeradorCronograma';
import PrivateRoute from './PrivateRoute';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<Home/>} />}  /> 
      <Route path="/login" element={<Login />} />
      <Route path="/professores" element={<PrivateRoute element={<Layout><ListaProfessores /></Layout>} />} />
      <Route path="/coordenadores" element={<PrivateRoute element={<Layout><ListaCoordenadores /></Layout>} />} />
      <Route path="/disciplinas" element={<PrivateRoute element={<Layout><ListaDisciplinas /></Layout>} />} />
      <Route path="/fases" element={<PrivateRoute element={<Layout><ListaFases /></Layout>} />} />
      <Route path="/cursos" element={<PrivateRoute element={<Layout><ListaCurso /></Layout>} />} />
      <Route path="/diaExcecao" element={<PrivateRoute element={<Layout><ListaDiaExcecao /></Layout>} />} />
      <Route path="/agendaprofessores" element={<PrivateRoute element={<Layout><ListaAgendaProfessor /></Layout>} />} />
      <Route path="/cadastro" element={<PrivateRoute element={<Layout><CadProfessor /></Layout>} />} />
      <Route path="/cadastroDiaExcecao" element={<PrivateRoute element={<Layout><CadDiaExcecao /></Layout>} />} />
      <Route path="/editarProfessor/:id" element={<PrivateRoute element={<Layout><CadProfessor /></Layout>} />} />
      <Route path="/cadastroCoordenador" element={<PrivateRoute element={<Layout><CadCoordenador /></Layout>} />} />
      <Route path="/editarCoordenador/:id" element={<PrivateRoute element={<Layout><CadCoordenador /></Layout>} />} />
      <Route path="/cadastroDisciplina" element={<PrivateRoute element={<Layout><CadDisciplina /></Layout>} />} />
      <Route path="/cadastroCurso" element={<PrivateRoute element={<Layout><CadCurso /></Layout>} />} />
      <Route path="/cadastroAgendaProfessor" element={<PrivateRoute element={<Layout><CadAgendaProfessor /></Layout>} />} />
      <Route path="/editarDisciplina/:id" element={<PrivateRoute element={<Layout><CadDisciplina /></Layout>} />} />
      <Route path="/cadastroFase" element={<PrivateRoute element={<Layout><CadFase /></Layout>} />} />
      <Route path="/editarFase/:id" element={<PrivateRoute element={<Layout><CadFase /></Layout>} />} />
      <Route path="/editarDiaExcecao/:id" element={<PrivateRoute element={<Layout><CadDiaExcecao /></Layout>} />} />
      <Route path="/editarCurso/:id" element={<PrivateRoute element={<Layout><CadCurso /></Layout>} />} />
      <Route path="/editarAgendaProfessor/:id" element={<PrivateRoute element={<Layout><CadAgendaProfessor /></Layout>} />} />
      <Route path="/geracaoCronograma" element={<PrivateRoute element={<Layout><GeradorCronograma /></Layout>} />} />

</Routes>
  );
};

export default Routers;

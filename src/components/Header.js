import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../imgs/LOGO.png'; // Substitua pelo caminho da sua imagem

const Header = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') !== null;
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); 
    window.location.reload();
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={LOGO}
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          G.C.A
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Início</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/coordenadores">Coordenadores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/professores">Professores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fases">Fases</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/disciplinas">Disciplinas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cursos">Cursos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/diaexcecao">Dias Especiais</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agendaprofessores">Agenda professores</Link>
            </li>
          </ul>
          {isLoggedIn && (
                        <div className="d-flex">
                            <button className="btn btn-outline-danger me-2" onClick={handleLogout}>Sair</button>
                            {/* Aqui você pode adicionar mais itens no menu do usuário */}
                        </div>
                    )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

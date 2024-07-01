import React from 'react';

const ModalCadastros = ({ show, handleClose, message, success }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className={`modal-content ${success ? 'bg-success' : 'bg-danger'} text-white`}>
                    <div className="modal-header">
                        <h5 className="modal-title">{success ? 'Sucesso' : 'Erro'}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" onClick={handleClose}>Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCadastros;

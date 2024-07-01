// ConfirmDeleteModal.js
import React from 'react';

const ExclusaoModal = ({ show, handleClose, handleConfirm, item }) => {
    const showHideClassName = show ? 'modal fade show d-block' : 'modal fade hide';

    return (
        <div className={showHideClassName} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirmação de Exclusão</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Tem certeza que deseja excluir este item: <strong>{item}</strong>?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                        <button type="button" className="btn btn-danger" onClick={handleConfirm}>Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExclusaoModal;

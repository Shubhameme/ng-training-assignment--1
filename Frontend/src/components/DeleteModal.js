import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteModal = ({ taskName, onConfirm, onCancel }) => {
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Task</h5>
                        <button type="button" className="close" onClick={onCancel}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this task: <strong>{taskName}</strong>?</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
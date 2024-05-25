import React from 'react';
import styles from '../../css/approval/cancelModal.css';
import '../../css/approval/cancelModal.css';

const CancelModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modalOverlay show">
            <div className="modalContent">
                <div className="modalConfirmMessage">
                    {message}
                </div>
                <div className="modalActions">
                    <button onClick={onCancel}>취소</button>
                    <button onClick={onConfirm}>확인</button>
                </div>
            </div>

        </div>
    );
};

export default CancelModal;
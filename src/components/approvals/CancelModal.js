import React from 'react';
import styles from '../../css/approval/cancelModal.css';

const CancelModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if(!isOpen) {
        return null;
    }

    return(
        <div className="modalOverlay show">
            <div className="ModalContent">
                
            </div>
            <div className="modalActions">
                <button onClick={onCancel}>닫기</button>
                <button onClick={onConfirm}>확인</button>
            </div>
        </div>
    );
};

export default CancelModal;
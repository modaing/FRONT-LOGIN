import React from 'react';
import '../../css/chatting/deleteModal.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <div className="delete-modal" style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="delete-modal-content">
                <div className='delete-modal-text'>
                    <p>정말로 삭제하시겠습니까?</p>
                </div>
                <div className="button-container">
                    <button className="cancel-button" onClick={onClose}>취소</button>
                    <button className="confirm-button" onClick={onConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;

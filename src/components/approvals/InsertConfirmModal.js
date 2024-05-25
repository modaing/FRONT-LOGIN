import React from 'react';
import styles from '../../css/approval/InsertConfirmModal.module.css'

const InsertConfirmModal = ({ isOpen, onClose, onConfirm }) => {

    if(!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>결재를 상신하시겠습니까?</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>취소</button>
                    <button onClick={onConfirm}>등록</button>
                </div>
            </div>
        </div>
        
    );
}

export default InsertConfirmModal;
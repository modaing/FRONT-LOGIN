import React from 'react';
import styles from '../../css/approval/ApproverStatusConfirmModal.module.css';

const ApproverStatusConfirmModal = ({ isOpen, onClose }) => {

    if(!isOpen){
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                <p>결재가 처리되었습니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}

export default ApproverStatusConfirmModal;
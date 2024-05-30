import React from 'react';
import styles from '../../css/approval/ActionTypeModal.module.css';


const ActionTypeModal = ({isOpen, onClose}) => {

    if(!isOpen){
        return;
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                <p>결재 처리 방식을 선택해 주세요.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default ActionTypeModal;
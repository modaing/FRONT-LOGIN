import React from 'react';
import styles from '../../css/approval/CancelInsertModal.module.css';

const CancelInsertModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>결재 상신을 취소하시겠습니까?</p>
                    <div className={styles.CancelInsertContent}>
                        <p>임시저장되지 않은 내용은</p>
                        <p>완전히 삭제됩니다.</p>
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onConfirm}>작성 취소</button>
                    <button onClick={onClose}>계속 등록</button>
                </div>
            </div>
        </div>
    );
}

export default CancelInsertModal;
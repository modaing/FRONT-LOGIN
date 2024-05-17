import React from 'react';
import styles from '../../css/approval/DeleteConfirmModal.module.css'

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div>
                    <p>삭제하시겠습니까?</p>
                    <p>작성한 내용은 완전히 삭제됩니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onCancel}>취소</button>
                    <button onClick={onConfirm}>삭제</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
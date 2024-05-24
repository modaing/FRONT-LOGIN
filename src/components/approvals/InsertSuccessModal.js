import styles from '../../css/approval/InsertSuccessModal.module.css';

const InsertSuccessModal = ({ isOpen, onClose }) => {
    if(!isOpen){
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                <p>결재가 상신되었습니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default InsertSuccessModal;
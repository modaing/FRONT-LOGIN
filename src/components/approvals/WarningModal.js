import styles from '../../css/approval/WarningModal.module.css';

const WarningModal = ({ isOpen, onClose, message }) => {

    if (!isOpen) {
        return;
    }
    
    return (

        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>{message}</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default WarningModal;
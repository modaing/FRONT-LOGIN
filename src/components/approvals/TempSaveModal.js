import styles from '../../css/approval/TempSaveModal.module.css';

const TempSaveModal = ({isOpen, onClose}) => {
    
    if(!isOpen){
        return;
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                <p>임시저장되었습니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}

export default TempSaveModal;
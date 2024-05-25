import styles from '../../css/approval/InsertFailModal.module.css';

const InsertFailModal = ({ isOpen, onClose, message }) => {

    if(!isOpen){
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>결재 상신에 실패하였습니다.</p>
                    <p>{message}</p>
                    </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
}   

export default InsertFailModal;
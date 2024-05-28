import styles from '../../css/approval/ReturnConfirmModal.module.css'

const ReturnConfirmModal = ({ isOpen, onConfirm, onCancel}) => {

    if(!isOpen){
        return null;
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>기안을 회수하시겠습니까?</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onCancel}>취소</button>
                    <button onClick={onConfirm}>회수</button>
                </div>
            </div>
        </div>
    );

}
export default ReturnConfirmModal;
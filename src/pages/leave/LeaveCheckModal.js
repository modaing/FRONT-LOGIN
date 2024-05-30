import React from 'react';
import '../../css/leave/LeaveCheckModal.css';

const LeaveCheckModal = ({ isOpen, onClose, onConfirm, option }) => {
    return (
        isOpen && (
            <>
                <div className="leaveModal-backdrop show"></div>
                <div className="modal fade show leaveCheckModal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{option} 확인</h5>
                            </div>
                            <div className="modal-body">
                                <span>{option}하시겠습니까?</span>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-negative" onClick={() => onClose(false)}>취소</button>
                                <button type="button" className="btn btn-positive" onClick={onConfirm}>{option}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default LeaveCheckModal;

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/leave/LeaveProcessingModal.css';
import LeaveCheckModal from './LeaveCheckModal';


const LeaveProcessingModal = ({ isOpen, onClose, onUpdate, leaveSubNo, selectedTime, detailInfo }) => {
    const [decision, setDecision] = useState('');
    const [reason, setReason] = useState('');
    const [isCheckOpen, setIsCheckOpen] = useState(false);

    const handleUpdate = () => {
        onUpdate({ leaveSubNo, decision, reason });
        setIsCheckOpen(false)
        onClose();
    };

    const resetModal = () => {
        setDecision('');
        setReason('');
    };

    // 모달이 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">휴가 요청 상세 조회</h5>
                        </div>
                        <div className="modal-body">

                            <div className="leaveProcessing"><label>사원명</label><input type="text" value={detailInfo.name} className="form-control" disabled /></div>

                            <div className="leaveProcessing"><label>사번</label><input type="number" value={detailInfo.memberId} className="form-control" disabled /></div>

                            <div className="form-group">
                                <label>휴가 기간</label>
                                <div className='dateFlex'>
                                    <DatePicker selected={new Date(selectedTime.start)} dateFormat="yyyy-MM-dd" className="form-control" disabled />
                                    <DatePicker selected={new Date(selectedTime.end)} dateFormat="yyyy-MM-dd" className="form-control" disabled />
                                </div>
                            </div>

                            <div className="leaveProcessingF"><label>휴가 유형</label><input type="text" value={detailInfo.type} className="form-control" disabled /></div>

                            <label>신청 사유</label>
                            <textarea type="text" value={detailInfo.reason} className="form-control" rows="3" disabled />

                            <div className="radioButtons">
                                <div>
                                    <input type="radio" id="approve" name="decision" value="승인" checked={decision === '승인'} onChange={e => setDecision(e.target.value)} />
                                    <label htmlFor="approve">승인</label>
                                </div>
                                <div>
                                    <input type="radio" id="reject" name="decision" value="반려" checked={decision === '반려'} onChange={e => setDecision(e.target.value)} />
                                    <label htmlFor="reject">반려</label>
                                </div>
                                {decision === '반려'
                                    && <>
                                        <label>반려 사유</label>
                                        <textarea type="text" value={reason} onChange={e => setReason(e.target.value)} className="form-control" rows="3" />
                                    </>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={() => setIsCheckOpen(true)}>처리</button>
                        </div>
                    </div>
                </div>
        <LeaveCheckModal isOpen={isCheckOpen} onClose={setIsCheckOpen} onConfirm={handleUpdate} option='처리' />
            </div>
        )
    );
};

export default LeaveProcessingModal;

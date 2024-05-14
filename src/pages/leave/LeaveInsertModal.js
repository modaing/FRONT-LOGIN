import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LeaveInsertModal = ({ isOpen, onClose, onSave }) => {
    const [leaveSubStartDate, setLeaveSubStartDate] = useState('');
    const [leaveSubEndDate, setLeaveSubEndDate] = useState('');
    const [leaveType, setLeaveType] = useState('red');
    const [leaveReason, setLeaveReason] = useState('');

    const handleSave = () => {
        onSave({ leaveSubStartDate, leaveSubEndDate, leaveType, leaveReason });
        onClose();
    };

    const resetModal = () => {
        setLeaveSubStartDate('');
        setLeaveSubEndDate('');
        setLeaveType('');
        setLeaveReason('');
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
                            <h5 className="modal-title">휴가 신청</h5>
                        </div>
                        <div className="modal-body">
                            <div>휴가 시작일 : </div>
                            <DatePicker
                                selected={leaveSubStartDate}
                                onChange={date => setLeaveSubStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText=""
                            />
                            <div>휴가 종료일 : </div>
                            <DatePicker
                                selected={leaveSubEndDate}
                                onChange={date => setLeaveSubEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                            />
                            <div>휴가 유형 :
                                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                                    <option value="연차">연차</option>
                                    <option value="반차오전">반차오전</option>
                                    <option value="반차오후">반차오후</option>
                                    <option value="특별휴가">특별휴가</option>
                                </select>
                            </div>
                            <div>사유<input type="text" value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} /></div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>등록</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default LeaveInsertModal;

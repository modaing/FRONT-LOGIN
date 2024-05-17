import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/leave/MyLeaveModal.css';


const MyLeaveModal = ({ isOpen, onClose, onSave, leaveSubNo, selectedTime }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [type, setType] = useState(leaveSubNo ? '취소' : '연차');
    const [reason, setReason] = useState('');
    const isCancle = leaveSubNo ? '취소 신청' : '휴가 신청';

    const handleSave = () => {
        onSave({ leaveSubNo, start, end, type, reason });
        onClose();
    };

    const resetModal = () => {
        setStart(leaveSubNo ? new Date(selectedTime.start) : '');
        setEnd(leaveSubNo ? new Date(selectedTime.end) : '');
        setType(leaveSubNo ? '취소' : '연차');
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
                            <h5 className="modal-title">{isCancle}</h5>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>시작 일자</label>
                                {leaveSubNo ?
                                    <DatePicker selected={new Date(selectedTime.start)} dateFormat="yyyy-MM-dd" className="form-control" disabled />
                                    : <DatePicker selected={start} onChange={e => setStart(e)} dateFormat="yyyy-MM-dd" className="form-control" />
                                }
                            </div>

                            <div className="form-group">
                                <label>종료 일자</label>
                                {leaveSubNo ?
                                    <DatePicker selected={new Date(selectedTime.end)} dateFormat="yyyy-MM-dd" className="form-control" disabled />
                                    : <DatePicker selected={end} onChange={e => setEnd(e)} dateFormat="yyyy-MM-dd" className="form-control" />
                                }
                            </div>
                            <div className="onlyFelx">
                                <label>휴가 유형</label>
                                {leaveSubNo ?
                                    <select value={type} onChange={e => setType(e.target.value)} className="form-select" disabled >
                                        <option value="취소">취소</option>
                                    </select>
                                    : <select value={type} onChange={e => setType(e.target.value)} className="form-select">
                                        <option value="연차">연차</option>
                                        <option value="반차오전">반차오전</option>
                                        <option value="반차오후">반차오후</option>
                                        <option value="특별휴가">특별휴가</option>
                                    </select>
                                }
                            </div>

                            <label>일정 상세</label>
                            <textarea type="text" value={reason} onChange={e => setReason(e.target.value)} className="form-control" rows="3" />
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

export default MyLeaveModal;

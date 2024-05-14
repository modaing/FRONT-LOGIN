import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CalendarModal.css'

const CalendarModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('');
    const [detail, setDetail] = useState('');

    const handleSave = () => {
        onSave({ title, start, end, color, detail });
        onClose();
    };

    const resetModal = () => {
        setTitle('');
        setStart('');
        setEnd('');
        setColor('');
        setDetail('');
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
                            <h5 className="modal-title">일정 추가하기</h5>
                            {/* <button type="button" className="btn-close" onClick={onClose}></button> */}
                        </div>
                        <div className="modal-body">
                            <div className="onlyFelx"><label>일정이름</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" /></div>
                            <div className="form-group"><label>시작시간</label> <DatePicker selected={start} onChange={date => setStart(date)} showTimeSelect dateFormat="yyyy-MM-dd h:mm aa" className="form-control" /></div>
                            <div className="form-group"><label>종료시간</label> <DatePicker selected={end} onChange={date => setEnd(date)} showTimeSelect timeInputLabel="종료시간" dateFormat="yyyy-MM-dd h:mm aa" className="form-control" /></div>
                            <div className="onlyFelx"><label>배경색상</label>
                                <select value={color} onChange={(e) => setColor(e.target.value)} className="form-select" >
                                    <option value="red">빨강색</option>
                                    <option value="orange">주황색</option>
                                    <option value="yellow">노랑색</option>
                                    <option value="green">초록색</option>
                                    <option value="blue">파랑색</option>
                                    <option value="indigo">남색</option>
                                    <option value="purple">보라색</option>
                                </select>
                            </div>
                            <label>일정상세</label>
                            <textarea type="text" value={detail} onChange={(e) => setDetail(e.target.value)} className="form-control" rows="3" />
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

export default CalendarModal;

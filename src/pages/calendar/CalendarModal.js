import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/calendar/CalendarModal.css'

const CalendarModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('red');
    const [detail, setDetail] = useState('');

    const handleImport = () => {
        onSave({ title, start, end, color, detail });
        onClose();
    };

    const resetModal = () => {
        setTitle('');
        setStart('');
        setEnd('');
        setColor('red');
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
                            <div className="calendar"><label>일정 이름</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-control" /></div>
                            <div className="form-group"><label>시작 일시</label> <DatePicker selected={start} onChange={e => setStart(e)} showTimeSelect dateFormat="yyyy-MM-dd h:mm aa" className="form-control" /></div>
                            <div className="form-group"><label>종료 일시</label> <DatePicker selected={end} onChange={e => setEnd(e)} showTimeSelect timeInputLabel="종료시간" dateFormat="yyyy-MM-dd h:mm aa" className="form-control" /></div>
                            <div className="calendar"><label>배경 색상</label>
                                <select value={color} onChange={e => setColor(e.target.value)} className="form-select" >
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
                            <textarea type="text" value={detail} onChange={e => setDetail(e.target.value)} className="form-control" rows="3" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={handleImport}>등록</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CalendarModal;

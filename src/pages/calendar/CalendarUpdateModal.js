import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CalendarModal.css'

const UpdateModal = ({ isOpen, onClose, onUpdate, onDelete, event }) => {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('');
    const [detail, setDetail] = useState('');


    const handleUpdate = () => {
        onUpdate({ id, title, start, end, color, detail });
        onClose();
    };

    const handleDelete = () => {
        onDelete(id);
        onClose();
    }

    const resetModal = () => {
        setId(event.id)
        setTitle(event.title);
        setStart(new Date(event.start));
        setEnd(event.end ? new Date(event.end) : new Date(event.start));
        setColor(event.extendedProps.color);
        setDetail(event.extendedProps.detail)
    };

    useEffect(() => {
        if (isOpen && event) {
            resetModal();
        }
    }, [isOpen, event]);


    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">일정 수정하기</h5>
                        </div>
                        <div className="modal-body">
                            <div className="onlyFelx"><label>일정이름</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-control" /></div>
                            <div className="form-group"><label>시작일시</label> <DatePicker selected={start} onChange={e => setStart(e)} showTimeSelect dateFormat="yyyy-MM-dd h:mm aa" className="form-control" /></div>
                            <div className="form-group"><label>종료일시</label> <DatePicker selected={end} onChange={e => setEnd(e)} showTimeSelect timeInputLabel="종료시간" dateFormat="yyyy-MM-dd h:mm aa" className="form-control" /></div>
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
                            <textarea type="text" value={detail} onChange={e => setDetail(e.target.value)} className="form-control" rows="3" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={handleDelete} style={{ marginRight: 'auto'}}>삭제</button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>수정</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default UpdateModal;

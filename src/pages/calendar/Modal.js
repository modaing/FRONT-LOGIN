import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('red');
    const [detail, setDetail] = useState('');

    const handleSave = () => {
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
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div>일정이름 : <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                            <div>시작시간 : <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></div>
                            <div>종료시간 : <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
                            <div>배경색상 :
                                <select value={color} onChange={(e) => setColor(e.target.value)}>
                                    <option value="red">빨강색</option>
                                    <option value="orange">주황색</option>
                                    <option value="yellow">노랑색</option>
                                    <option value="green">초록색</option>
                                    <option value="blue">파랑색</option>
                                    <option value="indigo">남색</option>
                                    <option value="purple">보라색</option>
                                </select>
                            </div>
                            <div>일정상세 : <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)} /></div>
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

export default Modal;

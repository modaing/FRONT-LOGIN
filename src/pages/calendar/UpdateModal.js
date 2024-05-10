import React, { useState, useEffect } from 'react';

const UpdateModal = ({ isOpen, onClose, onUpdate, event }) => {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('red');
    

    const handleUpdate = () => {

        onUpdate({ id, title, start, end, color });
        onClose();
    };

    const resetModal = () => {
        // 시작시간과 종료시간이 동일한 경우 종료시간이 event에 end가 들어가지 않아서 값이 있을 때만 toISOString 호출하게 함
        if (event.end) {
            setEnd(event.end.toISOString().slice(0, 16));
        }

        setId(event.id)
        setTitle(event.title);
        // toISOString() 메소드를 호출하면 "YYYY-MM-DDTHH:mm:ss.sssZ" 형식으로 반환되는데, YYYY-MM-DDTHH:mm  
        setStart(event.start.toISOString().slice(0, 16));
        setColor(event.color);
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
                        </div>
                        <div className="modal-footer">
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

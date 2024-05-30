import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/survey/SurveyInsertModal.css'

function SurveyInsertModal({ isOpen, onClose, onSave, name }) {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [answers, setAnswer] = useState([]);

    const handleSurveyInsert = () => {
        if (!start || !end) {
            alert('시작일자와 종료일자가 선택되어야 합니다.');
            return;
        }
        if (start > end) {
            alert('시작일자는 종료일자 이후로 선택될 수 없습니다.');
            setStart();
            setEnd();
            return;
        }
        // 배열 안에 있는 모든 빈문자열을 제거
        const answerFilter = answers.filter(answer => answer !== '');
        onSave({ title, start, end, answerFilter })
        onClose();
    }

    const resetModal = () => {
        setTitle('');
        setStart('');
        setEnd('');
        setAnswer(['']);
    };

    // 답변 입력창이 생성될 때마다 빈문자열을 추가해 인덱스 확보
    const addAnswer = () => {
        if (answers.length < 5) {
            setAnswer(prevAnswers => [...prevAnswers, '']);
        }
    };

    // index를 함께 받아 생성된 모든 답변에 대해 수정이 가능
    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswer(newAnswers);
    };

    // 해당 답변 입력창과 답변 삭제
    const removeAnswer = (selectedIndex) => {
        setAnswer(prevAnswers => prevAnswers.filter((answer, index) => index !== selectedIndex));
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
                            <h5 className="modal-title">수요조사 등록</h5>
                        </div>
                        <div className="modal-body">

                            <div>
                                <label>제목</label>
                                <textarea value={title} onChange={e => setTitle(e.target.value)} className="form-control surveyInsertTextarea" rows={1}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = (e.target.scrollHeight) + 'px';
                                    }} />
                            </div>

                            <div className="surveyInsert"><label>작성자</label><input type="text" value={name} className="form-control surveyWriter" disabled /></div>

                            <div className="form-group">
                                <label>수요조사 기간</label>
                                <div className='dateFlex'>
                                    <DatePicker selected={start} onChange={e => setStart(e)} dateFormat="yyyy-MM-dd" className="form-control" />
                                    <span>-</span>
                                    <DatePicker selected={end} onChange={e => setEnd(e)} dateFormat="yyyy-MM-dd" className="form-control" />
                                </div>
                            </div>

                            <label>수요조사 답변</label>
                            <div className="border p-3">
                                {answers.map((answer, index) => (
                                    <div key={index}>
                                        {/*  단축평가를 통해 답변 생성 버튼은 답변이 5개 생성 시  보이지 않으며, 마지막 답변에만 보이고 추가 버튼이 생기지 않으면 삭제 버튼이 보임*/}
                                        <input value={answer} onChange={(e) => handleAnswerChange(index, e.target.value)} className="surveyAnswer form-control" />
                                        {index === answers.length - 1 && index < 4 && <i className="ri ri-add-fill addAnswer" onClick={addAnswer}></i>
                                            || <i className="ri-close-fill addAnswer" onClick={() => removeAnswer(index)}></i>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-negative" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-positive" onClick={handleSurveyInsert}>제출</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default SurveyInsertModal;
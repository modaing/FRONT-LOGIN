import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/survey/SurveyModal.css'

const SurveyModal = ({ isOpen, onClose, onSave, survey }) => {
    const [response, setResponse] = useState('');
    const answers = survey.answerList || [];

    const handleInsert = () => {
        onSave(response)
        onClose();
    }
    
    const resetModal = () => {
        setResponse('');
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
                            <h5 className="modal-title">수요조사 참여</h5>
                        </div>
                        <div className="modal-body">

                            <div><label>제목</label>
                                <div className="form-control likeTextarea">{survey.surveyTitle}</div>
                            </div>

                            <div ><label>작성자</label><input type="text" value={survey.name} className="form-control surveyWriter" disabled /></div>

                            <div className="form-group">
                                <label>수요조사 기간</label>
                                <div className='dateFlex'>
                                    <DatePicker selected={new Date(survey.surveyStartDate)} dateFormat="yyyy-MM-dd" className="form-control surveyDate" disabled />
                                    <span>-</span>
                                    <DatePicker selected={new Date(survey.surveyEndDate)} dateFormat="yyyy-MM-dd" className="form-control surveyDate" disabled />
                                </div>
                            </div>

                            <label>수요조사 답변</label>
                            <div className="border p-3">
                                {answers
                                    .sort((a, b) => a.answerSequence - b.answerSequence) // answerSequence 순으로 정렬
                                    .map((answer, index) => (
                                        <div key={index} onClick={e => setResponse(answer.answerNo)} >
                                            <input type="radio" value={answer.answerNo} checked={response === answer.answerNo} onChange={() => setResponse(answer.answerNo)} />
                                            <label>{answer.answer}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={handleInsert}>제출</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default SurveyModal;
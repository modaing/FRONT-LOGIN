import React from 'react';
import '../../css/commute/commute.css';

const ClockInModal = ({ isOpen, onClose, date }) => {
    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">동일 날짜 출근 제한</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div><h6><span style={{fontWeight: 'bold', marginRight: '80px'}} >대상 일자</span> {date}</h6></div>
                            <br/>
                            <h6>오늘은 이미 출퇴근 기록이 존재합니다.</h6>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{backgroundColor: '#3F72AF', border: '1px solid #3F72AF'}}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ClockInModal;
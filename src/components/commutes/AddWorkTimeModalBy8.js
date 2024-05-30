import React from 'react';

const AddWorkTimeModalBy8 = ({ isOpen, onClose, totalWorkingHours }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 999, color: '#112D4E' }}>
            <div className="modal-dialog" style={{ padding: '0px' }}>
                <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                    <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                        <h5 className="modal-title">연장 근무 신청 안내</h5>
                        <button type="button" className="btn-close" onClick={onClose} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}></button>
                    </div>
                    <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px' }}>
                        <h6>대상 일자 </h6>
                        <h6>오늘 출근 시간 </h6>
                        <h6>오늘 근로 시간 {Math.floor(totalWorkingHours / 60)} 시간 {totalWorkingHours % 60} 분</h6>
                        <h6>"주 52 시간 근무제"에 근거하여,</h6>
                        <h6>1일 기본 근로 시간 8 시간을 초과하셨기에</h6>
                        <h6>연장 근무를 신청하거나 퇴근하기를 진행해주세요.</h6>
                    </div>
                    <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#FFFFFF', border: '1px solid #112D4E', color: '#112D4E' }}>
                            퇴근하기
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#112D4E', border: '1px solid #D5D5D5', color: '#ffffff' }}>
                            연장 근무 신청
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWorkTimeModalBy8;
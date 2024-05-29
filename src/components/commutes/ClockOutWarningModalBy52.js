import React from 'react';
import '../../css/commute/commute.css';

/* 실제 근로 시간이 52시간에 가까워지면 '퇴근하기' 등록 권고 경고 모달 */
const ClockOutWarningModalBy52 = ({ isOpen, onClose, totalWorkingHours }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 999, color: '#000000' }}>
            <div className="modal-dialog" style={{ padding: '0px' }}>
                <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                    <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                        <h5 className="modal-title">52 시간 초과로 인해 근로 시간 추가 불가</h5>
                        <button type="button" className="btn-close" onClick={onClose} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}></button>
                    </div>
                    <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px', textAlign: 'center' }}>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>대상 기간 </h6>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>실제 근로 시간 <span style={{color: '#3F72AF'}}>{Math.floor(totalWorkingHours / 60)} 시간 {totalWorkingHours % 60} 분</span></h6>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>잔여 근로 시간 <span style={{color: '#AF3131'}}>0 시간 0 분</span></h6><br/><br/>
                        <h6>"주 52 시간 근무제"에 근거하여,</h6>
                        <h6>대상 기간 기준 <span style={{fontWeight: 900}}>실제 근로 시간이 52 시간을 초과</span>하셨기에</h6>
                        <h6 style={{fontWeight: 900}}>근로 시간을 더 이상 추가할 수 없습니다.</h6>
                        <h6><span style={{fontWeight: 900}}>퇴근하기</span>를 진행해주세요.</h6>
                        <br/>
                        <h6 style={{color: '#AF3131'}}>이를 어길 시 사업주는 징역 2년 이하 또는</h6> 
                        <h6 style={{color: '#AF3131'}}>2000만원 이하의 벌금에 처해집니다.</h6>
                        <br/>
                        <h6>퇴근하기 진행 후,</h6>
                        <h6 style={{fontWeight: 900, color: '#112D4E'}}>초과 근로 시간에 대한 처리를</h6>
                        <h6 style={{fontWeight: 900, color: '#112D4E'}}>반드시 담당 부서로 문의해주세요.</h6>
                        <h6 style={{fontWeight: 900}}>담당 부서: 인사팀</h6>
                    </div>
                    <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#ffffff', border: '1px solid #112D4E', color: '#112D4E' }}>
                            퇴근하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClockOutWarningModalBy52;

const red = {
    color: '#AF3131',
    fontWeight: 900,
};

const blue = {
    color: '#3F72AF',
    fontWeight: 900,
};

const black = {
    color: '#00000',
    fontWeight: 900,
};
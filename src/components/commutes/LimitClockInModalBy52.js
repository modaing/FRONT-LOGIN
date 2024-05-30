import React from 'react';

/* 실제 근로 시간이 52시간에 도달하여 출근시간 등록 제한 경고 모달 */
const LimitClockinModalBy52 = ({ date, isOpen, onClose, totalWorkingHours, handleClockOut, handleRequestOvertimeWork }) => {
    // if (!isOpen) return null;
    console.log('date', date);

    /* 주 번호의 날짜 범위 계산 */
    function getWeekRange(date) {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay() || 7;    // 일요일을 7로 처리
        const mondayDate = new Date(currentDate.getTime() - (dayOfWeek - 1) * 24 * 60 * 60 * 1000);
        const sundayDate = new Date(mondayDate.getTime() + 6 * 24 * 60 * 60 * 1000);

        const monthStart = new Date(mondayDate);    // 이번주 월요일
        const monthEnd = new Date(sundayDate);      // 이번주 일요일

        const monthStartStr = `${monthStart.getMonth() + 1}월 ${monthStart.getDate()}일`;   // 이번주 월요일 문자열로 변환
        const monthEndStr = `${monthEnd.getMonth() + 1}월 ${monthEnd.getDate()}일`;         // 이번주 일요일 문자열로 변환

        return `${monthStartStr} ~ ${monthEndStr}`;
    };

    return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 999, color: '#000000' }}>
            <div className="modal-dialog" style={{ padding: '0px' }}>
                <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                    <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                        <h5 className="modal-title">52 시간 초과로 인해 근로 시간 추가 불가</h5>
                    </div>
                    <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px', textAlign: 'center' }}>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>대상 기간 {getWeekRange(date)}</h6>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>실제 근로 시간 <span style={{color: '#3F72AF'}}>{Math.floor(totalWorkingHours / 60)} 시간 {totalWorkingHours % 60} 분</span></h6>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>잔여 근로 시간 <span style={{color: '#AF3131'}}>0 시간 0 분</span></h6><br/><br/>
                        <h6>"주 52 시간 근무제"에 근거하여,</h6>
                        <h6>대상 기간 기준 <span style={{fontWeight: 900}}>실제 근로 시간이 52 시간을 초과</span>하셨기에</h6>
                        <h6 style={{fontWeight: 900}}>근로 시간을 더 이상 추가할 수 없습니다.</h6>
                        <br/>
                        <h6 style={{fontWeight: 900, color: '#112D4E'}}>추가 문의 사항은 담당 부서로 문의해주세요.</h6>
                        <h6 style={{fontWeight: 900}}>담당 부서: 인사팀</h6>
                    </div>
                    <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#3F72AF', border: '1px solid #D5D5D5', color: '#ffffff' }}>
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LimitClockinModalBy52;
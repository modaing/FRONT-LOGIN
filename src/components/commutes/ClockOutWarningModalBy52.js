import React from 'react';
import '../../css/commute/commute.css';
import '../../css/common.css';

/* 잔여 근로 시간이 8시간 이하일 경우 잔여 근로 시간 내에 '퇴근하기' 진행 권고 모달 */
const ClockOutWarningModalBy52 = ({ date, isOpen, onClose, commute }) => {

    // const formatTotalWorkingHours = (totalWorkingHours) => {
    //     const hours = Math.floor(totalWorkingHours / 60);
    //     const minutes = totalWorkingHours % 60;
    //     return `${hours}시간 ${minutes}분`;
    // };

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

    /* 총 근무 시간 형식 변경 */
    const formatTotalWorkingHours = (totalWorkingHours) => {

        if (totalWorkingHours === 0) {
            return '0 시간';
        };

        const hours = Math.floor(totalWorkingHours / 60);
        const minutes = totalWorkingHours % 60;

        if (minutes == 0) {
            return `${hours} 시간`;
        } else {
            return `${hours} 시간 ${minutes} 분`;
        };
    };

    /* 실제 근로 시간 계산 */
    const totalWorkingHours = commute.reduce((acc, item) => acc + item.totalWorkingHours, 0);
    const formattedTotalWorkingHours = formatTotalWorkingHours(totalWorkingHours);

    /* 잔여 근로시간 계산 */
    const maxWorkingHours = 3120;   // 52시간 = 3120분
    const remainingWorkingHours = maxWorkingHours - totalWorkingHours;
    const formattedRemainingWorkingHours = formatTotalWorkingHours(remainingWorkingHours);

    // if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 999, color: '#000000' }}>
            <div className="modal-dialog" style={{ padding: '0px' }}>
                <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                    <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                        <h5 className="modal-title">잔여 근로 시간 8 시간 이하 안내</h5>
                    </div>
                    <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px', textAlign: 'center' }}>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>대상 기간 <span style={{marginLeft: '100px'}}>{getWeekRange(date)}</span></h6>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>실제 근로 시간 <span style={{ color: '#3F72AF', marginLeft: '100px' }}>{formattedTotalWorkingHours}</span></h6>
                        <h6 style={{ textAlign: 'left', fontWeight: 900 }}>잔여 근로 시간 <span style={{ color: '#AF3131', marginLeft: '105px' }}>{formattedRemainingWorkingHours}</span></h6><br /><br />
                        <h6>"주 52 시간 근무제"에 근거하여,</h6>
                        <h6>대상 기간 기준 <span style={{ fontWeight: 900 }}>잔여 근로 시간이 8 시간 이하</span>이기 때문에</h6>
                        {/* <h6 style={{ fontWeight: 900 }}>잔여 근로 시간 내에 반드시 퇴근하기</h6> */}
                        <h6><span style={{ fontWeight: 900 }}>잔여 근로 시간 내에 반드시 "퇴근하기"</span>를 진행해주세요.</h6>
                        <br />
                        <h6 style={{ color: '#AF3131' }}>이를 어길 시 사업주는 징역 2년 이하 또는</h6>
                        <h6 style={{ color: '#AF3131' }}>2000만원 이하의 벌금에 처해집니다.</h6>
                        <br />
                        <h6>만약 퇴근하기 진행 후 근로 시간이 초과되었다면,</h6>
                        <h6 style={{ fontWeight: 900, color: '#112D4E' }}>초과 근로 시간에 대한 처리를</h6>
                        <h6 style={{ fontWeight: 900, color: '#112D4E' }}>반드시 담당 부서로 문의해주세요.</h6>
                        <h6 style={{ fontWeight: 900 }}>담당 부서: 인사팀</h6>
                    </div>
                    <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                        <button type="button" className="btn-negative" onClick={onClose} 
                        // style={{ backgroundColor: '#ffffff', border: '1px solid #112D4E', color: '#112D4E' }}
                        >
                            확인
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
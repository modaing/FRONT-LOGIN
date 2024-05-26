import React from 'react';
import { useDispatch } from "react-redux";
import { callUpdateCommuteAPI } from "../../apis/CommuteAPICalls";
import dayjs from "dayjs";

const ClockOutModal = ({ isOpen, onClose, parsingDateOffset, memberId, commuteList, handleClockOut, }) => {
    
    console.log('parsingDateOffset : ', parsingDateOffset);
    const dispatch = useDispatch();

    /* 현재 시간 포맷 */
    let today = new Date();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);

    let timeString = hours + ':' + minutes;

    /* 날짜 데이터 파싱 */
    const parseDate = (dateData) => {
        if (Array.isArray(dateData)) {
            return dayjs(new Date(dateData[0], dateData[1] - 1, dateData[2])).format('YYYY-MM-DD');
        } else {
            return dateData;
        }
    };

    /* 출근시간, 퇴근시간 형식 변경 */
    const formatWorkingTime = (workingTime) => {
        if (Array.isArray(workingTime)) {

            let result = '';

            for (let i = 0; i < workingTime.length; i++) {
                const minutes = workingTime[i] % 100;
                result += `${String(minutes).padStart(2, '0')}`;

                if (i < workingTime.length - 1) {
                    result += ':';
                }
            }
            return result;
        }
        return '';
    };
    
    // /* 총 근무 시간 */
    const calculateTotalWorkingHours = (workingDate, startWork) => {
        // 출근 시간과 현재 시간의 차이 계산하여 총 근무 시간 반환
        const startTime = new Date(`${workingDate}T${startWork}:00`);
        const endTime = new Date();
        const totalWorkingSeconds = (endTime - startTime) / 1000;
        const totalWorkingHours = Math.floor(totalWorkingSeconds / 3600);
        return totalWorkingHours;
    };

    const handleUpdateCommute = () => {
        try {
            const todayCommute = commuteList.find(
                (commute) => parseDate(commute.workingDate) === parsingDateOffset
            );

                const updateCommute = {
                    commuteNo: todayCommute.commuteNo,
                    endWork: timeString,
                    workingStatus: "퇴근",
                    totalWorkingHours: calculateTotalWorkingHours(
                        parsingDateOffset,
                        formatWorkingTime(todayCommute.startWork)
                    ),
                };
                console.log('퇴근 업뎃', updateCommute);

                dispatch(callUpdateCommuteAPI(updateCommute));
                onClose();
                
        } catch (error) {
            console.error('Error updating commute:', error);
        }
    };

    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ color: '#112D4E' }}>퇴근하기</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ color: '#112D4E' }}><h6><span style={{ fontWeight: 'bold', marginRight: '80px' }} >대상 일자</span> {parsingDateOffset}</h6></div>
                            <br />
                            <h6 style={{ color: '#112D4E' }}>오늘 퇴근하시겠습니까?</h6>
                        </div>
                        <div className="modal-footer">
                            <button onClick={onClose} style={{
                                width: '50px',
                                backgroundColor: '#ffffff',
                                color: '#112D4E',
                                border: '#112D4E 1px solid',
                                borderRadius: '5px',
                                padding: '1% 1.5%',
                                cursor: 'pointer',
                                height: '45px',
                                textDecoration: 'none'
                            }}>
                                취소
                            </button>
                            <button onClick={handleUpdateCommute} style={{
                                width: '50px',
                                backgroundColor: '#112D4E',
                                color: 'white',
                                borderRadius: '5px',
                                padding: '1% 1.5%',
                                cursor: 'pointer',
                                height: '45px',
                                textDecoration: 'none'
                            }}>
                                퇴근
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ClockOutModal;

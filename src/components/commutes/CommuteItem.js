import { useEffect, useRef, useState } from "react";
import InsertCorrectionModal from "./InsertCorrectionModal";
import { useDispatch } from "react-redux";
import { callInsertCorrectionAPI } from "../../apis/CommuteAPICalls";

function CommuteItem({ commute, tableStyles, evenRow, date, parsingDateOffset }) {

    // console.log('[CommuteItem] commute : ', commute);
    // console.log('[CommuteItem] commute.commuteNo : ', commute.commuteNo);
    // console.log('[CommuteItem] commute.workingDate : ', commute.workingDate);
    // console.log('[CommuteItem] date : ', date);
    // console.log('[CommuteItem] parsingDateOffset : ', parsingDateOffset);

    const insertCorrection = {
        backgroundColor: '#3F72AF',
        cursor: 'pointer',
        color: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #3F72AF',
        '&:hover': {
            cursor: '#112D4E',
        },
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '1px',
        paddingBottom: '1px'
    };

    const [showModal, setShowModal] = useState(false);
    const [showBtn, setShowBtn] = useState(true);
    const dispatch = useDispatch();

    /* 정정 요청 등록 핸들러 */
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveModal = ({ corrStartWork, corrEndWork, reason }) => {
        const newCorrection = {
            commuteNo: commute.commuteNo,
            reqStartWork: corrStartWork,
            reqEndWork: corrEndWork,
            reasonForCorr: reason,
            corrRegistrationDate: date,
            corrStatus: '대기'
        };
        dispatch(callInsertCorrectionAPI(newCorrection));
        setShowBtn(false);
    }

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    /* 총 근무 시간 형식 변경 */
    const formatTotalWorkingHours = (totalWorkingHours) => {
        if (totalWorkingHours == 0) {
            return '';
        }
        const hours = Math.floor(totalWorkingHours / 60);
        const minutes = totalWorkingHours % 60;
        return `${hours}시간 ${minutes}분`;
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

    /* 근무 시간 그래프 */
    const ProgressBar = ({ startTime, endTime }) => {
        const [progress, setProgress] = useState(0);
        const intervalRef = useRef(null);
        let startHour, startMinute, endHour, endMinute;

        useEffect(() => {
            /* 1. 출근 시간과 퇴근 시간 모두 존재하는 경우 */
            if (Array.isArray(startTime) && Array.isArray(endTime)) {

                let totalMinutes = 0;
                let elapsedMinutes = 0;

                for (let i = 0; i < startTime.length; i++) {
                    startHour = Math.floor(startTime[i] / 100);
                    startMinute = startTime[i] % 100;
                    endHour = endTime[i] !== null ? Math.floor(endTime[i] / 100) : 18;
                    endMinute = endTime[i] !== null ? endTime[i] % 100 : 0;

                    const currentMinutes = startHour * 60 + startMinute;
                    const totalMinutesForThisEntry = (endHour * 60 + endMinute) - currentMinutes;
                    totalMinutes += totalMinutesForThisEntry;

                    const currentTime = new Date();
                    const currentMinutesFromStart = currentTime.getHours() * 60 + currentTime.getMinutes() - currentMinutes;
                    elapsedMinutes += currentMinutesFromStart;
                }

                // 1초마다 진행률 업데이트
                clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                    const currentTime = new Date();
                    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                    const updatedElapsedMinutes = currentMinutes - (startHour * 60 + startMinute);

                    let updatedProgressPercentage;
                    if (updatedElapsedMinutes >= totalMinutes) {
                        updatedProgressPercentage = 100;
                    } else {
                        updatedProgressPercentage = (updatedElapsedMinutes / totalMinutes) * 100;
                    }

                    setProgress(Math.floor(updatedProgressPercentage / 10) * 10);
                }, 1000);

                /* 2. 출근 시간만 존재하는 경우 */
            } else if (Array.isArray(startTime) && (endTime === null || typeof endTime === 'undefined')) {
                let totalMinutes = 0;
                let elapsedMinutes = 0;

                for (let i = 0; i < startTime.length; i++) {
                    startHour = Math.floor(startTime[i] / 100);
                    startMinute = startTime[i] % 100;
                    endHour = 18;
                    endMinute = 0;

                    const currentMinutes = startHour * 60 + startMinute;
                    const totalMinutesForThisEntry = (endHour * 60 + endMinute) - currentMinutes;
                    totalMinutes += totalMinutesForThisEntry;

                    const currentTime = new Date();
                    const currentMinutesFromStart = currentTime.getHours() * 60 + currentTime.getMinutes() - currentMinutes;
                    elapsedMinutes += currentMinutesFromStart;
                }

                // 1초마다 진행률 업데이트
                clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                    const currentTime = new Date();
                    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                    const updatedElapsedMinutes = currentMinutes - (startHour * 60 + startMinute);
                    const updatedProgressPercentage = (updatedElapsedMinutes / totalMinutes) * 100;
                    setProgress(Math.floor(updatedProgressPercentage / 10) * 10);
                }, 1000);
            }

            return () => {
                clearInterval(intervalRef.current);
            };
        }, [startTime, endTime]);

        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        );
    };

    return <>
        <tr style={evenRow ? tableStyles.evenRow : {}}>
            <td style={tableStyles.tableCell1}>{formatWorkingDate(commute.workingDate || '')}</td>
            <td style={tableStyles.tableCell2}>{formatTotalWorkingHours(commute.totalWorkingHours || 0)}</td>
            <td style={tableStyles.tableCell3}>{formatWorkingTime(commute.startWork || [])}</td>
            <td style={tableStyles.tableCell4}>{formatWorkingTime(commute.endWork || [])}</td>
            <td style={tableStyles.tableCell5}><ProgressBar startTime={commute.startWork || []} endTime={commute.endWork || []} /></td>
            <td style={tableStyles.tableCell6}>{commute.workingStatus || '미출근'}</td>
            {/* <td style={tableStyles.tableCell7}><button style={insertCorrection} onClick={handleOpenModal} >정정</button></td> */}
            {showBtn && (
                <td style={tableStyles.tableCell7}>
                    <button style={insertCorrection} onClick={handleOpenModal}>
                        정정
                    </button>
                </td>
            )}
        </tr>
        <InsertCorrectionModal isOpen={showModal} onClose={handleCloseModal} onSave={handleSaveModal} date={commute.workingDate} startWork={formatWorkingTime(commute.startWork)} endWork={formatWorkingTime(commute.endWork)} />
    </>
}

export default CommuteItem;
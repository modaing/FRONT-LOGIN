import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InsertCorrectionModal from "./InsertCorrectionModal";
import { useDispatch } from "react-redux";
import { callInsertCorrectionAPI, callSelectCommuteListAPI } from "../../apis/CommuteAPICalls";

function CommuteItem({ commute, tableStyles, evenRow, date, memberId, parsingDateOffset, handleCorrectionRegistered, onClose }) {

    const [showModal, setShowModal] = useState(false);
    const [showBtn, setShowBtn] = useState(true);
    const [commuteNo, setCommuteNo] = useState(commute.commuteNo);
    const dispatch = useDispatch();

    /* 정정 요청 등록 핸들러 */
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        onClose();
        setShowModal(false);
    };

    const handleSaveModal = ({ corrStartWork, corrEndWork, reason }) => {
        console.log('commuteNo 저장 ', commute.commuteNo);
        const newCorrection = {
            commuteNo: commute.commuteNo,
            reqStartWork: corrStartWork,
            reqEndWork: corrEndWork,
            reasonForCorr: reason,
            corrRegistrationDate: parsingDateOffset,
            corrStatus: '대기'
        };
        dispatch(callInsertCorrectionAPI(newCorrection));
        // console.log('이유', reason);
        // console.log('정정 요청 성공~!!!!!');
        setShowBtn(false);
    }

    useEffect(() => {
        if (commute.correction?.corrRegistrationDate) {
            setShowBtn(false);
            dispatch(callSelectCommuteListAPI('member', memberId, parsingDateOffset));
        } else {
            setShowBtn(true);
        }
    }, [parsingDateOffset]);

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

        }, [startTime, endTime, commute]);

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

    /* 임시 저장 출퇴근 내역은 렌더링 막는 기능 */
    if (commute.workingStatus === '출퇴근 미입력으로 정정 대기 중') {
        return null;
    };

    return <>
        {/* <tr style={evenRow ? tableStyles.evenRow : {}}>
            <td style={tableStyles.tableCell1}>{formatWorkingDate(commute.workingDate || '')}</td>
            <td style={tableStyles.tableCell2}>{formatTotalWorkingHours(commute.totalWorkingHours || 0)}</td>
            <td style={tableStyles.tableCell3}>{formatWorkingTime(commute.startWork || [])}</td>
            <td style={tableStyles.tableCell4}>{formatWorkingTime(commute.endWork || [])}</td>
            <td style={tableStyles.tableCell5}><ProgressBar startTime={commute.startWork || []} endTime={commute.endWork || []} /></td>
            <td style={tableStyles.tableCell6}>{commute.workingStatus || '미출근'}</td>
            {(commute.correction?.corrRegistrationDate) ? (
                <td></td>
            ) : (
                <td style={tableStyles.tableCell7}>
                <button style={insertCorrection} onClick={handleOpenModal}>
                    정정
                </button>
            </td>
            )}
        </tr> */}
        <tr style={evenRow ? tableStyles.evenRow : {}}>
            <td style={tableStyles.tableCell1}>{formatWorkingDate(commute.workingDate || '')}</td>
            <td style={tableStyles.tableCell2}>{formatTotalWorkingHours(commute.totalWorkingHours || 0)}</td>
            <td style={tableStyles.tableCell3}>{formatWorkingTime(commute.startWork || [])}</td>
            <td style={tableStyles.tableCell4}>{formatWorkingTime(commute.endWork || [])}</td>
            <td style={tableStyles.tableCell5}><ProgressBar startTime={commute.startWork || []} endTime={commute.endWork || []} /></td>
            <td style={tableStyles.tableCell6}>{commute.workingStatus || '미출근'}</td>
            {(commute.correction?.corrRegistrationDate) ? (
                <td></td>
            ) : (
                <td style={tableStyles.tableCell7}>
                    <button className="insertCorrection" onClick={handleOpenModal}>
                        정정
                    </button>
                </td>
            )}
        </tr>
        {showModal && (
            <InsertCorrectionModal
                commute={commute}
                commuteNo={commuteNo}
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveModal}
                date={commute.workingDate}
                startWork={formatWorkingTime(commute.startWork)}
                endWork={formatWorkingTime(commute.endWork)}
                handleCorrectionRegistered={handleCorrectionRegistered}
                handleCloseModal={onClose}
            />
        )}
    </>
}

export default CommuteItem;

// const insertCorrection = {
//     fontSize: '16px',
//     backgroundColor: '#3F72AF',
//     cursor: 'pointer',
//     color: '#FFFFFF',
//     borderRadius: '5px',
//     border: '1px solid #3F72AF',
//     '&:hover': {
//         cursor: '#112D4E',
//     },
//     paddingLeft: '10px',
//     paddingRight: '10px',
//     paddingTop: '5px',
//     paddingBottom: '5px'
// };
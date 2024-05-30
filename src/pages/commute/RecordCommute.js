import React, { useEffect, useState } from 'react';
import '../../css/commute/commute.css';
import CommuteListByMember from "../../components/commutes/CommuteListByMember";
import { useDispatch, useSelector } from "react-redux";
import { callSelectCommuteListAPI } from "../../apis/CommuteAPICalls";
import CommuteTime from "../../components/commutes/CommuteTime";
import { decodeJwt } from '../../utils/tokenUtils';
import { Link } from 'react-router-dom';
import ClockInModal from '../../components/commutes/ClockInModal';
import dayjs from "dayjs";
import 'react-datepicker/dist/react-datepicker.css';
import ClockOutModal from '../../components/commutes/ClockOutModal';
import ClockLimitModal from '../../components/commutes/ClockLimitModal';
import NewCommuteAndCorrection from '../../components/commutes/NewCommuteAndCorrection';
import { setExpectedTotalWorkingTime, setStartTime, setWorkingHoursStatus } from '../../modules/CommuteModule';
import ClockOutWarningModalBy52 from '../../components/commutes/ClockOutWarningModalBy52';
import LimitClockinModalBy52 from '../../components/commutes/LimitClockInModalBy52';

function RecordCommute() {

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    const [date, setDate] = useState(new Date());
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    const currentDate = new Date(parsingDateOffset);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [shouldRefresh, setShouldRefresh] = useState(false);

    /* 로그인한 유저의 토큰 복호화 */
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[RecordCommute] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[RecordCommute] memberId : ', memberId);

    const [target, setTarget] = useState('member');
    const [targetValue, setTargetValue] = useState(memberId);

    const [isClocked, setIsClocked] = useState(false);
    const [todaysCommute, setTodaysCommute] = useState(null);

    const [showClockInModal, setShowClockInModal] = useState(false);
    const [showClockOutModal, setShowClockOutModal] = useState(false);
    const [showClockLimitModal, setShowClockLimitModal] = useState(false);
    const [showNewCommuteAndCorrModal, setShowNewCommuteAndCorrModal] = useState(false);
    const [showClockOutWarningModalBy52, setShowClockOutWarningModalBy52] = useState(false);
    const [showLimitClockInModalBy52, setShowLimitClockInModalBy52] = useState(false);
    const [limitClockInButton, setLimitClockInButton] = useState(false);

    const dispatch = useDispatch();
    const { startTime, expectedTotalWorkingTime, isWorkingHoursLimited, totalWorkingHours } = useSelector(
        (state) => state.commuteReducer
    );

    /* 출퇴근 내역 액션 */
    const result = useSelector(state => state.commuteReducer);
    const commuteList = result.commutelist;

    /* 출퇴근 내역 API 호출 */
    useEffect(() => {
        (dispatch(callSelectCommuteListAPI(target, targetValue, parsingDateOffset)));
    }, [dispatch, todaysCommute, target, targetValue, date,
        parsingDateOffset, showClockInModal, showClockOutModal, showClockLimitModal,
        selectedDate, commuteList.correction, shouldRefresh]);

    /* 한 주 전으로 이동 */
    const handlePreviousClick = () => {
        setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7));
    };

    /* 한 주 후로 이동 */
    const handleNextClick = () => {
        setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7));
    };

    /* 날짜 데이터 파싱 */
    const parseDate = (dateData) => {
        if (Array.isArray(dateData)) {
            return dayjs(new Date(dateData[0], dateData[1] - 1, dateData[2])).format('YYYY-MM-DD');
        } else {
            return dateData;
        }
    };

    /* 출퇴근 내역에서 오늘 날짜의 출퇴근 내역 찾기 */
    const todayCommute = commuteList.find(
        (commute) => parseDate(commute.workingDate) === parsingDateOffset
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - (startTime?.getTime() || 0);
            const differenceInMinutes = Math.floor(timeDiff / (1000 * 60));

            const remainingWorkingTimeInMinutes = expectedTotalWorkingTime - differenceInMinutes;
            if (remainingWorkingTimeInMinutes <= 10) {
                setShowClockOutWarningModalBy52(true);
            } else {
                setShowClockOutWarningModalBy52(false);
            }
        }, 60000); // 1분 간격으로 확인

        return () => clearInterval(interval);
    });


    const calculateExpectedTotalWorkingTime = (clockInTime) => {
        // 예상 총 근로 시간 계산 로직 구현
        // 예를 들어, 현재 시간과의 차이를 계산하여 예상 근무 시간 도출
        const currentTime = new Date();
        const expectedWorkingMinutes = (currentTime.getTime() - clockInTime.getTime()) / (1000 * 60);
        return expectedWorkingMinutes;
    };

    const handleClockIn = () => {
        try {

            // const koreaCurrentTimeMs = new Date(Date.now() + (9 * 60 * 60 * 1000)).getTime(); // UTC+9 (Korea)
            // dispatch(setStartTime({ startTime: new Date(Date.now() + (9 * 60 * 60 * 1000)) }));

            // // 예상 총 근로 시간 계산
            // const expectedTotalWorkingTime = calculateExpectedTotalWorkingTime(
            //     startTime?.getTime() || koreaCurrentTimeMs,
            //     koreaCurrentTimeMs
            // );
            // dispatch(setExpectedTotalWorkingTime({ expectedTotalWorkingTime }));
            // console.log('예상 총 근무시간 : ', expectedTotalWorkingTime);

            // // 51시간 50분 초과 여부 확인 후 경고 모달 표시
            // dispatch(
            //     setWorkingHoursStatus({
            //         isWorkingHoursLimited: expectedTotalWorkingTime > 51 * 60 + 50,
            //         totalWorkingHours: expectedTotalWorkingTime,
            //     })
            // );

            if (todayCommute != null) {
                if (todayCommute.endWork == null) {
                    setShowClockOutModal(true);
                    setTodaysCommute(todayCommute);
                    setIsClocked(true); // 퇴근 버튼 보이도록 설정

                    const koreaCurrentTimeMs = new Date(Date.now() + (9 * 60 * 60 * 1000)).getTime(); // UTC+9 (Korea)
                    dispatch(setStartTime({ startTime: new Date(Date.now() + (9 * 60 * 60 * 1000)) }));

                    // 예상 총 근로 시간 계산
                    const expectedTotalWorkingTime = calculateExpectedTotalWorkingTime(
                        startTime?.getTime() || koreaCurrentTimeMs,
                        koreaCurrentTimeMs
                    );
                    dispatch(setExpectedTotalWorkingTime({ expectedTotalWorkingTime }));
                    console.log('예상 총 근무시간 : ', expectedTotalWorkingTime);

                    // 51시간 50분 초과 여부 확인 후 경고 모달 표시
                    dispatch(
                        setWorkingHoursStatus({
                            isWorkingHoursLimited: expectedTotalWorkingTime > 51 * 60 + 50,
                            totalWorkingHours: expectedTotalWorkingTime,
                        })
                    );
                } else {
                    setShowClockLimitModal(true);
                    setIsClocked(false); // 출근 버튼 보이도록 설정

                    const koreaCurrentTimeMs = new Date(Date.now() + (9 * 60 * 60 * 1000)).getTime(); // UTC+9 (Korea)
                    dispatch(setStartTime({ startTime: new Date(Date.now() + (9 * 60 * 60 * 1000)) }));

                    // 예상 총 근로 시간 계산
                    const expectedTotalWorkingTime = calculateExpectedTotalWorkingTime(
                        startTime?.getTime() || koreaCurrentTimeMs,
                        koreaCurrentTimeMs
                    );
                    dispatch(setExpectedTotalWorkingTime({ expectedTotalWorkingTime }));
                    console.log('예상 총 근무시간 : ', expectedTotalWorkingTime);

                    // 51시간 50분 초과 여부 확인 후 경고 모달 표시
                    dispatch(
                        setWorkingHoursStatus({
                            isWorkingHoursLimited: expectedTotalWorkingTime > 51 * 60 + 50,
                            totalWorkingHours: expectedTotalWorkingTime,
                        })
                    );
                }
            } else {
                setTodaysCommute(todayCommute);
                setShowClockInModal(true);
                setIsClocked(false); // 출근 버튼 보이도록 설정

                const koreaCurrentTimeMs = new Date(Date.now() + (9 * 60 * 60 * 1000)).getTime(); // UTC+9 (Korea)
                dispatch(setStartTime({ startTime: new Date(Date.now() + (9 * 60 * 60 * 1000)) }));

                // 예상 총 근로 시간 계산
                const expectedTotalWorkingTime = calculateExpectedTotalWorkingTime(
                    startTime?.getTime() || koreaCurrentTimeMs,
                    koreaCurrentTimeMs
                );
                dispatch(setExpectedTotalWorkingTime({ expectedTotalWorkingTime }));
                console.log('예상 총 근무시간 : ', expectedTotalWorkingTime);

                // 51시간 50분 초과 여부 확인 후 경고 모달 표시
                dispatch(
                    setWorkingHoursStatus({
                        isWorkingHoursLimited: expectedTotalWorkingTime > 51 * 60 + 50,
                        totalWorkingHours: expectedTotalWorkingTime,
                    })
                );
            }
        } catch (error) {
            console.error('Error checking commute:', error);
        }
    };

    const handleNewCommuteAndCorrection = () => {
        try {
            setShowNewCommuteAndCorrModal(true);
        } catch (error) {
            console.log('Error checking commute:', error);
        }
    };

    const handleClockInModalClose = () => {
        setShowClockInModal(false);
        setIsClocked((prevState) => !prevState); // 버튼 상태 변경
        handleClockInCompleted(); // 출근 등록 완료 후 콜백 호출
    };

    const handleClockInCompleted = () => {
        // 출퇴근 내역 조회 API 재호출
        (dispatch(callSelectCommuteListAPI(target, targetValue, parsingDateOffset)));
    };

    const handleClockOutModalClose = () => {
        setShowClockOutModal(false);
        setIsClocked((prevState) => !prevState); // 버튼 상태 변경
        handleClockOutCompleted(); // 퇴근 등록 완료 후 콜백 호출
    };

    const handleClockOutCompleted = () => {
        // 출퇴근 내역 조회 API 재호출
        (dispatch(callSelectCommuteListAPI(target, targetValue, parsingDateOffset)));
    };

    const handleClockLimitModalClose = () => {
        setShowClockLimitModal(false);
    };

    const handleCorrectionModalClose = () => {
        handleCorrectionRegistered();
        setShouldRefresh((prevState) => !prevState);
    };

    const handleCorrectionRegistered = () => {
        setShouldRefresh((prevState) => !prevState);
        dispatch(callSelectCommuteListAPI(target, targetValue, parsingDateOffset));
    };

    const handleNewCommuteAndCorrModalClose = () => {
        setShowNewCommuteAndCorrModal(false);
    }

    /* 실제 근로 시간이 52시간에 도달하여 출근시간 등록 제한 경고 모달 */
    const handleShowLimitClockInModalBy52 = () => {
        setShowLimitClockInModalBy52(true);
    }

    const handleShowLimitClockInModalBy52Close = () => {
        setShowLimitClockInModalBy52(false);
    }

    /* 잔여 근로 시간이 8시간 이하일 경우 잔여 근로 시간 내에 '퇴근하기' 진행 권고 모달 */
    const handleShowLimitClockOutWarningModalBy52 = () => {
        setShowClockOutWarningModalBy52(true);
    }

    const handleShowLimitClockOutWarningModalBy52Close = () => {
        setShowClockOutWarningModalBy52(false);
    }

    const handleShowLimitClockInButton = () => {
        setLimitClockInButton(true);
    }

    return <>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>출퇴근</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 내역</li>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Link
                                to="/recordCommute"
                                className="notice-insert-button regist"
                                style={
                                    !todayCommute
                                        ? insertButton
                                        : todayCommute
                                            ? updateButton
                                            : insertButton
                                }
                                onClick={handleClockIn}
                            >
                                {!todayCommute
                                    ? '출근 시간 등록'
                                    : todayCommute
                                        ? '퇴근 시간 등록'
                                        : '출근 시간 등록'
                                }
                            </Link>
                            <Link
                                to="/recordCommute"
                                className="notice-insert-button"
                                style={insert2Button}
                                onClick={handleNewCommuteAndCorrection}
                            >
                                <span>미출근 정정 요청</span>
                            </Link>
                        </div>
                        {showClockInModal && (
                            <ClockInModal
                                isOpen={showClockInModal}
                                onClose={handleClockInModalClose}
                                parsingDateOffset={parsingDateOffset}
                                memberId={memberId}
                                commuteList={commuteList}
                                onClockInCompleted={handleClockInCompleted} // 콜백 전달
                            />
                        )}
                        {showClockOutModal && (
                            <ClockOutModal
                                isOpen={showClockOutModal}
                                onClose={handleClockOutModalClose}
                                parsingDateOffset={parsingDateOffset}
                                memberId={memberId}
                                commuteList={commuteList}
                                onClockOutCompleted={handleClockOutCompleted} // 콜백 전달
                            />
                        )}
                        {showClockLimitModal && (
                            <ClockLimitModal
                                isOpen={showClockLimitModal}
                                onClose={handleClockLimitModalClose}
                                parsingDateOffset={parsingDateOffset}
                            />
                        )}
                        {showNewCommuteAndCorrModal && (
                            <NewCommuteAndCorrection
                                commuteList={commuteList}
                                isOpen={showNewCommuteAndCorrModal}
                                onClose={handleNewCommuteAndCorrModalClose}
                                parsingDateOffset={parsingDateOffset}
                                memberId={memberId}
                            />
                        )}
                        {showClockOutWarningModalBy52 && (  // 잔여 근로 시간 8시간 이하일 때 잔여 근로 시간 내 퇴근 등록 안내 모달 
                            <ClockOutWarningModalBy52
                                date={date}
                                isOpen={showClockOutWarningModalBy52}
                                onClose={handleShowLimitClockOutWarningModalBy52Close}
                                commute={commuteList}
                            />
                        )}
                        {showLimitClockInModalBy52 && ( // 잔여 근로 시간 2분 미만일 때 출근 제한 안내 모달
                            <LimitClockinModalBy52
                                date={date}
                                isOpen={showLimitClockInModalBy52}
                                onClose={handleShowLimitClockInModalBy52Close}
                                parsingDateOffset={parsingDateOffset}
                                commute={commuteList}
                            />
                        )}
                    </ol>
                </nav>
            </div>
            <div>
                {commuteList && (
                    <CommuteTime
                        key={commuteList.commuteNo}
                        commute={commuteList}
                        date={date}
                        handlePreviousClick={handlePreviousClick}
                        handleNextClick={handleNextClick}
                        handleShowLimitClockInModalBy52={handleShowLimitClockInModalBy52}
                        handleShowLimitClockOutWarningModalBy52={handleShowLimitClockOutWarningModalBy52}
                        handleShowLimitClockInButton={handleShowLimitClockInButton}
                    />
                )}
            </div>
            <div>
                {commuteList && (
                    <CommuteListByMember
                        key={commuteList.commuteNo}
                        commute={commuteList}
                        date={date}
                        parsingDateOffset={parsingDateOffset}
                        memberId={memberId}
                        handleCorrectionRegistered={handleCorrectionRegistered}
                        onClose={handleCorrectionModalClose}
                    />
                )}
            </div>
        </main>
    </>

}

export default RecordCommute;

const insertButton = {
    fontSize: '16px',
    width: '150px',
    float: 'right',
    backgroundColor: '#112D4E',
    color: 'white',
    borderRadius: '5px',
    padding: '1% 1.5%',
    cursor: 'pointer',
    height: '45px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const updateButton = {
    fontSize: '16px',
    width: '150px',
    float: 'right',
    backgroundColor: '#ffffff',
    color: '#112D4E',
    border: '#112D4E 1px solid',
    borderRadius: '5px',
    padding: '1% 1.5%',
    cursor: 'pointer',
    height: '45px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const insert2Button = {
    fontSize: '16px',
    width: '150px',
    float: 'right',
    backgroundColor: '#3F72AF',
    color: 'white',
    borderRadius: '5px',
    padding: '1% 1.5%',
    cursor: 'pointer',
    marginLeft: '20px',
    height: '45px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
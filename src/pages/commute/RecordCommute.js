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

    const dispatch = useDispatch();

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

    const handleClockIn = () => {
        try {
            if (todayCommute != null) {
                if (todayCommute.endWork == null) {
                    setShowClockOutModal(true);
                    setTodaysCommute(todayCommute);
                } else {
                    setShowClockLimitModal(true);
                }
            } else {
                setTodaysCommute(todayCommute);
                setShowClockInModal(true);
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

    return <>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>출퇴근</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 내역</li>
                            <Link
                                to="/recordCommute"
                                className="notice-insert-button"
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
                                    ? '출근하기'
                                    : todayCommute
                                        ? '퇴근하기'
                                        : '출근하기'
                                }
                            </Link>
                            <Link
                                to="/recordCommute"
                                className="notice-insert-button"
                                style={insert2Button}
                                onClick={handleNewCommuteAndCorrection}
                            >
                                정정요청
                            </Link>
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
                        handleNextClick={handleNextClick} />
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
                        onClose={handleCorrectionModalClose} />
                )}
            </div>
        </main>
    </>

}

export default RecordCommute;

const insertButton = {
    width: '100px',
    float: 'right',
    backgroundColor: '#112D4E',
    color: 'white',
    borderRadius: '5px',
    padding: '1% 1.5%',
    cursor: 'pointer',
    marginLeft: '60%',
    height: '45px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    alignItems: 'center',
    justifyContent: 'center',
};

const updateButton = {
    width: '100px',
    float: 'right',
    backgroundColor: '#ffffff',
    color: '#112D4E',
    border: '#112D4E 1px solid',
    borderRadius: '5px',
    padding: '1% 1.5%',
    cursor: 'pointer',
    marginLeft: '60%',
    height: '45px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    alignItems: 'center',
    justifyContent: 'center',
};

const insert2Button = {
    width: '100px',
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
    display: 'inline-block',
    alignItems: 'center',
    justifyContent: 'center',
};
import React, { useEffect, useState } from 'react';
import '../../css/commute/commute.css';
import CommuteListByMember from "../../components/commutes/CommuteListByMember";
import { useDispatch, useSelector } from "react-redux";
import { callInsertCommuteAPI, callSelectCommuteListAPI, callUpdateCommuteAPI } from "../../apis/CommuteAPICalls";
import CommuteTime from "../../components/commutes/CommuteTime";
import { decodeJwt } from '../../utils/tokenUtils';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { handleAction } from 'redux-actions';
import ClockInModal from '../../components/commutes/ClockInModal';
import dayjs from "dayjs";

import 'react-datepicker/dist/react-datepicker.css';
import RecordCorrectionOfCommute from './RecordCorrectionOfCommute';
import ClockOutModal from '../../components/commutes/ClockOutModal';
import ClockLimitModal from '../../components/commutes/ClockLimitModal';
import { textAlign, width } from '@mui/system';

function RecordCommute() {

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
      
      const updateButton = {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

    const OPTIONS = [
        { value: "2024-03", name: "2024-03" },
        { value: "2024-04", name: "2024-04" },
        { value: "2024-05", name: "2024-05" }
    ];

    const Select = styled.select`
        margin-left: 20px;
        webkit-appearance: none;
        moz-appearance: none;
	    appearance: none;
        width: 100px;
        height: 45px;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        border-color: #D5D5D5;
    `;

    const SelectBox = (props) => {
        return (
            <Select>
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        defaultValue={props.defaultValue === option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        );
    };

    const handleAction = () => {
        // 날짜 선택 시 value 적용하는 로직
        <option>
        </option>
    };

    /* 로그인한 유저의 토큰 복호화 */
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[RecordCommute] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[RecordCommute] memberId : ', memberId);

    const [target, setTarget] = useState('member');
    const [targetValue, setTargetValue] = useState(memberId);

    const [date, setDate] = useState(new Date());
    const [isClocked, setIsClocked] = useState(false);
    const [lastCommuteNo, setLastCommuteNo] = useState(null);
    const [todaysCommute, setTodaysCommute] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isInsert, setIsInsert] = useState(false);

    const [showClockInModal, setShowClockInModal] = useState(false);
    const [showClockOutModal, setShowClockOutModal] = useState(false);
    const [showClockLimitModal, setShowClockLimitModal] = useState(false);

    const dispatch = useDispatch();

    /* 출퇴근 내역 액션 */
    const result = useSelector(state => state.commuteReducer);
    console.log('[RecordCommute] result : ', result);
    const commuteList = result.commutelist;

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    /* 출퇴근 내역 API 호출 */
    useEffect(() => {
        (dispatch(callSelectCommuteListAPI(target, targetValue, parsingDateOffset)));
    }, [dispatch, target, targetValue, date, parsingDateOffset, todaysCommute, showClockInModal, showClockOutModal, showClockLimitModal]);

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

    /* 오늘이 포함된 주인지 확인 */
    const isCurrentWeek = () => {
        const today = new Date(parsingDateOffset);
        const mondayDate = new Date(today.setDate(today.getDate() - today.getDay()));
        const sundayDate = new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + 6);
        return (
            parsingDateOffset >= mondayDate.toISOString().slice(0, 10) &&
            parsingDateOffset <= sundayDate.toISOString().slice(0, 10)
        );
    };

    const handleClockIn = () => {
        try {
            
            console.log('오늘출퇴근기록 쳌 ', todayCommute);
            console.log('현재 날짜 쳌 (parsingDateOffset)', parsingDateOffset);

            if (todayCommute != null) {
                if (todayCommute.endWork == null) {
                    setShowClockOutModal(true);
                    setTodaysCommute(todayCommute);
                } else {
                    setShowClockLimitModal(true);
                }
            } else {
                setShowClockInModal(true);
                setTodaysCommute(todayCommute);
            }
        } catch (error) {
            console.error('Error checking commute:', error);
        }
    };

    const handleClockInModalClose = () => {
        setShowClockInModal(false);
        setIsClocked((prevState) => !prevState); // 버튼 상태 변경
    };

    const handleClockOutModalClose = () => {
        setShowClockOutModal(false);
        setIsClocked((prevState) => !prevState); // 버튼 상태 변경
    };

    const handleClockLimitModalClose = () => {
        setShowClockLimitModal(false);
    };

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
                            // style={!todayCommute ? insertButton : (todayCommute ? updateButton : insertButton)}
                            style={
                                isCurrentWeek()
                                    ? todayCommute
                                        ? todayCommute.endWork == null
                                            ? updateButton
                                            : { display: 'none' }
                                        : insertButton
                                    : { display: 'none' }
                            }
                            onClick={handleClockIn}
                        >
                            {/* {!todayCommute ? '출근하기' : (todayCommute ? '퇴근하기' : '출근하기')} */}
                            {isCurrentWeek()
                                ? todayCommute
                                    ? todayCommute.endWork == null
                                        ? '퇴근하기'
                                        : ''
                                    : '출근하기'
                                : ''}
                        </Link>
                        {showClockInModal && (
                            <ClockInModal
                                isOpen={showClockInModal}
                                onClose={handleClockInModalClose}
                                parsingDateOffset={parsingDateOffset}
                                memberId={memberId}
                                commuteList={commuteList}
                            // handleClockIn={handleClockIn}
                            />
                        )}
                        {showClockOutModal && (
                            <ClockOutModal
                                isOpen={showClockOutModal}
                                onClose={handleClockOutModalClose}
                                parsingDateOffset={parsingDateOffset}
                                memberId={memberId}
                                commuteList={commuteList}
                            // handleClockOut={handleClockOut}
                            />
                        )}
                        {showClockLimitModal && (
                            <ClockLimitModal
                                isOpen={showClockLimitModal}
                                onClose={handleClockLimitModalClose}
                                parsingDateOffset={parsingDateOffset}
                            />
                        )}
                        <SelectBox options={OPTIONS} defaultValue={date} onChange={handleAction}></SelectBox>
                    </ol>
                </nav>
            </div>
            <div>
                {commuteList && (
                    <CommuteTime key={commuteList.commuteNo} commute={commuteList} date={date} handlePreviousClick={handlePreviousClick} handleNextClick={handleNextClick} />
                )}
            </div>
            <div>
                {commuteList && (
                    <CommuteListByMember key={commuteList.commuteNo} commute={commuteList} date={date} parsingDateOffset={parsingDateOffset} memberId={memberId} />
                )}
            </div>
        </main>
        {/* <ClockInModal isOpen={showModal} onClose={() => setShowModal(false)} isInsert={isInsert} memberId={memberId} parsingDateOffset={parsingDateOffset} /> */}
    </>

}

export default RecordCommute;
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
import 'react-datepicker/dist/react-datepicker.css';

function RecordCommute() {

    const insertButton = {
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '5px',
        padding: '1% 1.5%',
        cursor: 'pointer',
        marginLeft: '60%',
        height: '45px',
        textDecoration: 'none'
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
        textDecoration: 'none'
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
    const [chooseMonth, setChooseMonth] = useState(null);

    const dispatch = useDispatch();

    /* 출퇴근 내역 액션 */
    const result = useSelector(state => state.commuteReducer);
    console.log('[RecordCommute] result : ', result);
    const commuteList = result.commutelist;
    console.log('[RecordCommute] commuteList : ', commuteList);
    const correctionList = result.correctionlist;
    console.log('[RecordCommute] correctionList : ', correctionList);


    /* 출근 시간 액션 */
    const postCommute = result.postcommute;
    console.log('[RecordCommute] postCommute : ', postCommute);

    /* 퇴근 시간 액션 */
    const putCommute = result.putcommute;
    console.log('[RecordCommute] putCommute : ', putCommute);

    // 출퇴근 정정 관리 때 필요함!!
    // useEffect(() => {
    //     if (role === 'ADMIN') {
    //         setTarget('depart');
    //         setTargetValue(departNo);
    //     } else {
    //         setTarget('member');
    //         setTargetValue(1);
    //     }
    // }, [role, memberId, departNo]
    // );

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    // console.log('[RecordCommute] date : ', date);
    // console.log('[RecordCommute] date.toISOString().slice(0, 10) : ', date.toISOString().slice(0, 10));
    // console.log('[RecordCommute] date.toISOString() : ', date.toISOString());
    // console.log('[RecordCommute] offset : ', offset);
    // console.log('[RecordCommute] dateOffset : ', dateOffset);
    // console.log('[RecordCommute] dateOffset.toISOString() : ', dateOffset.toISOString());
    // console.log('[RecordCommute] parsingDateOffset : ', parsingDateOffset);

    /* 출퇴근 내역 API 호출 */
    useEffect(() => {
        // console.log('[useEffect] target : ', target);
        // console.log('[useEffect] targetValue : ', targetValue);
        // console.log('[useEffect] date : ', date);
        dispatch(callSelectCommuteListAPI(target, targetValue, dateOffset.toISOString().slice(0, 10)));
    }, [dispatch, target, targetValue, date, postCommute, putCommute, parsingDateOffset, todaysCommute]);

    /* 한 주 전으로 이동 */
    const handlePreviousClick = () => {
        setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7));
    };

    /* 한 주 후로 이동 */
    const handleNextClick = () => {
        setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7));
    };

    /* 현재 시간 포맷 */
    let today = new Date();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);

    let timeString = hours + ':' + minutes;

    /* 총 근무 시간 계산 */


    /* 출근하기 API 호출 */
    const handleClockIn = () => {
        try {
            if (todaysCommute === parsingDateOffset) {
                setShowModal(true);
                console.log('모달오픈!!!!!!!!!!', showModal);

            } else {
                let newCommute = {
                    memberId: memberId,
                    workingDate: new Date().toISOString().slice(0, 10),
                    startWork: timeString,
                    workingStatus: "근무중",
                    totalWorkingHours: 0
                };
                console.log('출근 api 호출 : ', newCommute);

                dispatch(callInsertCommuteAPI(newCommute));
                setIsClocked(true);
                
                const parsedDate = new Date((result.commutelist[result.commutelist.length - 1].workingDate));
                const formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;

                console.log('todaysCommute', todaysCommute);
                console.log('parsedDate 마지막 내역의 날짜 : ', parsedDate);
                console.log('formattedDate : ', formattedDate);
                console.log('parsingDateOffset 오늘 날짜 : ', parsingDateOffset);

                if (result.commutelist.length > 0) {
                    setLastCommuteNo(result.commutelist[result.commutelist.length - 1].commuteNo);
                    setTodaysCommute(formattedDate);
                };
            }

        } catch (error) {
            console.error('Error inserting commute:', error);
        }
    };

    /* 오늘 출근 제한 모달 핸들러 */
    const handleClockInModalClose = () => {
        setShowModal(false);
        console.log('모달 닫기!!!!!!!!!', showModal);
    };

    /* 퇴근하기 API 호출 */
    const handleClockOut = async () => {
        try {
            
            if (todaysCommute == null) {
                setTodaysCommute(parsingDateOffset);
            };

            console.log('[퇴근하기 api] lastCommuteNo + 1 : ', lastCommuteNo + 1);
            console.log('퇴근할때 todaysCommute 확인!!!!!!!!', todaysCommute);

            let updateCommute = {
                commuteNo: lastCommuteNo + 1,
                endWork: timeString,
                workingStatus: "퇴근",
                totalWorkingHours: 480
            };

            dispatch(callUpdateCommuteAPI(updateCommute));
            setIsClocked(false);

        } catch (error) {
            console.error('Error inserting commute:', error);
        }
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
                            {!isClocked ? (
                                <Link to="/recordCommute" className="notice-insert-button" style={insertButton} onClick={handleClockIn}>
                                    출근하기
                                </Link>
                            ) : (
                                <Link to="/recordCommute" className="notice-insert-button" style={updateButton} onClick={handleClockOut}>
                                    퇴근하기
                                </Link>
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
                        <CommuteListByMember key={commuteList.commuteNo} commute={commuteList} date={date} parsingDateOffset={parsingDateOffset}/>
                    )}
                </div>
            </main>
            <ClockInModal isOpen={showModal} onClose={handleClockInModalClose} date={todaysCommute} />
        </>
    
}

export default RecordCommute;
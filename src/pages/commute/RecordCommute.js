import React, { useEffect, useState } from 'react';
import '../../css/commute/commute.css';
import CommuteListByMember from "../../components/commutes/CommuteListByMember";
import { useDispatch, useSelector } from "react-redux";
import { callInsertCommuteAPI, callSelectCommuteListAPI, callUpdateCommuteAPI } from "../../apis/CommuteAPICalls";
import CommuteTime from "../../components/commutes/CommuteTime";
import { decodeJwt } from '../../utils/tokenUtils';
import { Link, useParams } from 'react-router-dom';
import styled from "styled-components";
import { handleAction } from 'redux-actions';

function RecordCommute() {

    const insertButton = {
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '5px',
        padding: '1% 1.5%', // 패딩을 %로 조정
        cursor: 'pointer',
        marginLeft: '60%', // 왼쪽 여백을 %로 조정
        height: '45px',
        textDecoration: 'none'
    };

    const updateButton = {
        backgroundColor: '#ffffff',
        color: '#112D4E',
        border: '#112D4E 1px solid',
        borderRadius: '5px',
        padding: '1% 1.5%', // 패딩을 %로 조정
        cursor: 'pointer',
        marginLeft: '60%', // 왼쪽 여백을 %로 조정
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
    const [updateCommute, setUpdateCommute] = useState(
        // {
        //     commuteNo: null,
        //     endWork: '',
        //     workingStatus: "퇴근",
        //     totalWorkingHours: 0
        // }
        null
    );

    const dispatch = useDispatch();
    const { commuteNo } = useParams();

    console.log('출퇴근번호 : ', commuteNo);

    /* 출퇴근 내역 액션 */
    const result = useSelector(state => state.commuteReducer);
    console.log('[RecordCommute] result : ', result);
    const commuteList = result.commutelist;
    console.log('[RecordCommute] commuteList : ', commuteList);

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

    console.log('[RecordCommute] date : ', date);
    // console.log('[RecordCommute] date.toISOString().slice(0, 10) : ', date.toISOString().slice(0, 10));
    // console.log('[RecordCommute] date.toISOString() : ', date.toISOString());
    // console.log('[RecordCommute] offset : ', offset);
    // console.log('[RecordCommute] dateOffset : ', dateOffset);
    // console.log('[RecordCommute] dateOffset.toISOString() : ', dateOffset.toISOString());
    // console.log('[RecordCommute] dateOffset.toISOString().slice(0, 10) : ', dateOffset.toISOString().slice(0, 10));

    /* 출퇴근 내역 API 호출 */
    useEffect(() => {
        console.log('[useEffect] target : ', target);
        console.log('[useEffect] targetValue : ', targetValue);
        console.log('[useEffect] date : ', date);
        dispatch(callSelectCommuteListAPI(target, targetValue, dateOffset.toISOString().slice(0, 10)));
    }, [dispatch, target, targetValue, date, postCommute]);

    /* 가장 최근 출퇴근 번호 가져오는 로직 */

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

        } catch (error) {
            console.error('Error inserting commute:', error);
        }
    };

    /* 퇴근하기 API 호출 */
    const handleClockOut = async () => {
        // try {
        //     const { allOfCommutList, latestCommuteNo } = await dispatch(callSelectCommuteListAPI(target, targetValue, date));

        //     let updateCommuteData = {
        //         commuteNo: updateCommute.commuteNo,
        //         endWork: timeString,
        //         workingStatus: "퇴근",
        //         totalWorkingHours: 480
        //     };

        //     // setUpdateCommute(
        //     //     {
        //     //         // commuteNo: commuteNo,
        //     //         endWork: timeString,
        //     //         workingStatus: "퇴근",
        //     //         totalWorkingHours: 480
        //     //     }
        //     // );
        //     console.log('퇴근 api 호출 : ', updateCommuteData);

        //     dispatch(callUpdateCommuteAPI(updateCommuteData));
        //     setIsClocked(false);


        // } catch (error) {
        //     console.error('Error inserting commute:', error);
        // }
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>출퇴근</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 내역</li>
                        {/* <Link to="/recordCommute" className="notice-insert-button" style={insertButton} >출근하기</Link> */}
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
                    <CommuteListByMember key={commuteList.commuteNo} commute={commuteList} date={date} />
                )}
            </div>
        </main>
    );
}

export default RecordCommute;
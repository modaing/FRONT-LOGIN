import React, { useEffect, useState } from 'react';
import '../../css/commute/commute.css';
import CommuteListByMember from "../../components/commutes/CommuteListByMember";
import { useDispatch, useSelector } from "react-redux";
import { callCommuteListAPI } from "../../apis/CommuteAPICalls";
import CommuteTime from "../../components/commutes/CommuteTime";
import { decodeJwt } from '../../utils/tokenUtils';
import { Link } from 'react-router-dom';
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

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[RecordCommute] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[RecordCommute] memberId : ', memberId);

    const [target, setTarget] = useState('member');
    const [targetValue, setTargetValue] = useState(memberId);
    const dispatch = useDispatch();

    const [date, setDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    });

    const result = useSelector(state => state.commuteReducer);
    console.log('[RecordCommute] result : ', result);
    const commuteList = result.commutelist;
    console.log('[RecordCommute] commuteList : ', commuteList);

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

    useEffect(() => {
        console.log('[useEffect] target : ', target);
        console.log('[useEffect] targetValue : ', targetValue);
        console.log('[useEffect] date : ', date);
        dispatch(callCommuteListAPI(target, targetValue, date));
    }, [dispatch, target, targetValue, date]);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>출퇴근</h1>
                <h5>나의 출퇴근 내역</h5>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 기록</li>
                        <Link to="/" className="notice-insert-button" style={insertButton}>출근하기</Link>
                        <SelectBox options={OPTIONS} defaultValue={date} onChange={handleAction}></SelectBox>
                    </ol>
                </nav>
            </div>
            <div>
                <CommuteTime />
            </div>
            <div>
                {commuteList && commuteList.length > 0 ? (
                    commuteList.map(commute => <CommuteListByMember key={commute.commuteNo} commute={commute} />)
                ) : (
                    <div >출퇴근 내역이 없습니다.</div>
                )}
            </div>
        </main>
    );
}

export default RecordCommute;
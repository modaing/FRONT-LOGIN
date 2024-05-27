import React, { Fragment } from 'react';
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { callSelectCommuteListAPI } from "../../apis/CommuteAPICalls";
import { textAlign } from "@mui/system";
import '../../css/commute/commute.css';
import { decodeJwt } from '../../utils/tokenUtils';

function CommuteManage() {

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

    const [date, setDate] = useState("2024-05-01"); // 발표 전 6월로 바꾸기 
    const [depart, setDepart] = useState(1);

    const SelectBox = (props) => {
        return (
            <Select value={props.defaultValue} onChange={props.onChange}>
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        );
    };

    const handleAction = (e) => {
        // 선택한 부서 번호(departNo) 설정
        const selectedDepartNo = e.target.value;
        setDepart(selectedDepartNo);

        // // 선택한 월에 따라 날짜 렌더링
        // const selectedDate = date;
        // setDate(selectedDate);
        // dispatch(callSelectCommuteListAPI(target, selectedDepartNo, parsingDateOffset));
    };

    useEffect(() => {
        dispatch(callSelectCommuteListAPI(target, depart, date));
    }, [date, depart]);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const getDayOfWeek = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
    };

    const isWeekend = (dayOfWeek) => {
        return dayOfWeek === '토' || dayOfWeek === '일';
    };

    const handleMonthChange = (e) => {
        setDate(e.target.value);
    };

    const year = parseInt(date.split("-")[0]);
    const month = parseInt(date.split("-")[1]);
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = getDayOfWeek(year, month, 1);
    const today = new Date();
    const target = 'depart';
    const dispatch = useDispatch();

    const dates = Array.from({ length: daysInMonth }, (_, index) => index + 1);

    /* 로그인한 유저의 토큰 복호화 */
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;

    /* 액션 */
    const result = useSelector(state => state.commuteReducer);
    console.log('출퇴근 캘린더 result', result);
    const commuteList = result.commutelist;
    console.log('출퇴근 캘린더 commuteList', commuteList);

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = today.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(today.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    const DEPARTOPTIONS = [
        { value: 1, name: "인사팀" },
        { value: 2, name: "개발팀" },
        { value: 3, name: "영업팀" }
    ];

    const DATEOPTIONS = [
        // { value: "2024-06-01", name: "2024-06" },    // 발표 전 주석 해제하기 
        { value: "2024-05-01", name: "2024-05" },
        { value: "2024-04-01", name: "2024-04" },
        { value: "2024-03-01", name: "2024-03" },
        { value: "2024-02-01", name: "2024-02" },
        { value: "2024-01-01", name: "2024-01" },
        { value: "2023-12-01", name: "2023-12" },
        { value: "2023-11-01", name: "2023-11" },
        { value: "2023-10-01", name: "2023-10" },
        { value: "2023-09-01", name: "2023-09" },
        { value: "2023-08-01", name: "2023-08" },
        { value: "2023-07-01", name: "2023-07" },
        { value: "2023-06-01", name: "2023-06" }
    ];

    const isSameDate = (workingDateArray, selectedDateArray) => {
        if (!workingDateArray || workingDateArray.length !== 3) {
            return false; // workingDateArray 값이 undefined이거나 배열의 길이가 3이 아닌 경우 false 반환
        }

        if (!selectedDateArray || selectedDateArray.length !== 3) {
            return false; // selectedDateArray 값이 undefined이거나 배열의 길이가 3이 아닌 경우 false 반환
        }

        const [workingYear, workingMonth, workingDay] = workingDateArray;
        const [selectedYear, selectedMonth, selectedDay] = selectedDateArray;

        return workingYear === selectedYear && workingMonth === selectedMonth && workingDay === selectedDay;
    };
    const convertTime = (timeArray) => {
        if (timeArray.length !== 2) {
            return ''; // 배열 길이가 2가 아닌 경우 빈 문자열 반환
        }

        const hour = timeArray[0];
        const minute = timeArray[1];

        return `${hour}:${minute}`;
    };

    const [dateState, setDateState] = useState(new Date(date));

    const emptyCellClass = !commuteList.commuteList || !commuteList.commuteList.find(item => isSameDate(item.workingDate, date)) ? { backgroundColor: '#D5D5D5' } : { backgroundColor: '#ffffff' };

    return (
        <>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>출퇴근</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">출퇴근</li>
                            <li className="breadcrumb-item active">출퇴근 관리</li>
                            <div className="form-check form-switch" style={{ display: 'flex' }} >
                                <h6 className="form-check-label" for="flexSwitchCheckDefault" style={{ display: 'flex', color: '#112D4E', marginLeft: '10px', marginRight: '50px'}}>근무 시간 조회</h6>
                                <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                <SelectBox options={DEPARTOPTIONS} defaultValue={depart} onChange={handleAction}></SelectBox>
                                <SelectBox options={DATEOPTIONS} defaultValue={date} onChange={handleMonthChange}></SelectBox>
                            </div>
                        </ol>
                        {/* <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                            <h1 class="form-check-label" for="flexSwitchCheckDefault">근무 시간 조회</h1>
                        </div> */}
                    </nav>
                </div>
                <div className="col-lg-12">
                    <table className="table table-hover" style={{ width: '100%', position: 'relative', overflow: 'auto' }}>
                        <thead >
                            <tr>
                                <th rowSpan={2} scope='col' style={{ width: '40px', border: '1px solid #D5D5D5', verticalAlign: 'middle', textAlign: 'center' }}>이름</th>
                                {dates.map(date => (
                                    <th
                                        key={date}
                                        style={{ ...tableStyles.tableHeaderCell, ...(isWeekend(getDayOfWeek(year, month, date)) && tableStyles.weekendCell), border: '1px solid #D5D5D5' }}
                                    >
                                        {date}/{getDayOfWeek(year, month, date)}
                                    </th>
                                ))}
                                <th rowSpan={1} scope='col' style={{ border: '1px solid #D5D5D5' }}>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commuteList.map((member, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #D5D5D5' }}>{member.name}</td>
                                    {dates.map(date => (
                                        <td key={`${index}-${date}`} style={{ border: '1px solid #D5D5D5', padding: '0px', backgroundColor: '#112D4E', color: '#ffffff' }} className={emptyCellClass}>
                                            {member.commuteList && member.commuteList.find(item => isSameDate(item.workingDate, [year, month, date])) ? (
                                                <>
                                                    <span style={{ textAlign: 'center', padding: '11px' }}>{convertTime(member.commuteList.find(item => isSameDate(item.workingDate, [year, month, date])).startWork)}</span><br />
                                                    {member.commuteList.find(item => isSameDate(item.workingDate, [year, month, date])).endWork && (
                                                        <span style={{ textAlign: 'center', padding: '11px' }}>{convertTime(member.commuteList.find(item => isSameDate(item.workingDate, [year, month, date])).endWork)}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <td style={{ backgroundColor: '#F6F5F5', width: '61px', height: '65px' }}></td>
                                            )}
                                        </td>
                                    ))}
                                    <td style={{ border: '1px solid #D5D5D5' }}>
                                        {member.commuteList && member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).reduce((total, item) => total + item.workingDate, 0)}
                                    </td>
                                    <td style={{ border: '1px solid #D5D5D5' }}>
                                        {member.commuteList && member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).length}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ border: '1px solid #D5D5D5' }}>
                                <td style={{ fontWeight: '800' }}>근무인원</td>
                                {dates && dates.map(date => (
                                    <td key={date} style={{ border: '1px solid #D5D5D5' }}>
                                        {commuteList
                                            .flatMap((member) => member.commuteList || [])
                                            .filter((commute) => isSameDate(commute.workingDate, [year, month, date]))
                                            .length}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </main >
        </>
    );
};

export default CommuteManage;

const contentStyle = {
    marginLeft: '25px'
};

const tableStyle = {
    width: '97%',
    borderCollapse: 'collapse',
    textAlign: 'center',
};

const tableStyles = {
    tableHeaderCell: {
        cursor: 'pointer',
        fontWeight: 'bold',
        padding: '15px',
        textAlign: 'center'
    },
    evenRow: {
        backgroundColor: '#f9f9f9'
    },
    weekendCell: {
        color: 'red'
    },
    tr: {
        border: 1,
    }
};
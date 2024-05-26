import { useEffect, useState } from "react";
import styled from "styled-components";
import CommuteCalendar from "../../components/commutes/CommuteCalendar";
import { useDispatch, useSelector } from "react-redux";
import { callSelectCommuteListAPI } from "../../apis/CommuteAPICalls";
import { textAlign } from "@mui/system";
import '../../css/commute/commute.css';

function CommuteManage() {
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

    const [date, setDate] = useState("2024-06");
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

        // 선택한 월에 따라 날짜 렌더링
        const selectedDate = date;
        setDate(selectedDate);
        dispatch(callSelectCommuteListAPI(target, selectedDepartNo, parsingDateOffset));
    };

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

    /* 액션 */
    const result = useSelector(state => state.commuteReducer);
    console.log('출퇴근 캘린더 result', result);
    const commuteList = result.commutelist;
    console.log('출퇴근 캘린더 commuteList', commuteList);

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = today.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(today.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    // const target = 'depart';
    // const targetValue = department;

    // useEffect(() => {
    //     dispatch(callSelectCommuteListAPI(target, department, parsingDateOffset));
    // }, [parsingDateOffset]);

    const DEPARTOPTIONS = [
        { value: 1, name: "인사팀" },
        { value: 2, name: "개발팀" },
        { value: 3, name: "영업팀" }
    ];

    const DATEOPTIONS = [
        { value: "2023-06", name: "2023-06" },
        { value: "2023-07", name: "2023-07" },
        { value: "2023-08", name: "2023-08" },
        { value: "2023-09", name: "2023-09" },
        { value: "2023-10", name: "2023-10" },
        { value: "2023-11", name: "2023-11" },
        { value: "2023-12", name: "2023-12" },
        { value: "2024-01", name: "2024-01" },
        { value: "2024-02", name: "2024-02" },
        { value: "2024-03", name: "2024-03" },
        { value: "2024-04", name: "2024-04" },
        { value: "2024-05", name: "2024-05" },
        { value: "2024-06", name: "2024-06" }
    ];

    // item.workingDate 배열과 date 값을 비교하여 동일한지 확인
    const isSameDate = (workingDateArray, date) => {
        if (!date) {
            return false; // date 값이 undefined인 경우 false 반환
        }

        const [year, month, day] = workingDateArray;
        const [selectedYear, selectedMonth, selectedDay] = date.split('-').map(Number);

        return year === selectedYear && month === selectedMonth && day === selectedDay;
    };

    const convertTime = (timeArray) => {
        if (timeArray.length !== 2) {
            return ''; // 배열 길이가 2가 아닌 경우 빈 문자열 반환
        }

        const hour = timeArray[0];
        const minute = timeArray[1];

        return `${hour}:${minute}`;
    };

    const emptyCellClass = !commuteList.commuteList || !commuteList.commuteList.find(item => isSameDate(item.workingDate, date)) ? {backgroundColor: '#D5D5D5'} : {backgroundColor: '#ffffff'};

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
                            <SelectBox options={DEPARTOPTIONS} defaultValue={depart} onChange={handleAction}></SelectBox>
                            <SelectBox options={DATEOPTIONS} defaultValue={date} onChange={handleMonthChange}></SelectBox>
                        </ol>
                    </nav>
                </div>
                <div className="col-lg-12">
                    {/* <div className="card"> */}
                    {/* <div className="c" style={contentStyle}> */}
                    <table className="table table-hover" style={{ width: '100%', position: 'relative', overflow: 'auto' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 999 }}>
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
                            {commuteList && commuteList.map((member, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #D5D5D5' }}>{member.name}</td>
                                    {dates && dates.map(date => (
                                        <td key={date} style={{ border: '1px solid #D5D5D5' }} className={emptyCellClass}>
                                            {member.commuteList && member.commuteList.find(item => isSameDate(item.workingDate)) ? (
                                                <>
                                                    <span>{convertTime(member.commuteList.find(item => isSameDate(item.workingDate)).startWork)}</span>
                                                    {member.commuteList && member.commuteList.find(item => isSameDate(item.workingDate, date)).endWork && (
                                                        <span>{convertTime(member.commuteList.find(item => isSameDate(item.workingDate, date)).endWork)}</span>
                                                    )}
                                                </>
                                            ) : (
                                                ' '
                                            )}
                                        </td>
                                    ))}
                                    <td style={{ border: '1px solid #D5D5D5' }}>+++</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ border: '1px solid #D5D5D5' }}>
                                <td style={{ fontWeight: '800' }}>근무인원</td>
                                {dates.map(date => (
                                    <td key={date} style={{ border: '1px solid #D5D5D5' }}>
                                        {/* 여기에 각 날짜에 대한 일별 근무 시간을 표시하는 로직을 추가하면 됩니다 */}
                                    </td>
                                ))}
                                {/* <td style={{ border: '1px solid #D5D5D5' }}>합계</td> */}
                            </tr>
                        </tfoot>
                        {/* <tbody>
                            <CommuteCalendar
                                date={date}
                                year={year}
                                month={month}
                                commuteList={commuteList}
                                dates={dates}
                                tableStyle={tableStyle}
                                tableStyles={tableStyles}
                            />
                            <tr>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                                <th>
                                    <td>김정희</td>
                                </th>
                            </tr> 
                            
                        </tbody> */}
                    </table>
                </div>
            </main>
        </>
    );
};

export default CommuteManage;

import { useEffect, useState } from "react";
import styled from "styled-components";
import CommuteCalendar from "../../components/commutes/CommuteCalendar";
import { useDispatch, useSelector } from "react-redux";
import { callSelectCommuteListAPI } from "../../apis/CommuteAPICalls";
import { textAlign } from "@mui/system";

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
                    <div className="card">
                        <div className="content2" style={contentStyle}>
                            <table className="table table-hover" style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th>이름</th>
                                        <th style={{ padding: 0}}>
                                            {/* 월별 날짜와 요일 렌더링 */}
                                            {dates.map(date => (
                                                <th key={date} style={{ ...tableStyles.tableHeaderCell, ...(isWeekend(getDayOfWeek(year, month, date)) && tableStyles.weekendCell) }}>
                                                    {date}/{getDayOfWeek(year, month, date)}
                                                </th>
                                            ))}
                                        </th>
                                        <th style={tableStyles.tableHeaderCell}>합계</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <CommuteCalendar
                                        date={date}
                                        year={year}
                                        month={month}
                                        getDayOfWeek={getDayOfWeek}
                                        commuteList={commuteList}
                                        dates={dates}
                                        tableStyle={tableStyle}
                                        tableStyles={tableStyles}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CommuteManage;

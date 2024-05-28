import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import { useSelector, useDispatch } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/common.css'
import '../css/main.css'
import { calendarPopover, updateEvents } from '../utils/CalendarUtil';
import { callSelectCalendarAPI } from '../apis/CalendarAPICalls';
import AnnounceList from './announce/AnnouceList';
import ClockContainer from '../common/ClockContainer';
import Weather from '../common/Weather';
import ApprovalCounts from '../common/ApprovalCounts';
import ApproverCounts from '../common/ApproverCounts';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import MyLeaveCounts from '../common/MyLeaveCounts';
import { decodeJwt } from '../utils/tokenUtils';
import { callSelectNoticeListAPI } from '../apis/NoticeAPICalls';
import { callDepartmentDetailListAPI } from '../apis/DepartmentAPICalls';

function Main() {
    const token = window.localStorage.getItem('accessToken');
    const role = token ? decodeJwt(token).role : null;
    const { calendarList } = useSelector(state => state.calendarReducer)
    const [showApprovalCounts, setShowApprovalCounts] = useState(true);
    const [events, setEvents] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("전체");
    const [departments, setDepartments] = useState([]);
    const dispatch = useDispatch();

    const toggleComponent = () => {
        setShowApprovalCounts(!showApprovalCounts);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await callDepartmentDetailListAPI();
            Array.isArray(result)
                && setDepartments(result);
        };

        fetchData();
    }, [])

    useEffect(() => { dispatch(callSelectCalendarAPI(selectedDepartment)) }, [selectedDepartment]);

    useEffect(() => updateEvents(calendarList, setEvents), [calendarList]);

    return (
        <main id="main" className="main">
            <div className="main-first">
                <div className="main-card">
                    <ClockContainer />
                </div>
                <div className="main-card">
                    {/* { <Weather />   } */}
                    {/* API 횟수 제한이 있어서, 주석 해놓겠습니다 */}
                </div>
                <div className="main-card">
                    {role === 'ADMIN' && (
                        <button
                            className='slide-toggle-button'
                            onClick={toggleComponent}
                            style={{ background: 'none', border: 'none' }}
                        >
                            {showApprovalCounts ? (
                                <FaAngleRight style={{ color: '#3F72AF', marginTop: '-40px', marginRight: '-30px' }} />
                            ) : (
                                <FaAngleLeft style={{ color: '#ec76a2', marginTop: '-40px', marginRight: '-30px' }} />
                            )}
                        </button>
                    )}
                    {showApprovalCounts ? <ApprovalCounts /> : <ApproverCounts />}
                </div>

                <div className="main-card">
                    <MyLeaveCounts />
                </div>
            </div>
            <div className="calendarDepartment">
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="form-select">
                    <option value='전체'>전체</option>
                    {departments.map(dept => (
                        <option key={dept.departNo} value={dept.departName}>
                            {dept.departName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="main-second">
                <Fullcalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView={'dayGridWeek'} // dayGridWeek로 변경
                    headerToolbar={{
                        start: 'prev,today,next',
                        center: 'title',
                        end: ''
                    }}
                    events={events}
                    eventDidMount={info => calendarPopover(info)}
                    locale={koLocale}
                    height="250px"
                />
                <div className='annouce' style={{ marginTop: '50px' }}>
                    <AnnounceList maxVisibleAnnouncements={5} hidePagination={true} hidePlus={true} /> {/* hidePagination을 true로 설정하여 페이징 숨김 */}
                </div>
            </div>
        </main>
    );
}

export default Main;

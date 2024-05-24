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
import Profile from '../common/profile';
import ApprovalCounts from '../common/ApprovalCounts';
import ApproverCounts from '../common/ApproverCounts';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import MyLeaveCounts from '../common/MyLeaveCounts';


function Main() {
    const { calendarList } = useSelector(state => state.calendarReducer)
    const [showApprovalCounts, setShowApprovalCounts] = useState(true);
    const [events, setEvents] = useState([]);
    const dispatch = useDispatch();

    const toggleComponent = () => {
        setShowApprovalCounts(!showApprovalCounts);
    };

    // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
    useEffect(() => { dispatch(callSelectCalendarAPI("개발팀")) }, []);

    useEffect(() => updateEvents(calendarList, setEvents), [calendarList]);

    return (
        <main id="main" className="main">
            <div className="main-first">
                <div className="main-card">
                    <ClockContainer />
                </div>
                <div className="main-card">
                     {/* <Weather />   */}
                    {/* API 횟수 제한이 있어서, 주석 해놓겠습니다 */}
                </div>
                <div className="main-card">
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <button className='slide-toggle-button' onClick={toggleComponent} style={{ background: 'none', border: 'none' }}>
                            {showApprovalCounts ? <FaAngleRight style={{ color: '#ec76a2', marginTop: '-40px', marginRight: '-30px' }}/> : <FaAngleLeft style={{ color: '#ec76a2', marginTop: '-40px', marginRight: '-30px' }}/>}
                        </button>
                    </div>
                    {showApprovalCounts ? <ApprovalCounts /> : <ApproverCounts />}
                </div>

                <div className="main-card">
                    <MyLeaveCounts />
                </div>
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
                    height="300px"
                />
                <div className='annouce' style={{ marginTop: '50px' }}>
                    <AnnounceList maxVisibleAnnouncements={5} hidePagination={true} hidePlus={true} /> {/* hidePagination을 true로 설정하여 페이징 숨김 */}
                </div>
            </div>
        </main>
    );
}

export default Main;

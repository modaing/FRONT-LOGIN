import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import { useSelector, useDispatch } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/common.css'
import { calendarPopover, updateEvents } from '../utils/CalendarUtill';
import { callSelectCalendarAPI } from '../apis/CalendarAPICalls';
 // TODO: 임시 로그아웃, 삭제예정
import { callLogoutAPI, callGetProfilePictureAPI } from '../apis/MemberAPICalls';


function Main() {
    const { calendarList } = useSelector(state => state.calendarReducer)
    const [events, setEvents] = useState([]);
    const dispatch = useDispatch();

    // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
    useEffect(() => { dispatch(callSelectCalendarAPI("개발팀")) }, []);

    useEffect(() => updateEvents(calendarList, setEvents), [calendarList]);

    const onClickLogoutHandler = () => {
        dispatch(callLogoutAPI())
            .then(() => {
                window.localStorage.removeItem("accessToken");
                console.log('구성원 로그아웃');
                alert('로그아웃 합니다');
            })
            .catch(error => {
                console.error("Error during logout:", error);
            });
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Main</h1>
            </div>
            <Fullcalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={'dayGridWeek'} // dayGridWeek로 변경
                customButtons={{  // TODO: 임시 로그아웃, 삭제예정
                    addButton: {
                        text: "로그아웃",
                        click: onClickLogoutHandler
                    }
                }}
                headerToolbar={{
                    start: 'prev,today,next',
                    center: 'title',
                    end: 'addButton' // TODO: 임시 로그아웃, 삭제예정
                }}
                events={events}
                eventDidMount={info => calendarPopover(info)}
                locale={koLocale} 
                height="300px"
            />
        </main>
    );
}

export default Main;

import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import './Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from './Modal';
import { callInsertCalendarAPI, callSelectCalendarAPI } from '../../apis/CalendarAPICalls';
import { useSelector, useDispatch } from 'react-redux';
import '../../css/common.css'


function Calendar() {

    const { calendarList, insertMessage } = useSelector(state => state.calendarReducer)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const dispatch = useDispatch();


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = ({ title, start, end, color }) => {
        const requestData = {
            calendarStart: start,
            calendarEnd: end,
            calendarName: title,
            color,
            department: "개발팀", // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
            registrantId: 200401023 // TODO: 나중에 관리자 사번 뽑아서 넣는 걸로 바꿔야 함
        };
        dispatch(callInsertCalendarAPI(requestData));

    };


    useEffect(() => {
        const department = "개발팀"; // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
        dispatch(callSelectCalendarAPI(department));

    }, []);

    useEffect(() => {
        const department = "개발팀"; // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
        dispatch(callSelectCalendarAPI(department));

    }, [insertMessage]);

    useEffect(() => {
        if (calendarList) {
            const newEvents = calendarList.map(calendar => {
                // Javascript date 타입의 month 가 0~11 db에 저장된 월에서 1을 빼줘야 정상적으로 표현됨
                calendar.calendarStart[1] = calendar.calendarStart[1] - 1;
                calendar.calendarEnd[1] = calendar.calendarEnd[1] - 1;

                // 배경이 노랑이면 흰색글씨가 안보여서 노랑일 때 글씨색 변경
                let textColor = 'white';
                if (calendar.color === 'yellow') {
                    textColor = 'black'; // 
                }

                return {
                    calendarNo: calendar.calendarNo,
                    title: calendar.calendarName,
                    start: calendar.calendarStart,
                    end: calendar.calendarEnd,
                    color: calendar.color,
                    textColor: textColor
                }
            });
            setEvents(newEvents);
        }
    }, [calendarList]);


    return <>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>캘린더</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">캘린더</li>
                    </ol>
                </nav>
            </div>
            <Fullcalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                customButtons={{
                    AddButton: {
                        text: "일정 등록",
                        click: handleOpenModal
                    }
                }}
                headerToolbar={{
                    start: 'prev,next today AddButton',             // 툴바 좌측
                    center: 'title',                                // 툴바 중앙
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'    // 툴바 우측
                }}

                events={events}

                locale={koLocale}
            />
        </main>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveChanges} />
    </>

}

export default Calendar
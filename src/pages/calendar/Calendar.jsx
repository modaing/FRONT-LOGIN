import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import './Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from './Modal';
import { callDeleteCalendarAPI, callInsertCalendarAPI, callSelectCalendarAPI, callUpdateCalendarAPI } from '../../apis/CalendarAPICalls';
import { useSelector, useDispatch } from 'react-redux';
import '../../css/common.css'
import UpdateModal from './UpdateModal';
import { Popover } from 'bootstrap';


function Calendar() {

    const { calendarList, insertMessage, updateMessage, deleteMessage } = useSelector(state => state.calendarReducer)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState();
    const dispatch = useDispatch();


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent();
    };

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
        handleOpenModal();
    };

    const handleSaveChanges = ({ title, start, end, color, detail }) => {
        const requestData = {
            calendarStart: start,
            calendarEnd: end,
            calendarName: title,
            color,
            department: "개발팀", // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
            detail,
            registrantId: 200401023 // TODO: 나중에 관리자 사번 뽑아서 넣는 걸로 바꿔야 함
        };
        dispatch(callInsertCalendarAPI(requestData));

    };

    const handleUpdateChanges = ({ id, title, start, end, color, detail }) => {
        const requestData = {
            calendarNo: id,
            calendarStart: start,
            calendarEnd: end,
            calendarName: title,
            color,
            detail
        };
        dispatch(callUpdateCalendarAPI(requestData));
      
    };

    const handleDeleteChanges = (id) => {
        dispatch(callDeleteCalendarAPI(id));
    }


    useEffect(() => {
        const department = "개발팀"; // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
        dispatch(callSelectCalendarAPI(department));

    }, []);

    useEffect(() => {
        const department = "개발팀"; // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
        dispatch(callSelectCalendarAPI(department));

    }, [insertMessage, updateMessage, deleteMessage]);

    useEffect(() => {
        if (calendarList) {
            const newEvents = calendarList.map(calendar => {
                // Javascript date 타입의 month 가 0~11 db에 저장된 월에서 1을 빼줘야 정상적으로 표현됨
                calendar.calendarStart[1] = calendar.calendarStart[1] - 1;
                calendar.calendarEnd[1] = calendar.calendarEnd[1] - 1;

                // 배경이 노랑이면 흰색글씨가 안보여서 노랑일 때 글씨색 변경
                let textColor = 'white';
                if (calendar.color === 'yellow') {
                    textColor = 'black';  
                }

                return {
                    id: calendar.calendarNo,
                    title: calendar.calendarName,
                    start: calendar.calendarStart,
                    end: calendar.calendarEnd,
                    color: calendar.color,
                    textColor: textColor,
                    extendedProps: {
                        detail: calendar.detail
                    }
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
                    start: 'prev,today,next AddButton',             // 툴바 좌측
                    center: 'title',                                // 툴바 중앙
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'    // 툴바 우측
                }}

                events={events}
                eventDidMount={(info) => {
                    let content = `<p>시작일시: ${info.event.start.toLocaleString()}</p>`;
                    if (info.event.end) {
                        content += `<p>종료일시: ${info.event.end.toLocaleString()}</p>`;
                    } else {
                        content += '<p>종료일: 당일'
                    }
                    if (info.event.extendedProps.detail) {
                        content += `<p>일정상세: ${info.event.extendedProps.detail}</p>`
                    } else {
                        content += `<p>일정상세: 없음</p>`
                    }
                    return new Popover(info.el, {
                        title: info.event.title,
                        placement: "auto",
                        trigger: "hover",
                        customClass: "popoverStyle",
                        content: content,
                        html: true,
                    });
                }}
                eventClick={handleEventClick}
                locale={koLocale}
            />
        </main>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveChanges} />
        {selectedEvent && <UpdateModal isOpen={isModalOpen} onClose={handleCloseModal} onUpdate={handleUpdateChanges} onDelete={handleDeleteChanges} event={selectedEvent} />}
    </>

}

export default Calendar
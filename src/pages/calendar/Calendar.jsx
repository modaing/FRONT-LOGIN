import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import './Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from './Modal';
import { callInsertCalendarAPI } from '../../apis/CalendarAPICalls';



function Calendar() {

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = ({ title, start, end, color }) => {
        const requestData = {
            calendarStart : start,
            calendarEnd : end,
            calendarName : title,
            color,
            department : "개발팀", // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
            registrantId : 200401023 // TODO: 나중에 관리자 사번 뽑아서 넣는 걸로 바꿔야 함
        };
        console.log('[requestData]: ', requestData)
        callInsertCalendarAPI(requestData)

    };


    useEffect(() => {
        const handleEventDidMount = (info) => {
            // 이벤트가 마운트될 때 실행되는 코드를 작성합니다.
        };

        // 컴포넌트가 마운트될 때 FullCalendar의 eventDidMount 이벤트에 이벤트 핸들러를 등록합니다.
        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 핸들러를 해제합니다.
        };
    }, []);

    const events = [
        {
            title: 'test1',
            start: '2024-05-01T08:00:00',
            end: '2024-05-02T09:00:00',
            color: 'red'
        },
        {
            title: 'test2',
            start: '2024-05-01T08:00:00',
            end: '2024-05-02T09:00:00',
            color: 'blue'
        },
        {
            title: 'test3',
            start: '2024-05-03T07:30:00',
            end: '2024-05-04T09:00:00',
            color: 'green'
        }
    ];


    return <>
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
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
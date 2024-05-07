import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import './Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from './Modal';



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
        console.log('일정 추가:', { title, start, end, color });
        // 여기에 추가한 일정을 처리하는 로직을 추가할 수 있습니다.
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
            title: 'test', 
            start: '2024-05-01T08:00:00', 
            end: '2024-05-02T09:00:00'
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
                    AddButton:{
                        text:"일정 등록",
                        onClick: handleOpenModal
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
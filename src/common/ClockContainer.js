import React, { useState, useEffect } from 'react';
import '../css/ClockContainer.css';

function ClockContainer() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    // 시, 분, 초에 따라 회전 각도를 계산하는 함수
    const calculateRotation = (unit, max) => {
        return ((unit % max) / max) * 360;
    };

    // 현재 시각에서 시침, 분침, 초침의 회전 각도 계산
    const hourRotation = calculateRotation((time.getHours() % 12) * 30 + time.getMinutes() / 2, 360);
    const minuteRotation = calculateRotation(time.getMinutes() * 6 + time.getSeconds() / 10, 360);
    const secondRotation = calculateRotation(time.getSeconds() * 6, 360);

    function formatTimeString() {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        let formattedHours = hours % 12 || 12; // 12시간제로 변경
        const amPm = hours < 12 ? '오전' : '오후'; // 오전/오후 구분

        return `${amPm} ${formattedHours}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
    }

    function addLeadingZero(number) {
        return number < 10 ? `0${number}` : number;
    }

    return (
        <div className="clock-container">
            <div className="circle"></div>
            <div className="hour-hand" style={{ transform: `rotate(${hourRotation}deg)` }} />
            <div className="minute-hand" style={{ transform: `rotate(${minuteRotation}deg)` }} />
            <div className="second-hand" style={{ transform: `rotate(${secondRotation}deg)` }} />
            <div className="marker top"></div>
            <div className="marker right"></div>
            <div className="marker bottom"></div>
            <div className="marker left"></div>
            <div className='clock-text-container'>
                <div className="clock-text">
                    {time.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="clock-text">
                    {formatTimeString()}
                </div>
            </div>
        </div>
    );
}

export default ClockContainer;

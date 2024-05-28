import { useMemo, useState } from 'react';
import '../../css/commute/commute.css';
import { margin } from '@mui/system';

function CommuteTime({ commute, date, handlePreviousClick, handleNextClick }) {

    const weekData = useMemo(() => {
        const weeks = [];
        let currentWeek = [];
        let currentDate = null;

        commute.forEach((item) => {
            const itemDate = new Date(item.workingDate);
            const itemWeek = getWeekNumber(itemDate);

            if (currentDate === null || itemWeek !== currentWeek) {
                if (currentWeek.length > 0) {
                    weeks.push(currentWeek);
                }
                currentWeek = [];
                currentDate = itemDate;
            }
            currentWeek.push(item);
        });

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    }, [commute]);

    const [currentWeek, setCurrentWeek] = useState(0);
    const currentWeekData = weekData[currentWeek] || [];

    /* 주 단위로 이동하는 버튼 */
    const Button = ({ children, onClick }) => {
        return (
            <button 
            onClick={onClick} 
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#000000',
                paddingLeft: '10px',
                paddingRight: '10px',
                ':hover': {
                    backgroundColor: '#d5d5d5',
                },
            }}>
                {children}
            </button>
        );
    };

    /* 주 번호 계산 */
    function getWeekNumber(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayOfWeek = firstDayOfMonth.getDay() || 7;
        const daysElapsed = date.getDate() + firstDayOfWeek - 1;
        const weekNumber = Math.ceil(daysElapsed / 7);

        return weekNumber;
    };

    /* 주 번호의 날짜 범위 계산 */
    function getWeekRange(date) {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay() || 7;    // 일요일을 7로 처리
        const mondayDate = new Date(currentDate.getTime() - (dayOfWeek - 1) * 24 * 60 * 60 * 1000);
        const sundayDate = new Date(mondayDate.getTime() + 6 * 24 * 60 * 60 * 1000);

        const monthStart = new Date(mondayDate);    // 이번주 월요일
        const monthEnd = new Date(sundayDate);      // 이번주 일요일

        const monthStartStr = `${monthStart.getMonth() + 1}월 ${monthStart.getDate()}일`;   // 이번주 월요일 문자열로 변환
        const monthEndStr = `${monthEnd.getMonth() + 1}월 ${monthEnd.getDate()}일`;         // 이번주 일요일 문자열로 변환

        return `${monthStartStr} ~ ${monthEndStr}`;
    };

    /* 총 근무 시간 형식 변경 */
    const formatTotalWorkingHours = (totalWorkingHours) => {

        if (totalWorkingHours === 0) {
            return '0 시간';
        };

        const hours = Math.floor(totalWorkingHours / 60);
        const minutes = totalWorkingHours % 60;

        if (minutes == 0) {
            return `${hours}시간`;
        } else {
            return `${hours}시간 ${minutes}분`;
        };
    };

    /* 실제 근로 시간 계산 */
    const totalWorkingHours = commute.reduce((acc, item) => acc + item.totalWorkingHours, 0);
    const formattedTotalWorkingHours = formatTotalWorkingHours(totalWorkingHours);

    /* 잔여 근로시간 계산 */
    const maxWorkingHours = 3120;   // 52시간 = 3120분
    const remainingWorkingHours = maxWorkingHours - totalWorkingHours;
    const formattedRemainingWorkingHours = formatTotalWorkingHours(remainingWorkingHours);

    /* 한 주 전으로 이동 */
    const handlePreviousWeekClick = () => {
        setCurrentWeek(Math.max(currentWeek - 1, 0));
        handlePreviousClick(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7));
    };

    /* 한 주 후로 이동 */
    const handleNextWeekClick = () => {
        setCurrentWeek(Math.min(currentWeek + 1, weekData.length - 1));
        handleNextClick(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7));
    };

    const ProgressBar = ({ progress, style }) => {
        return (
            <div className="progress" style={style}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        );
    };

    const progressPercentage = totalWorkingHours === 0 ? 0 : (totalWorkingHours / 3120) * 100;

    return (
        <div>
            <div className="col=lg-12">
                <div className="card">
                    <div className="content1" style={content1}>
                        <Button onClick={handlePreviousWeekClick}>&lt;</Button>
                        <span style={dateWeek}>{`${date.getMonth() + 1}월 ${getWeekNumber(date)}째주`}</span>
                        <Button onClick={handleNextWeekClick}>&gt;</Button>
                        <h6>{getWeekRange(date)}</h6>
                        <ProgressBar progress={progressPercentage} style={{ width: '40%', margin: '20px auto' }} />
                        <h6 style={{ padding: '5px' }}>최대 근로시간 <span className="black" style={black}>52시간</span></h6>
                        <h6 style={{ padding: '5px' }}>실제 근로시간 <span className="blue" style={blue}>{formattedTotalWorkingHours}</span></h6>
                        <h6 style={{ padding: '5px' }}>잔여 근로시간 <span className="red" style={red}>{formattedRemainingWorkingHours}</span></h6>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommuteTime;

const content1 = {
    marginLeft: '25px',
    textAlign: 'center',
    margin: '20px'

};

const red = {
    color: '#AF3131',
    fontWeight: 900,
};

const blue = {
    color: '#3F72AF',
    fontWeight: 900,
};

const black = {
    color: '#00000',
    fontWeight: 900,
};

const dateWeek = {
    color: '#00000',
    fontWeight: 800,
    fontSize: '20px',
    margin: '20px'
};

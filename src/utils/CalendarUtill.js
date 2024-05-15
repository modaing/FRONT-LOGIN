import { Popover } from 'bootstrap';

export const convertToUtc = (date) => {

    // 클라이언트에서 전달된 날짜를 로컬 시간으로 생성
    const localDate = new Date(date);

    // 로컬 시간의 오프셋을 빼서 UTC 시간으로 변환
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    
    // UTC 시간을 ISO 문자열로 변환하여 반환
    return utcDate.toISOString();
}

export const updateEvents = (calendarList, setEvents) => {
    if (calendarList) {
        const newEvents = calendarList.map(calendar => {
            // Javascript date 타입의 month 가 0~11 db에 저장된 월에서 1을 빼줘야 정상적으로 표현됨
            const start = [...calendar.calendarStart];
            const end = [...calendar.calendarEnd];
            start[1] -= 1;
            end[1] -= 1;

            // 배경이 노랑이면 흰색글씨가 안보여서 노랑일 때 글씨색 변경
            let textColor = 'white';
            if (calendar.color === 'yellow') {
                textColor = 'black';
            }

            return {
                id: calendar.calendarNo,
                title: calendar.calendarName,
                start,
                end,
                color: calendar.color,
                textColor,
                extendedProps: {
                    color: calendar.color,
                    detail: calendar.detail
                }
            }
        });
        setEvents(newEvents);
    }
};

export function mapJSONToEvent(calendarList) {
    calendarList.map(calendar => {
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
                color: calendar.color,
                detail: calendar.detail
            }
        }
    });
}

export function calendarPopover(info) {
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
}
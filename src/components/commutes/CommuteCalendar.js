import CommuteMonth from "./CommuteMonth";

function CommuteCalendar({ date, year, month, commuteList, dates, tableStyle, tableStyles, getDayOfWeek }) {

    console.log('commuteList : ', commuteList);

    return (
        <tr>
            {commuteList && commuteList.length > 0 ? (
                commuteList.map((item, index) => (
                    <CommuteMonth
                        key={item.index}
                        date={date}
                        year={year}
                        month={month}
                        getDayOfWeek={getDayOfWeek}
                        commuteList={item}
                        tableStyle={tableStyle}
                        tableStyles={tableStyles}
                    />
                ))
            ) : (
                <tr>
                    <td colSpan={7}>출퇴근 내역이 없습니다.</td>
                </tr>
            )}
        </tr>
    );
};

export default CommuteCalendar;
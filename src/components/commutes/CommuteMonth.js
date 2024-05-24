import CommuteRow from "./CommuteRow";

function CommuteMonth({ date, year, month, commuteList, dates, tableStyle, tableStyles, getDayOfWeek }) {

    console.log('commuteList : ', commuteList);

    return (
        <tr>
            <CommuteRow
                date={date}
                year={year}
                month={month}
                getDayOfWeek={getDayOfWeek}
                name={commuteList.name}
                commute={commuteList.commuteList}
                dates={dates}
                tableStyle={tableStyle}
                tableStyles={tableStyles}
            />
        </tr>
    );
};

export default CommuteMonth;
import CommuteDay from "./CommuteDay";

function CommuteRow({ date, year, month, name, commute, dates, tableStyle, tableStyles, getDayOfWeek }) {

    console.log('name : ', name);
    console.log('commute : ', commute);

    return (
        <>
            <tr>
                <td>{name}</td>
                {commute && commute.length > 0 ? (
                    commute.map((item, index) => (
                        <CommuteDay
                            date={date}
                            year={year}
                            month={month}
                            getDayOfWeek={getDayOfWeek}
                            name={name}
                            commute={commute}
                            dates={dates}
                            tableStyle={tableStyle}
                            tableStyles={tableStyles}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan={7}>날짜입니다~~</td>
                    </tr>
                )}

                {/* {dates.map((date) => (
                    <td key={date}>
                        {commute.find(item => item.date === date)?.workingDate || '-'}
                    </td>
                ))} */}
            </tr>
        </>
    );
};

export default CommuteRow;
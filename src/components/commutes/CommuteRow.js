import CommuteDay from "./CommuteDay";

function CommuteRow({ date, year, month, name, commute, dates, tableStyle, tableStyles }) {

    console.log('name : ', name);
    console.log('commute : ', commute);

    return (
        <>
            <tr>
                <td scope='row'>{name}</td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay
                            key={day}
                            date={date}
                            year={year}
                            month={month}
                            name={name}
                            commute={commute.filter(co => co.workingDate === day)}
                            dates={dates}
                            tableStyle={tableStyle}
                            tableStyles={tableStyles}
                        />
                    ))}
                </td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay key={day} date={date} year={year} month={month} name={name} commute={commute.filter(co => co.workingDate === day)} dates={dates} tableStyle={tableStyle} tableStyles={tableStyles} />
                    ))}
                </td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay key={day} date={date} year={year} month={month} name={name} commute={commute.filter(co => co.workingDate === day)} dates={dates} tableStyle={tableStyle} tableStyles={tableStyles} />
                    ))}
                </td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay key={day} date={date} year={year} month={month} name={name} commute={commute.filter(co => co.workingDate === day)} dates={dates} tableStyle={tableStyle} tableStyles={tableStyles} />
                    ))}
                </td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay key={day} date={date} year={year} month={month} name={name} commute={commute.filter(co => co.workingDate === day)} dates={dates} tableStyle={tableStyle} tableStyles={tableStyles} />
                    ))}
                </td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay key={day} date={date} year={year} month={month} name={name} commute={commute.filter(co => co.workingDate === day)} dates={dates} tableStyle={tableStyle} tableStyles={tableStyles} />
                    ))}
                </td>
                <td >
                    {dates && dates.map((day) => (
                        <CommuteDay key={day} date={date} year={year} month={month} name={name} commute={commute.filter(co => co.workingDate === day)} dates={dates} tableStyle={tableStyle} tableStyles={tableStyles} />
                    ))}
                </td>
                
            </tr>
        </>
    );
};

export default CommuteRow;
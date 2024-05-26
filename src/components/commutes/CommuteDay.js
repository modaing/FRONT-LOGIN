function CommuteDay({ date, year, month, name, commute, dates, tableStyle, tableStyles }) {

    /* 출근시간, 퇴근시간 형식 변경 */
    const formatWorkingTime = (workingTime) => {
        if (Array.isArray(workingTime)) {

            let result = '';

            for (let i = 0; i < workingTime.length; i++) {
                const minutes = workingTime[i] % 100;
                result += `${String(minutes).padStart(2, '0')}`;

                if (i < workingTime.length - 1) {
                    result += ':';
                }
            }
            return result;
        }
        return '';
    };

    return (
        <td scope='row'>
            {commute && commute ? (
                <>
                    <span>{formatWorkingTime(commute.startWork)}</span>
                    {/* <span>{formatWorkingTime(commute.endWork)}</span> */}
                </>
            ) : (
                ''
            )}
        </td>
    );
};

export default CommuteDay;
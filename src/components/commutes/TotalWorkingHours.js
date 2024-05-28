const TotalWorkingHours = ({ commuteList, year, month, dates, isSameDate, tableStyles, isWeekend, getDayOfWeek, emptyCellClass }) => {
    return (
        <>
            <div className="col-lg-12">
                <table className="table table-hover" style={{ textAlign: 'center', justifyContent: 'center', width: '100%', position: 'relative', overflow: 'auto', wordWrap: 'break-word', webkitLineClamp: 1, textOverflow: 'ellipsis' }}>
                    <thead >
                        <tr>
                            <th rowSpan={2} scope='col' style={{ whiteSpace: 'nowrap', textAlign: 'center', width: '40px', border: '1px solid #D5D5D5', verticalAlign: 'middle' }}>이름</th>
                            {dates.map(date => (
                                <th
                                    key={date}
                                    style={{ ...tableStyles.tableHeaderCell, ...(isWeekend(getDayOfWeek(year, month, date)) && tableStyles.weekendCell), border: '1px solid #D5D5D5' }}
                                >
                                    {date}/{getDayOfWeek(year, month, date)}
                                </th>
                            ))}
                            <th colSpan={3} rowSpan={3} style={{ border: '1px solid #D5D5D5', whiteSpace: 'nowrap' }}>개별근무시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commuteList && commuteList.map((member, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #D5D5D5' }}>{member.name}</td>
                                {dates && dates.map(date => (
                                    <td
                                        key={`${index}-${date}`}
                                        style={{
                                            border: '1px solid #D5D5D5',
                                            textAlign: 'center',
                                            padding: '7px',
                                            backgroundColor: member.commuteList && member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).length > 0 ? '#112D4E' : '#F6F5F5',
                                            color: member.commuteList && member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).length > 0 ? '#ffffff' : '#000000'
                                        }}
                                        className={emptyCellClass}
                                    >
                                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{member.commuteList && member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).reduce((total, item) => total + item.totalWorkingHours, 0) > 0
                                            ? (
                                                <div>
                                                    <span>{Math.floor(member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).reduce((total, item) => total + item.totalWorkingHours, 0) / 60)}시간</span><br/>
                                                    <span>{member.commuteList.filter(item => isSameDate(item.workingDate, [year, month, date])).reduce((total, item) => total + item.totalWorkingHours, 0) % 60}분</span>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                    </td>
                                ))}
                                <td style={{ border: '1px solid #D5D5D5', width: '60px' }}>
                                    {member.commuteList && member.commuteList.reduce((total, item) => total + item.totalWorkingHours, 0) > 0
                                        ? `${Math.floor(member.commuteList.reduce((total, item) => total + item.totalWorkingHours, 0) / 60)}시간 ${member.commuteList.reduce((total, item) => total + item.totalWorkingHours, 0) % 60}분`
                                        : ''
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TotalWorkingHours;

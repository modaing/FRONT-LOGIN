import { useEffect, useRef, useState } from "react";
import CommuteItem from "./CommuteItem";

function CommuteListByMember({ commute, date }) {

    console.log('[CommuteListByMember] commute : ', commute);
    console.log('[CommuteListByMember] date : ', date);

    const content2 = {
        marginLeft: '25px'

    };

    const tableStyle = {
        width: '97%',
        borderCollapse: 'collapse',
        textAlign: 'center',
    };

    const tableStyles = {
        tableHeaderCell: {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '15px'
        },
        tableCell1: {
            width: '15%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell2: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell3: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell4: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell5: {
            width: '22%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell6: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell7: {
            width: '15%',
            textAlign: 'center',
            padding: '10px',
        },
        evenRow: {
            backgroundColor: '#f9f9f9'
        }
    };

    const formatWorkingDate = (workingDate) => {
        const dateObj = new Date(workingDate);
        return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    };

    const generateDates = () => {
        const dates = [];
        const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (date.getDay() ? date.getDay() - 1 : 6));  // 이번 주 월요일
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);                           // 이번 주 일요일

        console.log('시작 날짜 : ', startDate);
        console.log('종료 날짜 : ', endDate);

        while (startDate <= endDate) {
            const formattedDate = formatWorkingDate(startDate);
            dates.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1);
        }

        return dates;
    };

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="content2" style={content2}>
                    <table className="table table-hover" style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={tableStyles.tableHeaderCell} scope="col">근무일자</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">총 근무 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">출근 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">퇴근 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">근무 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">근무 상태</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">정정 요청</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commute && commute.length > 0 ? (
                                commute.map((item, index) => (
                                    <CommuteItem key={item.commuteNo} commute={item} tableStyles={tableStyles} evenRow={index % 2 === 0} date={date} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>출퇴근 내역이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                        <tbody>
                            {generateDates().map((dateItem, index) => {
                                const matchingCommute = commute.find(
                                    (item) => formatWorkingDate(item.workingDate) === dateItem
                                );
                                return (
                                    <CommuteItem
                                        key={`${dateItem}-${index}`}
                                        commute={matchingCommute || { workingDate: dateItem }}
                                        tableStyles={tableStyles}
                                        evenRow={index % 2 === 0}
                                        date={date}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CommuteListByMember;
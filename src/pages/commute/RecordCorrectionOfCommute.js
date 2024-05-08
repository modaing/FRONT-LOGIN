import './commute.css';
import styled from "styled-components";

function RecordCorrectionOfCommute() {

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const Select = styled.select`
        margin-left: 20px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100px;
        height: 45px;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        border-color: #D5D5D5;
        padding: '1% 1.5%',
        cursor: 'pointer',
        margin-left: '750px',
    `;

    const contentStyle = {
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
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell2: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell3: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell4: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell5: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        evenRow: {
            backgroundColor: '#f9f9f9'
        }
    };

    const OPTIONS = [
        { value: "2024-03", name: "2024-03" },
        { value: "2024-04", name: "2024-04" },
        { value: "2024-05", name: "2024-05" }
    ];

    const SelectBox = (props) => {
        return (
            <Select>
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        defaultValue={props.defaultValue === option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        );
    };



    return (
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
                <h1>출퇴근</h1>
                <h5>출퇴근 정정 내역</h5>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 정정 기록</li>
                        <SelectBox options={OPTIONS} defaultValue="2024-05"></SelectBox>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="content2" style={contentStyle}>
                        <table className="table table-hover" style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 대상 일자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 요청 출근 시간</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 요청 퇴근 시간</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 등록 일자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-01</td>
                                    <td style={tableStyles.tableCell2}>09:00</td>
                                    <td style={tableStyles.tableCell3}>18:00</td>
                                    <td style={tableStyles.tableCell4}>2024-04-01</td>
                                    <td style={tableStyles.tableCell5}>승인</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-01</td>
                                    <td style={tableStyles.tableCell2}>09:00</td>
                                    <td style={tableStyles.tableCell3}>18:00</td>
                                    <td style={tableStyles.tableCell4}>2024-04-01</td>
                                    <td style={tableStyles.tableCell5}>반려</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-01</td>
                                    <td style={tableStyles.tableCell2}>09:00</td>
                                    <td style={tableStyles.tableCell3}>18:00</td>
                                    <td style={tableStyles.tableCell4}>2024-04-01</td>
                                    <td style={tableStyles.tableCell5}>대기</td>
                                </tr>
                            </tbody>
                            {/* 페이징 처리 */}
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RecordCorrectionOfCommute;
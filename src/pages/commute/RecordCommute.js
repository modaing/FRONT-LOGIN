import { Link } from "react-router-dom";
import styled from "styled-components";
import React, { Children } from 'react';
import './commute.css';

function RecordCommute() {

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const insertButton = {
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '5px',
        padding: '1% 1.5%', // 패딩을 %로 조정
        cursor: 'pointer',
        marginLeft: '60%', // 왼쪽 여백을 %로 조정
        height: '45px',
        textDecoration: 'none'
    };

    const Select = styled.select`
        margin-left: 20px;
        webkit-appearance: none;
        moz-appearance: none;
	    appearance: none;
        width: 100px;
        height: 45px;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        border-color: #D5D5D5;
    `;

    const contentStyle1 = {
        marginLeft: '25px',
        textAlign: 'center',
        margin: '20px'

    };

    const contentStyle2 = {
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

    const red = {
        color: '#AF3131',
        fontWeight: 900
    };

    const blue = {
        color: '#3F72AF',
        fontWeight: 900

    };

    const black = {
        color: '#00000',
        fontWeight: 900
    };

    const date = {
        color: '#00000',
        fontWeight: 800,
        fontSize: '20px',
        margin: '20px'
    };

    const Button = ({ children, onClick }) => {
        return (
            <button onClick={onClick} style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                fontWeight: 900
            }}>
                {children}
            </button>
        );
    };

    const insertCorrection = {
        backgroundColor: '#3F72AF',
        cursor: 'pointer',
        color: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #3F72AF',
        '&:hover': {
            cursor: '#112D4E',
        }
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

    const handlePreviousClick = () => {
        // 한주 전으로 이동하는 로직
    };

    const handleNextClick = () => {
        // 한주 후로 이동하는 로직
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
                <h5>나의 출퇴근 내역</h5>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 기록</li>
                        <Link to="/" className="notice-insert-button" style={insertButton}>출근하기</Link>
                        <SelectBox options={OPTIONS} defaultValue="2024-05"></SelectBox>
                    </ol>
                </nav>
            </div>
            <div className="col=lg-12">
                <div className="card">
                    <div className="content1" style={contentStyle1}>
                        <Button onClick={handlePreviousClick}>&lt;</Button>
                        <span style={date}>4월 1째주</span>
                        <Button onClick={handleNextClick}>&gt;</Button>
                        <h6>4월 1일 ~ 4월 7일</h6>
                        <ProgressBar progress={70} style={{ width: '40%', margin: '20px auto' }} />
                        <h6>최대 근로시간 <span style={black}>52시간</span></h6>
                        <h6>실제 근로시간 <span style={blue}>36시간</span></h6>
                        <h6>잔여 근로시간 <span style={red}>16시간</span></h6>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="content2" style={contentStyle2}>
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
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-01</td>
                                    <td style={tableStyles.tableCell2}>8시간</td>
                                    <td style={tableStyles.tableCell3}>09:00</td>
                                    <td style={tableStyles.tableCell4}>18:00</td>
                                    <td style={tableStyles.tableCell5}><ProgressBar progress={100} /></td>
                                    <td style={tableStyles.tableCell6}>퇴근</td>
                                    <td style={tableStyles.tableCell7}><button to="/" style={insertCorrection}>정정</button></td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-02</td>
                                    <td style={tableStyles.tableCell2}>8시간</td>
                                    <td style={tableStyles.tableCell3}>09:00</td>
                                    <td style={tableStyles.tableCell4}>18:00</td>
                                    <td style={tableStyles.tableCell5}><ProgressBar progress={100} /></td>
                                    <td style={tableStyles.tableCell6}>퇴근</td>
                                    <td style={tableStyles.tableCell7}><button to="/" style={insertCorrection}>정정</button></td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-03</td>
                                    <td style={tableStyles.tableCell2}>8시간</td>
                                    <td style={tableStyles.tableCell3}>09:00</td>
                                    <td style={tableStyles.tableCell4}>18:00</td>
                                    <td style={tableStyles.tableCell5}><ProgressBar progress={100} /></td>
                                    <td style={tableStyles.tableCell6}>퇴근</td>
                                    <td style={tableStyles.tableCell7}><button to="/" style={insertCorrection}>정정</button></td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-04</td>
                                    <td style={tableStyles.tableCell2}>8시간</td>
                                    <td style={tableStyles.tableCell3}>09:00</td>
                                    <td style={tableStyles.tableCell4}>18:00</td>
                                    <td style={tableStyles.tableCell5}><ProgressBar progress={100} /></td>
                                    <td style={tableStyles.tableCell6}>퇴근</td>
                                    <td style={tableStyles.tableCell7}><button to="/" style={insertCorrection}>정정</button></td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2024-04-05</td>
                                    <td style={tableStyles.tableCell2}></td>
                                    <td style={tableStyles.tableCell3}>09:00</td>
                                    <td style={tableStyles.tableCell4}></td>
                                    <td style={tableStyles.tableCell5}><ProgressBar progress={60} /></td>
                                    <td style={tableStyles.tableCell6}>근무중</td>
                                    <td style={tableStyles.tableCell7}><button to="/" style={insertCorrection}>정정</button></td>
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

export default RecordCommute;
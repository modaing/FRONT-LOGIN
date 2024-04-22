import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

    function Announces() {

        const [editorLoaded, setEditorLoaded] = useState(false);

        const pageTitleStyle = {
            marginBottom: '20px',
            marginTop: '20px'
        };

        const cardTitleStyle = {
            marginLeft: '30px'
        };

        
        const contentStyle = {
            marginLeft: '50px'
        };

        const insertButton = {
            backgroundColor: '#112D4E',
            color: 'white',
            borderRadius: '15px',
            padding: '1% 1.5%', // 패딩을 %로 조정
            cursor: 'pointer',
            marginLeft: '90%', // 왼쪽 여백을 %로 조정
            textDecoration: 'none'
        };

        const tableStyle = {
            width: '97%',
            borderCollapse: 'collapse',
            textAlign: 'center',
        };

        const tableStyles = {
            tableHeaderCell: {
                padding: '10px 20px',
                cursor: 'pointer',
                marginRight: '15px'
            },
            tableCell1: {
                width: '10%',
                textAlign: 'center',
                padding: '10px',
            },
            tableCell2: {
                width: '40%',
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
                width: '10%',
                textAlign: 'center',
                padding: '10px',
            },
            evenRow: {
                backgroundColor: '#f9f9f9'
            }
        };


        return (

            <main id="main" className="main">
                <div className="pagetitle" style={pageTitleStyle}>
                    <h1>공지사항 목록</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">기타</li>
                            <li className="breadcrumb-item active">공지사항</li>
                            <Link to="/insertAnnounce" className="notice-insert-button" style={insertButton}>등록하기</Link>
                        </ol>
                    </nav>
                </div>
                <div className="col-lg-12">
                    <div className="card">
                        <h5 className="card-title" style={cardTitleStyle}>Notice</h5>
                        <div className="content" style={contentStyle}>
                            <table className="table table-hover" style={tableStyle}>
                                <thead>
                                <tr>
                                    <th style={tableStyles.tableHeaderCell} scope="col">#</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">제목</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">작성자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">작성일자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">조회수</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">1</td>
                                    <td style={tableStyles.tableCell2}>열 크기 할당 테스트</td>
                                    <td style={tableStyles.tableCell3}>김인사</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>1</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">2</td>
                                    <td style={tableStyles.tableCell2}>열 크기 할당 테스트 열 크기 할당 테스트</td>
                                    <td style={tableStyles.tableCell3}>김가루</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>678</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">3</td>
                                    <td style={tableStyles.tableCell2}>열 크기 할당 테스트1231</td>
                                    <td style={tableStyles.tableCell3}>김법무</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>101</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">4</td>
                                    <td style={tableStyles.tableCell2}>열 크기 할당 테스트12321312321321321</td>
                                    <td style={tableStyles.tableCell3}>김회계</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>154</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">5</td>
                                    <td style={tableStyles.tableCell2}>열 </td>
                                    <td style={tableStyles.tableCell3}>김수한무거북이</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>17</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">6</td>
                                    <td style={tableStyles.tableCell2}>열 크기 할당 테스트12321312321321321</td>
                                    <td style={tableStyles.tableCell3}>김회계</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>154</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">7</td>
                                    <td style={tableStyles.tableCell2}>열 </td>
                                    <td style={tableStyles.tableCell3}>김수한무거북이</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>17</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">8</td>
                                    <td style={tableStyles.tableCell2}>열 크기 할당 테스트12321312321321321</td>
                                    <td style={tableStyles.tableCell3}>김회계</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>154</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">9</td>
                                    <td style={tableStyles.tableCell2}>열 </td>
                                    <td style={tableStyles.tableCell3}>김수한무거북이</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>17</td>
                                </tr>
                                <tr style={tableStyles.evenRow}>
                                    <td style={tableStyles.tableCell1} scope="row">10</td>
                                    <td style={tableStyles.tableCell2}>열 </td>
                                    <td style={tableStyles.tableCell3}>김수한무거북이</td>
                                    <td style={tableStyles.tableCell4}>2024-04-16</td>
                                    <td style={tableStyles.tableCell5}>17</td>
                                </tr>
                                </tbody>
                                {/* 페이징 처리 */}
                            </table>
                        </div>
                    </div>
                </div>
            </main >
        )
    }

    export default Announces;
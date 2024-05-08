import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncementsAsync, setCurrentPage } from '../../../modules/AnnounceModule';
import '../../../css/common.css';

function Announces() {
    const { announcements, currentPage, totalPages } = useSelector(state => state.announcesModule);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAnnouncementsAsync(currentPage)); // 현재 페이지의 공지사항 불러오기
    }, [currentPage, dispatch]);

    const renderAnnouncements = () => {
        if (!announcements || announcements.length === 0) {
            return (
                <tr>
                    <td colSpan="5">공지사항을 불러오는 중입니다...</td>
                </tr>
            );
        }

        return announcements.map((announce, index) => (
            <tr key={index}>
                <td style={{ width: '10%', textAlign: 'center', padding: '10px' }}>{announce.ancNo}</td>
                <td style={{ width: '40%', textAlign: 'center', padding: '10px' }}>
                <Link className="linkWithoutUnderline" to={`/announces/${announce.ancNo}`}>{announce.ancTitle}</Link>
                </td>
                <td style={{ width: '20%', textAlign: 'center', padding: '10px' }} >{announce.ancWriter}</td>
                <td style={{ width: '20%', textAlign: 'center', padding: '10px' }}>{announce.ancDate}</td>
                <td style={{ width: '10%', textAlign: 'center', padding: '10px' }}>{announce.hits}</td>
            </tr>
        ));
    };

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage({ page: newPage })); // 페이지 변경을 액션으로 디스패치
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
        }
    };



    const cardTitleStyle = {
        marginLeft: '30px'
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    const contentStyle = {
        marginLeft: '100px'
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle" style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h1>공지사항 목록</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">기타</li>
                        <li className="breadcrumb-item active">공지사항</li>
                        <Link to="/insertAnnounce" className="notice-insert-button" style={{ backgroundColor: '#112D4E', color: 'white', borderRadius: '15px', padding: '1% 1.5%', cursor: 'pointer', marginLeft: '90%', textDecoration: 'none' }}>등록하기</Link>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <h5 className="card-title" style={cardTitleStyle}>Notice</h5>
                    <div className="content">
                        <table className="table table-hover">
                            <thead>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <th style={{ width: '10%', textAlign: 'center', padding: '10px' }} scope="row">#</th>
                                    <th style={{ width: '40%', textAlign: 'center', padding: '10px' }} scope="row">제목</th>
                                    <th style={{ width: '20%', textAlign: 'center', padding: '10px' }} scope="row">작성자</th>
                                    <th style={{ width: '20%', textAlign: 'center', padding: '10px' }} scope="row">작성일자</th>
                                    <th style={{ width: '10%', textAlign: 'center', padding: '10px' }} scope="row">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderAnnouncements()}
                            </tbody>
                        </table>

                        <nav style={paginationStyle}>
                            <ul className="pagination">

                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handlePrevPage}>◀</button>
                                </li>
                                {Array.from(Array(totalPages).keys()).map((page, index) => (
                                    <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(page)}>
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handleNextPage}>▶</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Announces;

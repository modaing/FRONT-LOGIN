// AnnouncementsList.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncementsAsync, setCurrentPage } from '../../modules/AnnounceModule';

function AnnouncementsList({ maxVisibleAnnouncements, hidePagination }) {
    const { announcements, currentPage, totalPages } = useSelector(state => state.announceReducer);
    const dispatch = useDispatch();

    const visibleAnnouncements = announcements.slice(0, maxVisibleAnnouncements); // 최대 보여줄 공지사항 수에 맞게 announcements 배열을 잘라냅니다.

    useEffect(() => {
        dispatch(fetchAnnouncementsAsync(currentPage));
    }, [currentPage, dispatch]);

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage({ page: newPage }));
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

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    return (
        <div className="col-lg-12">
            <div className="card">
                <h5 className="card-title"></h5>
                <div className="ancListContent" >
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
                            {visibleAnnouncements.map((announce, index) => ( // visibleAnnouncements 배열을 기반으로 렌더링합니다.
                                <tr key={index}>
                                    <td style={{ width: '10%', textAlign: 'center', padding: '10px' }}>{announce.ancNo}</td>
                                    <td style={{ width: '40%', textAlign: 'center', padding: '10px' }}>
                                        <Link className="linkWithoutUnderline" to={`/announces/${announce.ancNo}`}>{announce.ancTitle}</Link>
                                    </td>
                                    <td style={{ width: '20%', textAlign: 'center', padding: '10px' }} >{announce.ancWriter}</td>
                                    <td style={{ width: '20%', textAlign: 'center', padding: '10px' }}>{announce.ancDate}</td>
                                    <td style={{ width: '10%', textAlign: 'center', padding: '10px' }}>{announce.hits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!hidePagination && ( // hidePagination이 false일 때만 페이징을 보여줍니다.
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnnouncementsList;

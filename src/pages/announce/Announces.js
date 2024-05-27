import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncementsAsync, setCurrentPage } from '../../modules/AnnounceModule';
import '../../css/common.css';
import AnnounceList from '../announce/AnnouceList'
import { decodeJwt } from '../../utils/tokenUtils';

function Announces() {
    const { announcements, currentPage, totalPages } = useSelector(state => state.announceReducer);
    const dispatch = useDispatch();

    const token = window.localStorage.getItem('accessToken');
    const role = token ? decodeJwt(token).role : null;

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

        return announcements?.map((announce, index) => (
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

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>공지사항 목록</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">공지사항</li>
                        {role === 'ADMIN' && (
                            <Link
                                to="/insertAnnounce"
                                style={{
                                    backgroundColor: '#112D4E',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '1% 2%',
                                    cursor: 'pointer',
                                    marginLeft: '93%',
                                    textDecoration: 'none'
                                }}
                            >
                                등록
                            </Link>
                        )}
                    </ol>
                </nav>
            </div>
            <AnnounceList />
        </main>
    );
}
export default Announces;

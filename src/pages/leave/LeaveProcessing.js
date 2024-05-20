import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { callSelectLeaveSubmitAPI, callUpdateLeaveSubmitAPI } from '../../apis/LeaveAPICalls';
import { SET_PAGENUMBER } from '../../modules/LeaveModule';
import LeaveProcessingModal from './LeaveProcessingModal';
import { renderLeaveSubmit } from '../../utils/leaveUtil';
import '../../css/common.css'
import '../../css/leave/LeaveProcessing.css'

function LeaveProcessing() {
    const { page } = useSelector(state => state.leaveReducer);
    const { number, content, totalPages } = page || {};
    const [properties, setProperties] = useState('leaveSubNo')
    const [direction, setDirection] = useState('DESC')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [leaveSubNo, setLeaveSubNo] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [detailInfo, setDetailInfo] = useState('');

    const dispatch = useDispatch();

    // 조회 관련 핸들러
    const handlePageChange = page => dispatch({ type: SET_PAGENUMBER, payload: page });

    const handlePrevPage = () => {
        if (number > 0) {
            dispatch({ type: SET_PAGENUMBER, payload: number - 1 });
        }
    };

    const handleNextPage = () => {
        if (number < totalPages - 1) {
            dispatch({ type: SET_PAGENUMBER, payload: number + 1 });
        }
    };

    const handleSort = (propertie) => {
        setProperties(propertie);
        setDirection(direction === 'DESC' ? 'ASC' : 'DESC');
    }

    // CUD 관련 핸들러
    const handleOpenModal = id => {
        setLeaveSubNo(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLeaveSubNo('')
        setSelectedTime('');
    };

    const handleUpdate = ({leaveSubNo, decision, reason}) => {
        const requestDate = {
            leaveSubNo,
            leaveSubStatus: decision,
            leaveSubReason: reason
        }
        dispatch(callUpdateLeaveSubmitAPI(requestDate));
    }

    useEffect(() => {
        setIsLoading(true);
        dispatch(callSelectLeaveSubmitAPI(number, properties, direction))
            .finally(() => setIsLoading(false));
    }, [number, properties, direction]);


    return <>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>휴가</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item">휴가</li>
                        <li className="breadcrumb-item active">휴가 신청 처리</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="leaveProcessingListContent" >
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('applicantName')}>
                                        <span>사원명</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th onClick={() => handleSort('leaveSubApplicant')}>
                                        <span>사번</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th onClick={() => handleSort('leaveSubStartDate')}>
                                        <span>휴가 시작일</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th onClick={() => handleSort('leaveSubEndDate')}>
                                        <span>휴가 종료일</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th onClick={() => handleSort('leaveSubType')}>
                                        <span>휴가 유형</span><i className="bx bxs-sort-alt"></i>
                                    </th>

                                    <th><span>차감 일수</span></th>

                                    <th><span>처리 상태</span></th>

                                    <th><span></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? ( // 로딩 중이면 로딩 메시지 표시
                                    <tr>
                                        <td colSpan="8" className="loadingText"></td>
                                    </tr>
                                ) : (
                                    renderLeaveSubmit(content, null, null, setSelectedTime, setDetailInfo, handleOpenModal) // 로딩 중이 아니면 실제 데이터 표시
                                )}
                            </tbody>
                        </table>

                        <nav >
                            <ul className="pagination">

                                <li className={`page-item ${number === 0 && 'disabled'}`}>
                                    <button className="page-link" onClick={handlePrevPage}>◀</button>
                                </li>

                                {[...Array(totalPages).keys()].map((page, index) => (
                                    <li key={index} className={`page-item ${number === page && 'active'}`}>
                                        <button className="page-link" onClick={() => {
                                            console.log('[page]', page);
                                            handlePageChange(page)
                                        }}>
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${number === totalPages - 1 && 'disabled'}`}>
                                    <button className="page-link" onClick={handleNextPage}>▶</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
        <LeaveProcessingModal isOpen={isModalOpen} onClose={handleCloseModal} onUpdate={handleUpdate} leaveSubNo={leaveSubNo} selectedTime={selectedTime} detailInfo={detailInfo} />
    </>

}

export default LeaveProcessing;
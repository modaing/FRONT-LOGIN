import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { callDeleteLeaveSubmitAPI, callInsertLeaveSubmitAPI, callSelectLeaveSubmitAPI } from '../../apis/LeaveAPICalls';
import { SET_PAGENUMBER } from '../../modules/LeaveModule';
import MyLeaveModal from './MyLeaveModal';
import { decodeJwt } from '../../utils/tokenUtils';
import { renderLeaveSubmit } from '../../utils/leaveUtil';
import { convertToUtc } from '../../utils/CommonUtil';
import '../../css/common.css';
import '../../css/leave/MyLeave.css';

function MyLeave() {
    const { page, leaveInfo, insertMessage } = useSelector(state => state.leaveReducer);
    const { totalDays, consumedDays, remainingDays } = leaveInfo || {};
    const { number, content, totalPages } = page || {};
    const [properties, setProperties] = useState('leaveSubNo');
    const [direction, setDirection] = useState('DESC');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [leaveSubNo, setLeaveSubNo] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const memberId = decodeJwt(window.localStorage.getItem("accessToken")).memberId;
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

    const handleSort = (property) => {
        setProperties(property);
        setDirection(direction === 'DESC' ? 'ASC' : 'DESC');
    }

    // CUD 관련 핸들러
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLeaveSubNo('');
        setSelectedTime('');
    };

    const handleInsert = ({ leaveSubNo, start, end, type, reason }) => {
        const requestData = {
            leaveSubNo,
            leaveSubApplicant: memberId,
            leaveSubStartDate: convertToUtc(start),
            leaveSubEndDate: convertToUtc(end),
            leaveSubType: type,
            leaveSubReason: reason
        };
        dispatch(callInsertLeaveSubmitAPI(requestData));

    };

    const handleDelete = id => {
        dispatch(callDeleteLeaveSubmitAPI(id));
    };

    const handleCancle = id => {
        setLeaveSubNo(id);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const resetNumber = async () => await dispatch({ type: SET_PAGENUMBER, payload: 0 });
        resetNumber();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await dispatch(callSelectLeaveSubmitAPI(number, properties, direction, memberId));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [number, properties, direction, insertMessage]);

    return <main id="main" className="main">
        <div className="pagetitle">
            <h1>휴가</h1>
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item">휴가</li>
                    <li className="breadcrumb-item active">나의 휴가 관리</li>
                </ol>
                <div className="leaveHeader">
                    <div className="leaveInfo">
                        <span>부여 휴가 일수</span><span>{totalDays}</span>
                        <span>소진 휴가 일수</span><span>{consumedDays}</span>
                        <span>잔여 휴가 일수</span><span>{remainingDays}</span>
                    </div>
                    <span className="insertLeave" onClick={handleOpenModal} >휴가 신청</span>
                </div>
            </nav>
        </div>
        <div className="col-lg-12">
            <div className="card">
                <div className="myLeaveListContent">
                    <table className="table table-hover">
                        <thead>
                            <tr>
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

                                <th onClick={() => handleSort('leaveSubApplyDate')}>
                                    <span>신청 일자</span><i className="bx bxs-sort-alt"></i>
                                </th>

                                <th><span>승인자</span></th>

                                <th onClick={() => handleSort('leaveSubProcessDate')}>
                                    <span>승인 일자</span><i className="bx bxs-sort-alt"></i>
                                </th>

                                <th><span>처리 상태</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                // 로딩 중이면 로딩 메시지 표시
                                ? <tr>
                                    <td colSpan="8" className="loadingText"></td>
                                </tr>
                                : content !== undefined
                                    ?
                                    // 로딩 중이 아니면 실제 데이터 표시
                                    renderLeaveSubmit(content, handleDelete, handleCancle, setSelectedTime)
                                    : <tr>
                                        <td colSpan="8">휴가 신청 내역이 존재하지 않습니다.</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${number === 0 || number === undefined && 'disabled'}`}>
                                <button className="page-link" onClick={handlePrevPage}>◀</button>
                            </li>
                            {[...Array(totalPages).keys()].map(page => (
                                <li key={page} className={`page-item ${number === page && 'active'}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page)}>
                                        {page + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${number === totalPages - 1 || number === undefined && 'disabled'}`}>
                                <button className="page-link" onClick={handleNextPage}>▶</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <MyLeaveModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleInsert} leaveSubNo={leaveSubNo} selectedTime={selectedTime} remainingDays={remainingDays}/>
    </main>
}

export default MyLeave;
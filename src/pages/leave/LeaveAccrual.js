import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { callInsertLeaveAccrualAPI, callSelectLeaveAccrual } from '../../apis/LeaveAPICalls';
import { SET_PAGENUMBER } from '../../modules/LeaveModule';
import LeaveAccrualModal from './LeaveAccrualModal';
import { decodeJwt } from '../../utils/tokenUtils';
import { renderLeaveAccrual } from '../../utils/leaveUtil';
import '../../css/common.css';
import '../../css/leave/LeaveAccrual.css';
import { convertToUtc } from '../../utils/CommonUtil';

function LeaveAccrual() {
    const { page, insertMessage } = useSelector(state => state.leaveReducer);
    const { number, content, totalPages } = page || {};
    const [properties, setProperties] = useState('leaveAccrualNo');
    const [direction, setDirection] = useState('DESC');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);
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
    };

    // CUD 관련 핸들러
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInsert = ({ id, start, end, days, AccReason }) => {
        const requestData = {
            recipientId: id,
            leaveAccrualDays: days,
            leaveSubStartDate: convertToUtc(start),
            leaveSubEndDate: convertToUtc(end),
            leaveAccrualReason: AccReason,
            grantorId: memberId
        };
        console.log('requestData', requestData);
        dispatch(callInsertLeaveAccrualAPI(requestData));
    };

    useEffect(() => {
        const resetNumber = async () => {
            try {
                await dispatch({ type: SET_PAGENUMBER, payload: 0 })
            } finally {
                setIsReset(true);
            }
        }
        resetNumber();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await dispatch(callSelectLeaveAccrual(number, properties, direction));
            } finally {
                setIsLoading(false);
            }
        };
        isReset
            && fetchData();
    }, [number, properties, direction, isReset]);
    return <main id="main" className="main">
        <div className="pagetitle">
            <h1>휴가</h1>
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item">휴가</li>
                    <li className="breadcrumb-item active">특별 휴가 발생 관리</li>
                </ol>
            </nav>
            <div className="leaveHeader">
                <div></div>
                <span className="insertAccrual" onClick={handleOpenModal} >휴가 발생</span>
            </div>
        </div>
        <div className="col-lg-12">
            <div className="card">
                <div className="LeaveAccrualListContent">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th><span>사원명</span></th>

                                <th onClick={() => handleSort('recipientId')}>
                                    <span>사번</span><i className="bx bxs-sort-alt"></i>
                                </th>

                                <th onClick={() => handleSort('accrualDate')}>
                                    <span>발생 일자</span><i className="bx bxs-sort-alt"></i>
                                </th>

                                <th><span>발생 일수</span></th>

                                <th><span>발생 사유</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                // 로딩 중이면 로딩 메시지 표시
                                ? <tr>
                                    <td colSpan="5" className="loadingText" />
                                </tr>
                                // 로딩 중이 아니면 실제 데이터 표시
                                : renderLeaveAccrual(content)
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
        <LeaveAccrualModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleInsert} />
    </main>
}

export default LeaveAccrual;
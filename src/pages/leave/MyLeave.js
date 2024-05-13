import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../../css/common.css'
import './MyLeave.css'
import { callSelectMyLeaveSubmitAPI } from '../../apis/LeaveAPICalls';
import { renderLeaveSubmit } from './utill/leaveUtill';
import { SET_PAGENUMBER } from '../../modules/LeaveModule';
import { decodeJwt } from '../../utils/tokenUtils';

function MyLeave() {
    const { leaveInfo, submitPage } = useSelector(state => state.leaveReducer);
    const { totalDays, consumedDays, remainingDays } = leaveInfo || {};
    const { number, content, totalPages } = submitPage || {};
    const [properties, setProperties] = useState('leaveSubNo')
    const [direction, setDirection] = useState('DESC')
    const memberId = decodeJwt(window.localStorage.getItem("accessToken")).memberId;
    const dispatch = useDispatch();

    let callSelectAPI = (number) => {
        dispatch(callSelectMyLeaveSubmitAPI(number, properties, direction, memberId))
    }

    useEffect(() => {
        callSelectAPI(number)
    }, [number, properties, direction]);

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


    return (
        <main id="main" className="main">
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
                        <Link to="/insertLeave" className="insertLeave" >휴가 신청</Link>
                    </div>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="myLeaveListContent" >
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

                                    <th><span></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderLeaveSubmit(content)}
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
    );
}

export default MyLeave;
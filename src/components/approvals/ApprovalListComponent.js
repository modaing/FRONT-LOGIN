import React, { useEffect } from "react";
import styles from '../../css/approval/ApprovalListComponent.module.css';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { fetchApprovalsAsync, setPageInfo, setCurrentPage } from '../../modules/ApprovalReducer';


const ApprovalListComponent = ({  fg, handleDeleteClick, handleSortDirectionChange, loggedInUserId }) => {

    const { approvals, loading, error, pageInfo } = useSelector(state => state.approval);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchApprovalsAsync(pageInfo.currentPage));
    }, [pageInfo.currentPage, dispatch]);

    const handleRowClick = (approvalNo) => {
        navigate(`/approvals/${approvalNo}`);
    };

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
        dispatch(fetchApprovalsAsync(newPage));
    };

    const handlePrevPage = () => {
        if (pageInfo.currentPage > 0) {
            handlePageChange(pageInfo.currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pageInfo.currentPage < pageInfo.totalPages - 1) {
            handlePageChange(pageInfo.currentPage + 1);
        }
    };

    const getPaginationRange = () => {
        const totalPageNumbers = 10;
        const halfPageNumbers = Math.floor(totalPageNumbers / 2);

        let start = pageInfo.currentPage - halfPageNumbers;
        let end = pageInfo.currentPage + halfPageNumbers;

        if (start < 0) {
            start = 0;
            end = totalPageNumbers;
        }

        if (end > pageInfo.totalPages) {
            start = pageInfo.totalPages - totalPageNumbers;
            end = pageInfo.totalPages;
        }

        return Array.from({ length: end - start }, (_, i) => i + start);
    };


    const paginationRange = getPaginationRange();

    const truncateName = (name, maxLength = 6) => {
        if (name.length > maxLength) {
            return name.slice(0, 5) + '...';
        }
        return name;
    }

    const renderApprovers = (approval) => {
        const approvers = approval.approver
            .filter(a => a.approverOrder !== 0)
            .sort((a, b) => a.approverOrder - b.approverOrder);
        const currentApprover = approval.standByApprover;

        return (
            <div className={styles.approversContainer}>
                {approvers.map((approver, index) => (
                    <span
                        key={index}
                        className={`${styles.approver} ${approver.name === currentApprover ? styles.currentApprover : ''}`}
                    >
                        {truncateName(approver.name)}
                        {(index + 1) % 3 === 0 && index !== approvers.length - 1 && <br />}
                        {(index !== approvers.length - 1 && (index + 1) % 3 !== 0) && ' - '}
                    </span>
                ))}
            </div>

        );
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.ApprovalListTable}>
                <thead>
                    <tr>
                        {fg === 'given' || fg === 'tempGiven' ? (
                            <>
                                <th onClick={handleSortDirectionChange} style={{ cursor: 'pointer' }}>
                                    {fg === 'given' ? '기안 일시' : '저장 일시'}
                                    <i className={`bx ${new URLSearchParams(window.location.search).get("direction") === 'ASC' ? 'bx-sort-up' : 'bx-sort-down'} ${styles.sortIcon}`}></i>
                                </th>
                                <th>양식</th>
                                <th>제목</th>
                                {fg === 'given' && <th>결재선</th>}
                                {fg === 'tempGiven' ? (
                                    <th>삭제</th>
                                ) : (
                                    <th>상태</th>
                                )}
                            </>
                        ) : (
                            <>
                                <th>제목</th>
                                <th>기안자</th>
                                <th>기안부서</th>
                                {fg === 'received' && <th>상태</th>}
                                <th onClick={handleSortDirectionChange} style={{ cursor: 'pointer' }}>
                                    기안 일시
                                    <i className={`bx ${new URLSearchParams(window.location.search).get("direction") === 'ASC' ? 'bx-sort-up' : 'bx-sort-down'} ${styles.sortIcon}`}></i>
                                </th>
                            </>
                        )}

                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" className={styles.loadingMessage}>전자결재 목록을 불러오는 중입니다...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="4" className={styles.loadingMessage}>오류가 발생했습니다: {error.message}</td>
                        </tr>
                    ) : approvals.length > 0 ? (

                        approvals.map(approval => {
                            const approver = approval.approver.find(a => a.memberId === loggedInUserId);
                            const approverStatus = approver ? approver.approverStatus : '';

                            return (
                                <tr key={approval.approvalNo} onClick={() => handleRowClick(approval.approvalNo)}>
                                    {fg === 'given' || fg === 'tempGiven' ? (
                                        <>
                                            <td>{approval.approvalDate}</td>
                                            <td>{approval.formName}</td>
                                            <td>{approval.approvalTitle}</td>
                                            {fg === 'given' && (
                                                <td>
                                                    {renderApprovers(approval)}
                                                </td>
                                            )}
                                            {fg === 'tempGiven' ? (
                                                <td>
                                                    <button onClick={(event) => handleDeleteClick(event, approval.approvalNo)} className={styles.deleteButton}>삭제</button>
                                                </td>
                                            ) : (
                                                <td className={approval.approvalStatus === "승인" ? styles.approved :
                                                    approval.approvalStatus === "반려" ? styles.rejected :
                                                        approval.approvalStatus === "회수" ? styles.withdrawn :
                                                            approval.approvalStatus === "처리 중" ? styles.approving : ''
                                                }>
                                                    {approval.approvalStatus === "승인" || approval.approvalStatus === "반려" ? (
                                                        <div>
                                                            <div>{approval.approvalStatus}</div>
                                                            <div>{approval.finalApproverDate}</div>
                                                        </div>
                                                    ) : approval.approvalStatus == "처리 중" ? (
                                                        <div>
                                                            <div>{approval.approvalStatus}</div>
                                                        </div>
                                                    ) : (
                                                        <div>{approval.approvalStatus}</div>
                                                    )}
                                                </td>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <td>{approval.approvalTitle}</td>
                                            <td>{approval.name}</td>
                                            <td>{approval.departName}</td>
                                            {fg === 'received' && (
                                                <td className={approverStatus === "승인" ? styles.approved :
                                                    approverStatus === "반려" ? styles.rejected :
                                                        approverStatus === "대기" ? styles.standByApprover : ''
                                                }>
                                                    {approverStatus}
                                                </td>
                                            )}
                                            <td>{approval.approvalDate}</td>
                                        </>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={fg === 'given' || fg === 'tempGiven' ? 4 : (fg === 'received' ? 5 : 4)} className={styles.loadingMessage}>
                                {fg == "given" ? "상신한" :
                                    fg == 'tempGiven' ? "임시저장된" :
                                        fg == 'received' ? '수신된' :
                                            fg == 'receivedRef' ? '참조된' :
                                                ''} 전자결재가 없습니다.
                            </td>
                        </tr>
                    )}

                </tbody>
                <nav style={paginationStyle}>
                <ul className="pagination">
                    <li className={`page-item ${pageInfo.currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handlePrevPage}>◀</button>
                    </li>
                    {paginationRange.map((page) => (
                        <li key={page} className={`page-item ${pageInfo.currentPage === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page)}>
                                {page + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${pageInfo.currentPage === pageInfo.totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handleNextPage}>▶</button>
                    </li>
                </ul>
            </nav>
            </table>
        </div>
    );

}

export default ApprovalListComponent;
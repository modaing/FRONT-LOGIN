import React from "react";
import styles from '../../css/approval/ApprovalListComponent.module.css';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'


const ApprovalListComponent = ({ approvals, fg, handleDeleteClick, handleSortDirectionChange, loggedInUserId }) => {

    const loading = useSelector((state) => state.approval.loading);
    const error = useSelector((state) => state.approval.error);
    const navigate = useNavigate();
    
    const handleRowClick = (approvalNo) => {
        navigate(`/approvals/${approvalNo}`);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.ApprovalListTable}>
                <thead>
                    <tr>
                        {fg === 'given' || fg === 'tempGiven' ? (
                            <>
                                <th onClick={handleSortDirectionChange} style={{ cursor: 'pointer' }}>
                                    {fg === 'given' ? '기안 일시' : '저장 일시' }
                                    <i className={`bx ${new URLSearchParams(window.location.search).get("direction") === 'ASC' ? 'bx-sort-up' : 'bx-sort-down'} ${styles.sortIcon}`}></i>
                                </th>
                                <th>양식</th>
                                <th>제목</th>
                                {fg === 'tempGiven' ? (
                                    <th>삭제</th>
                                ) : (
                                    <th>상태</th>
                                )}
                            </>
                        ) :  (
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
                        ) }

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
                                                            <div className={styles.standByApprover}>{approval.standByApprover}</div>
                                                        </div>
                                                    ) : (
                                                        <div>{approval.approvalStatus}</div>
                                                    )}
                                                </td>
                                            )}
                                        </>
                                    ) :  (
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
                                    ) }
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
            </table>
        </div>
    );

}

export default ApprovalListComponent;
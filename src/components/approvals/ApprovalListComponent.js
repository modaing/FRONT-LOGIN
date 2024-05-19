import React from "react";
import styles from '../../css/approval/ApprovalListComponent.module.css';



const ApprovalListComponent = ({ approvals, fg, handleDeleteClick, handleSortDirectionChange }) => {


    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={handleSortDirectionChange} style={{ cursor: 'pointer' }}>
                            기안 일시
                            <i className={`bx ${new URLSearchParams(window.location.search).get("direction") === 'ASC' ? 'bx-sort-up' : 'bx-sort-down'} ${styles.sortIcon}`}></i>
                        </th>
                        <th>양식</th>
                        <th>제목</th>
                        {fg === 'tempGiven' ? (
                            <th>삭제</th>
                        ) : (
                            <th>상태</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {/* {loading ? (
                        <tr>
                            <td colSpan="4" className={styles.loadingMessage}>전자결재 목록을 불러오는 중입니다...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="4" className={styles.loadingMessage}>오류가 발생했습니다: {error.message}</td>
                        </tr>
                    ) : */} {approvals.length > 0 ? (
                        approvals.map(approval =>
                            <tr key={approval.approvalNo}>
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
                                        {approval.approvalStatus === "승인" ? (
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
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan="4" className={styles.loadingMessage}>{fg == "given" ? "상신한" : "임시저장된"} 전자결재가 없습니다.</td>
                        </tr>


                    )}
                    {/*  <tr>
                            <td colSpan="4" className={styles.loadingMessage}>{fg == "given" ? "상신한" : "임시저장된"} 전자결재가 없습니다.</td>
                        </tr> */}
                </tbody>
            </table>
        </div>
    );

}

export default ApprovalListComponent;
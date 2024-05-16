import { useEffect, useState } from "react";
import ApprovalAPI from "../../apis/ApprovalAPI";
import { decodeJwt } from "../../utils/tokenUtils";
import styles from '../../css/approval/ApprovalListComponent.module.css';
import Pagination from "./Pagination";
import { useLocation, useNavigate } from "react-router-dom";

function ApprovalListComponent({ pageInfo, setPageInfo, fg, title }) {

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);


    const [approvals, setApprovals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(pageInfo.currentPage);
    const [direction, setDirection] = useState(queryParams.get("direction") || 'DESC');

   
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[SendApprovalList] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[SendApprovalList] memberId : ' + memberId);

    useEffect(() => {
        setLoading(true);
        ApprovalAPI.getApprovals({ fg, page, title, direction }).then((res) => {
            // setApprovals(res.data?.data);
            console.log('approvals data: ' + JSON.stringify(res.data, null, 2));
            setApprovals(res.data.data?.content || []);
            console.log('approval pageNumber : ' + res.data.data.pageable.pageNumber);
            console.log('approval totalPage : ' + res.data.data.totalPages);
            setPageInfo({ currentPage: res.data.data.pageable.pageNumber, totalPages: res.data.data.totalPages });
            console.log('current Page : ' + pageInfo.currentPage);
            console.log('totalPage : ' + pageInfo.totalPages);
            setLoading(false);      //데이터 로딩이 완료되면 로딩 상태를  false로 변경
        }).catch(error => {
            console.error('Error fetching approvals: ', error);
            setLoading(false);      //에러 발생 시에도 로딩 상태를 false로 변경
        });
    }, [fg, page, title, direction, setPageInfo]);

    useEffect(() => {
        const params = new URLSearchParams({ fg, page, title, direction});
        navigate(`/approvals?${params.toString()}`);
    }, [fg, page, title, direction, navigate]);

    const handlePageChange = (newPage) =>{
        setPage( newPage );
       
    };


    return (
        <div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>기안 일시</th>
                            <th>양식</th>
                            <th>제목</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className={styles.loadingMessage}>전자결재 목록을 불러오는 중입니다...</td>
                            </tr>
                        ) : (
                            approvals.length > 0 ? (
                                approvals.map(approval =>
                                    <tr key={approval.approvalNo}>
                                        <td>{approval.approvalDate}</td>
                                        <td>{approval.formName}</td>
                                        <td>{approval.approvalTitle}</td>
                                        <td className={approval.approvalStatus === "승인" ? styles.approved :
                                            approval.approvalStatus === "반려" ? styles.rejected :
                                                approval.approvalStatus === "회수" ? styles.withdrawn :
                                                    approval.approvalStatus === "처리 중" ? styles.approving : ''
                                        }>{approval.approvalStatus == "승인" ? (
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
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan="4" className={styles.loadingMessage}>{fg == "given" ? "상신한" : "임시저장된"} 전자결재가 없습니다.</td>
                                </tr>
                            )

                        )}
                       {/*  <tr>
                            <td colSpan="4" className={styles.loadingMessage}>{fg == "given" ? "상신한" : "임시저장된"} 전자결재가 없습니다.</td>
                        </tr> */}
                    </tbody>

                </table>

            </div>
            <Pagination
                totalPages={pageInfo.totalPages}
                currentPage={pageInfo.currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );

}

export default ApprovalListComponent;
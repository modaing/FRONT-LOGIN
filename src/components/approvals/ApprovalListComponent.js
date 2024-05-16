import { useEffect, useState } from "react";
import ApprovalAPI from "../../apis/ApprovalAPI";
import { decodeJwt } from "../../utils/tokenUtils";
import styles from '../../css/approval/ApprovalListComponent.module.css';

function ApprovalListComponent() {
    const [approvals, setApprovals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({});
    const [fg, setFg] = useState('given');
    const [page, setPage] = useState(0);
    const [title, setTitle] = useState('');
    const [direction, setDirection] = useState('DESC');


    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[SendApprovalList] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[SendApprovalList] memberId : ' + memberId);

    useEffect(() => {
        ApprovalAPI.getApprovals().then((res) => {
            // setApprovals(res.data?.data);
            console.log('approvals data: ' + JSON.stringify(res.data, null, 2));
            setApprovals(res.data.data?.content);
            setPageInfo({ currentPage: res.data.page, totalPages: res.data.totalPages });
            setLoading(false);      //데이터 로딩이 완료되면 로딩 상태를  false로 변경
        }).catch(error => {
            console.error('Error fetching approvals: ', error);
            setLoading(false);      //에러 발생 시에도 로딩 상태를 false로 변경
        });
    }, []);

    return (
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
                                    <td>{approval.approvalStatus}</td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td colSpan="4" className={styles.loadingMessage}>등록된 전자결재가 없습니다.</td>
                            </tr>
                        )

                    )}
                    <tr>
                        <td colSpan="4" className={styles.loadingMessage}>등록된 전자결재가 없습니다.</td>
                    </tr>
                </tbody>

            </table>
        </div>
    );

}

export default ApprovalListComponent;
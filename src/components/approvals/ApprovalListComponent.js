import { useEffect, useReducer, useState } from "react";
import ApprovalAPI from "../../apis/ApprovalAPI";
import { decodeJwt } from "../../utils/tokenUtils";
import styles from '../../css/approval/ApprovalListComponent.module.css';
import Pagination from "./Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import approvalReducer, {
     deleteApprovalFailure, 
     deleteApprovalSuccess, 
     fetchApprovalsFailure, 
     fetchApprovalsSuccess,
     setPageInfo 
    } from "../../modules/ApprovalReducer";

function ApprovalListComponent({ pageInfo, setPageInfo, fg, title }) {

    const [state, dispatch] = useReducer(approvalReducer, {
        fg,
        title,
        pageInfo,
        approvals : [],
        error: null
    });

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);


    // const [approvals, setApprovals] = useState(null);
    // const [page, setPage] = useState(pageInfo.currentPage);
    // const [direction, setDirection] = useState(queryParams.get("direction") || 'DESC');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);          //모달 상태
    const [deleteApproval, setDeleteApproval] = useState(null);     //삭제를 위한 전자결재 
    const [detailApproval, setDetailApproval] = useState(null);     //상세조회를 위한 전자결재 


    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[SendApprovalList] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[SendApprovalList] memberId : ' + memberId);

  /*   useEffect(() => {
        if(location.pathname === '/approvals'){
            setPage(0);
            setDirection('DESC');
        }
    }, [location.pathname]) */;

    useEffect(() => {
        setLoading(true);
        ApprovalAPI.getApprovals({
             fg: state.fg, 
             page: state.pageInfo.currentPage, 
             title: state.title, 
             direction: queryParams.get("direction") || 'DESC' 
            }).then((res) => {
            // setApprovals(res.data?.data);
            /* 
            console.log('approvals data: ' + JSON.stringify(res.data, null, 2));
            setApprovals(res.data.data?.content || []);
            console.log('approval pageNumber : ' + res.data.data.pageable.pageNumber);
            console.log('approval totalPage : ' + res.data.data.totalPages);
            setPageInfo({ currentPage: res.data.data.pageable.pageNumber, totalPages: res.data.data.totalPages });
            console.log('current Page : ' + pageInfo.currentPage);
            console.log('totalPage : ' + pageInfo.totalPages);
            
             */
            dispatch(fetchApprovalsSuccess(res.data.data?.content || []));
            dispatch(setPageInfo({ currentPage : res.data.data.pageable.pageNumber, totalPages: res.data.data.totalPages }));
            setLoading(false);      //데이터 로딩이 완료되면 로딩 상태를  false로 변경

        }).catch(error => {
            console.error('Error fetching approvals: ', error);
            dispatch(fetchApprovalsFailure(error));
            setLoading(false);      //에러 발생 시에도 로딩 상태를 false로 변경
        });
    }, [state.fg, state.pageInfo.currentPage, state.title, queryParams.get("direction")]);

    useEffect(() => {
        const params = new URLSearchParams({
             fg: state.fg, 
             page: state.pageInfo.currentPage, 
             title: state.title, 
             direction:queryParams.get("direction") || 'DESC' 
            });
        navigate(`/approvals?${params.toString()}`, { replace: true });
    }, [state.fg, state.pageInfo.currentPage, state.title, queryParams, navigate]);

    /* useEffect(() => {
        setPage(0);
    }, [title]);
 */
    const handleSortDirectionChange = () => {
        /* const newDirection = direction === 'ASC' ? 'DESC' : 'ASC';
        setDirection(newDirection);
        setPage(0);         // 정렬이 변경될 때 페이지를 으로 초기화 */
        const newDirection = queryParams.get("direction") === 'ASC' ? 'DESC' : 'ASC';
        queryParams.set("direction", newDirection);
        navigate(`approvals?${queryParams.toString()}`);
    };

    const handlePageChange = (newPage) => {
        // setPage(newPage);
        dispatch(setPageInfo({ ...state.pageInfo, currentPage: newPage}));
    };

    const handleDeleteClick = (approvalNo) => {
        setDeleteApproval(approvalNo);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if(deleteApproval){
            ApprovalAPI.deleteApproval(deleteApproval).then(() => {
                /* ApprovalAPI.getApprovals({ fg, page, title, direction }).then((res) => {
                    setApprovals(res.data.data?.content || []);
                    setPageInfo({ currentPage : res.data.data.pageable.pageNumber, totalPages: res.data.data.totalPages});
                    setIsModalOpen(false);
                    setDeleteApproval(null); */
                    dispatch(deleteApprovalSuccess(deleteApproval));
                    setIsModalOpen(false);
                    setDeleteApproval(null);
                }).catch(error => {
                    console.error('Error fetching approvals : ' + error);
                    dispatch(deleteApprovalFailure(error));
                });
            /*} ).catch(error => {
                console.error('Error deleting approval : ' , error);
            }); */
        }
    };

    const handleDeleteCancel = () => {
        setIsModalOpen(false);
        setDeleteApproval(null);
    };

    const handleSelectApproval = (approvalNo) => {
        setDetailApproval(approvalNo);
        navigate(`/approvals/${approvalNo}`);           //전자결재 상세 페이지로 이동
    }


    return (
        <div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={handleSortDirectionChange} style={{ cursor: 'pointer' }}>
                                기안 일시
                                <i className={`bx ${queryParams.get("direction") === 'ASC' ? 'bx-sort-up' : 'bx-sort-down'} ${styles.sortIcon}`}></i>
                            </th>
                            <th>양식</th>
                            <th>제목</th>
                            {state.fg === 'tempGiven' ? (
                                <th>삭제</th>
                            ) : (
                                <th>상태</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className={styles.loadingMessage}>전자결재 목록을 불러오는 중입니다...</td>
                            </tr>
                        ) : (
                            state.approvals.length > 0 ? (
                                state.approvals.map(approval =>
                                    <tr key={approval.approvalNo} onClick={() => handleSelectApproval(approval.approvalNo)}>
                                        <td>{approval.approvalDate}</td>
                                        <td>{approval.formName}</td>
                                        <td>{approval.approvalTitle}</td>
                                        {state.fg === 'tempGiven' ? (
                                            <td>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(approval.approvalNo); }} className={styles.deleteButton}>삭제</button>
                                            </td>
                                        ) : (
                                            <td className={approval.approvalStatus === "승인" ? styles.approved :
                                                approval.approvalStatus === "반려" ? styles.rejected :
                                                    approval.approvalStatus === "회수" ? styles.withdrawn :
                                                        approval.approvalStatus === "처리 중" ? styles.approving : ''
                                            }>
                                                {approval.approvalStatus == "승인" ? (
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
                                    <td colSpan="4" className={styles.loadingMessage}>{state.fg == "given" ? "상신한" : "임시저장된"} 전자결재가 없습니다.</td>
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
                totalPages={state.pageInfo.totalPages}
                currentPage={state.pageInfo.currentPage}
                onPageChange={handlePageChange}
            />
            <DeleteConfirmModal
                isOpen={isModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );

}

export default ApprovalListComponent;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styles from "../../css/approval/ApprovalDetail.module.css";
import { decodeJwt } from "../../utils/tokenUtils";
import { getApprovalDetailAPI, updateApprovalStatusAPI } from "../../apis/ApprovalAPI";
import UserInfoComponent from '../../components/approvals/UserInfoComponent';
import ApproversInfo from "../../components/approvals/ApproversInfo";
import ReferencerComponent from "../../components/approvals/ReferencerComponent";
import ReturnConfirmModal from "../../components/approvals/ReturnConfirmModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ApprovalDetail = () => {
    const { approvalNo } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const approvalDetail = useSelector((state) => state.approval.approvalDetail);
    const loading = useSelector((state) => state.approval.loading);
    const error = useSelector((state) => state.approval.error);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;


    useEffect(() => {
        dispatch(getApprovalDetailAPI(approvalNo));

    }, [dispatch, approvalNo]);

    if (loading) {
        return <div>전자결재 상세정보를 가져오는 중...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!approvalDetail) {
        return <div>No detail available</div>
    }

    const { memberId: approvalMemberId, approver, referencer, approvalTitle, approvalContent } = approvalDetail;

    const handleWithdrawClick = () => {
        setIsModalOpen(true);
    };

    const handleModalConfirm = () => {
        setIsModalOpen(false);
        dispatch(updateApprovalStatusAPI(approvalNo)).then (() => {
            navigate('/approvals?fg=given')
        });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    //작성자가 0번째에 있고, 작성자 다음으로 결재처리를 한 사람이 없거나 첫번째 사람이 결재처리를 안했으면 회수 버튼을 보이도록 설정
    const isSender = approver[0]?.memberId === memberId;
    console.log("0번째 결재자가 작성자가 맞는지: " + isSender)
    const nextApproverIndex = approver.findIndex(a => a.approverStatus === '승인' || a.approverStatus === '반려') === -1;
    console.log('nextApprover Index : ' + approver.findIndex(a => a.approverStatus === '승인' || a.approverStatus === '반려') === -1);
    const canWithdraw = isSender && nextApproverIndex;
    console.log('0번째 결재자가 작성자가 맞거나 승인 반려한사람이 없느냐' + canWithdraw);

    let breadcrumbLabel = '결재 상신 내역';
    if(!isSender){
        breadcrumbLabel = '결재 수신 내역';
    }

    return (
        <main id="main" className="main">
            <div className={styles.pageTop}>
                <div className="pagetitle">
                    <h1>결재 상세내역</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">전자결재</li>
                            <li className="breadcrumb-item active">{breadcrumbLabel}</li>
                        </ol>

                    </nav>
                </div>
            </div>
            <div className={styles.bigContent}>
                <UserInfoComponent memberId={approvalDetail.memberId} yearFormNo={approvalNo} />
                <ApproversInfo approvers={approver} />
                <ReferencerComponent referencers={referencer} />
                <div className={styles.ContentContainer}>
                    <div className={styles.approvalTitleContainer}>
                        <input type="text" className={styles.approvalTitle} value={approvalTitle} readOnly style={{ borderBottom: '1px solid black', width: '100%' }} />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: approvalDetail.approvalContent }}
                        className={styles.contentForm} />

                    <div>
                        첨부파일
                    </div>
                </div>
            </div>
            <div className={styles.ApprovalDetailBottom}>
                <div className={styles.buttonContainer}>
                    <button onClick={() => navigate('/approvals?fg=given')}>목록</button>
                    {canWithdraw && <button onClick={handleWithdrawClick}>회수</button>}
                </div>
            </div>
            <ReturnConfirmModal 
                isOpen={isModalOpen}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </main>
    );
}

export default ApprovalDetail;
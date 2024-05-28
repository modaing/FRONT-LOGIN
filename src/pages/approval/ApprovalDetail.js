import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styles from "../../css/approval/ApprovalDetail.module.css";
import { decodeJwt } from "../../utils/tokenUtils";
import { getApprovalDetailAPI } from "../../apis/ApprovalAPI";
import UserInfoComponent from '../../components/approvals/UserInfoComponent';
import ApproversInfo from "../../components/approvals/ApproversInfo";
import ReferencerComponent from "../../components/approvals/ReferencerComponent";

const ApprovalDetail = () => {
    const { approvalNo } = useParams();
    const dispatch = useDispatch();
    const approvalDetail = useSelector((state) => state.approval.approvalDetail);
    const loading = useSelector((state) => state.approval.loading);
    const error = useSelector((state) => state.approval.error);

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

    const { approver, referencer, approvalTitle, approvalContent } = approvalDetail;

    const contentFormStyles = {
        td :{
            backgroundColor:'red'
        }
        
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
                            <li className="breadcrumb-item active">결재 상신함</li>
                        </ol>

                    </nav>
                </div>
            </div>
            <div className={styles.bigContent}>
                <UserInfoComponent memberId={memberId} yearFormNo={approvalNo} />
                <ApproversInfo approvers={approver}/>
                <ReferencerComponent referencers={referencer}/>
                <div className={styles.ContentContainer}>
                    <div className={styles.approvalTitleContainer}>
                        <input type="text" className={styles.approvalTitle} value={approvalTitle} readOnly style = {{  borderBottom: '1px solid black', width: '100%' }}/>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: approvalDetail.approvalContent}} 
                    className={styles.contentForm} style={contentFormStyles}/>

                    <div>
                        첨부파일
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ApprovalDetail;
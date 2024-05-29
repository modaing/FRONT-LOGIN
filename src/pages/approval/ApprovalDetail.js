import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styles from "../../css/approval/ApprovalDetail.module.css";
import { decodeJwt } from "../../utils/tokenUtils";
import { downloadFileAPI, getApprovalDetailAPI, updateApprovalStatusAPI, updateApproverStatusAPI } from "../../apis/ApprovalAPI";
import UserInfoComponent from '../../components/approvals/UserInfoComponent';
import ApproversInfo from "../../components/approvals/ApproversInfo";
import ReferencerComponent from "../../components/approvals/ReferencerComponent";
import ReturnConfirmModal from "../../components/approvals/ReturnConfirmModal";
import ApproverStatusConfirmModal from "../../components/approvals/ApproverStatusConfirmModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ApprovalDetail = () => {
    const { approvalNo } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const approvalDetail = useSelector((state) => state.approval.approvalDetail);
    const loading = useSelector((state) => state.approval.loading);
    const error = useSelector((state) => state.approval.error);

    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isApproverStatusConfirmModalOpen, setIsApproverStatusConfirmModalOpen] = useState(false);

    const [isDownloading, setIsDownloading] = useState(false);

    const [rejectReason, setRejectReason] = useState('');
    const [actionType, setActionType] = useState('');

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

    const { memberId: approvalMemberId, approver, referencer, approvalTitle, approvalContent, approvalStatus, attachment } = approvalDetail;

    const handleWithdrawClick = () => {
        setIsWithdrawModalOpen(true);

    };

    const handleWithdrawConfirm = () => {
        setIsWithdrawModalOpen(false);
        dispatch(updateApprovalStatusAPI(approvalNo)).then(() => {
            navigate('/approvals?fg=given')
        });
    };

    const handleWithdrawCancel = () => {
        setIsWithdrawModalOpen(false);
    }

    const handleModalConfirm = () => {
        const approverToUpdate = approver.find(a => a.memberId === memberId && a.approverStatus === '대기');
        if (approverToUpdate) {
            const updateData = {
                approverNo: approverToUpdate.approverNo,
                approverStatus: actionType === 'approve' ? '승인' : '반려',
                rejectReason: actionType === 'reject' ? rejectReason : ''
            };
            dispatch(updateApproverStatusAPI(approverToUpdate.approverNo, updateData)).then(() => {

                setIsApproverStatusConfirmModalOpen(true);
            });
        }
    };

    const handleApproverStatusConfirmModalClose = () => {
        setIsApproverStatusConfirmModalOpen(false);
        navigate('/approvals?fg=received');
    }


    const handleApproveClick = () => {
        setRejectReason('');
        setActionType('approve');
    };

    const handleRejectClick = () => {
        setActionType('reject');
    };


    const handleRejectReasonChange = (e) => {
        setRejectReason(e.target.value);
    };

    const handleProcessClick = () => {
        handleModalConfirm();
    }

    //작성자가 0번째에 있고, 작성자 다음으로 결재처리를 한 사람이 없거나 첫번째 사람이 결재처리를 안했으면 회수 버튼을 보이도록 설정
    const isSender = approver[0]?.memberId === memberId;
    // console.log("0번째 결재자가 작성자가 맞는지: " + isSender)
    const firstApproverHasNotApproved = approver[1]?.approverStatus !== '승인' && approver[1]?.approverStatus !== '반려';
    // console.log('첫번째 결재자가 결재를 했나 : ' + firstApproverHasNotApproved);
    const canWithdraw = isSender && firstApproverHasNotApproved && approvalDetail.approvalStatus !== '회수';
    // console.log('0번째 결재자가 작성자가 맞거나 승인 반려한사람이 없거나 회수상태가 아닌가' + canWithdraw);

    //접속자가 현재 approver 중에서 approverStatus 가 '대기'인 사람 중에 가장 먼저인가
    const currentApprover = approver.find(a => a.memberId === memberId && a.approverStatus === '대기');
    const canApproveOrReject = currentApprover && approver.every(a => a.approverOrder >= currentApprover.approverOrder || a.approverStatus !== '대기');


    let breadcrumbLabel = '결재 상신 내역';
    if (!isSender) {
        breadcrumbLabel = '결재 수신 내역';
    }

    //목록 버튼 url 설정
    console.log('기안자 정보 : ' + approvalDetail.memberId);
    const listUrl = (approvalMemberId === memberId) ? '/approvals?fg=given&page=0&title=&direction=DESC' : '/approvals?fg=received&page=0&title=&direction=DESC';
    console.log("😫😫😫😫😫😫내가 기안자니?" + approvalDetail.memberId === memberId);

    //반려 사유 확인
    const rejectReasonFromApprover = approver.find(a => a.approverStatus === '반려')?.rejectReason;

    //파일 다운로드
    const downloadFile = async (fileSavepath, fileSavename, fileOriname) => {

        setIsDownloading(true);

        try{
            const fileData = await downloadFileAPI (fileSavepath, fileSavename, fileOriname);
            const url = window.URL.createObjectURL(new Blob([fileData]));
            const a = document.createElement('a');
            a.href = url;
            a.download = fileOriname;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 0);

        } catch(error){
            console.error('파일 다운로드 오류 : ', error);
        }finally {
            setIsDownloading(false);
        }

        // axios.get(fileUrl, { responseType: 'blob' })
        //     .then((response) => {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const a = document.createElement('a');
        //         a.href = url;
        //         a.download = fileOriname;
        //         document.body.appendChild(a);
        //         a.click();
        //         setTimeout(() => {
        //             window.URL.revokeObjectURL(url);
        //             document.body.removeChild(a);
        //         }, 0);
        //     }).catch((error) => {
        //         console.error('파일 다운로드 오류', error);
        //     }).finally(() => {
        //         setIsDownloading(false);
        //     });
        //두번쨰방법 - 안됨


        // const link = document.createElement('a');
        // link.href = `/approvals/files?fileSavepath=${encodeURIComponent(fileSavepath)}&fileSavename=${encodeURIComponent(fileSavename)}&fileOriname=${encodeURIComponent(fileOriname)}`;
        // // link.download  = fileOriname;
        // // document.body.appendChild(link);
        // // link.click();
        // // document.body.removeChild(link);
        // link.setAttribute('download', fileOriname);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        //첫번째 방법 - 안됨
    };


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

                    <div className={styles.attachmentsList}>
                        <div className={styles.attachmentListLabel}>
                            첨부파일
                        </div>
                        {attachment && attachment.length > 0 && (
                            <ul className={styles.attachmentList}>
                                {attachment.map((file, index) => (
                                    <li key={index}>
                                        {file.fileOriname}
                                        <button className={styles.fileDownloadBtn} onClick={() => downloadFile(file.fileSavepath, file.fileSavename, file.fileOriname)}>
                                            {isDownloading ? '다운로드 중...' : '다운로드'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div>

                        </div>
                    </div>
                </div>
                {canApproveOrReject && (
                    <div class={styles.actionBox}>
                        <div className={styles.actionButtons}>
                            <label className={styles.approveRadios}>
                                <input type="radio" name="action" value="approve" checked={actionType === 'approve'} onChange={handleApproveClick} />
                                <button onClick={handleApproveClick}>승인</button>
                            </label>

                            <label className={styles.rejectRadios}>
                                <input type="radio" name="action" value="reject" checked={actionType === 'reject'} onChange={handleRejectClick} />
                                <button onClick={handleRejectClick}>반려</button>
                            </label>

                        </div>

                        {actionType === 'reject' && (
                            <div className={styles.rejectReasonContainer}>
                                <div className={styles.rejectReasonLabel}>반려사유</div>
                                <textarea
                                    value={rejectReason}
                                    onChange={handleRejectReasonChange}
                                    placeholder="반려 사유를 입력하세요"
                                />
                            </div>
                        )}

                    </div>
                )}
                {rejectReasonFromApprover && (
                    <div className={styles.rejectReasonDisplay}>
                        <div className={styles.rejectReasonLabel}>반려 사유</div>
                        <div className={styles.rejectReason}>{rejectReasonFromApprover}</div>
                    </div>
                )}

            </div>
            <div className={styles.ApprovalDetailBottom}>
                <div className={styles.buttonContainer}>
                    <button onClick={() => navigate(listUrl)}>목록</button>
                    {canWithdraw && <button onClick={handleWithdrawClick}>회수</button>}
                    {canApproveOrReject && <button onClick={handleProcessClick}>처리</button>}
                </div>
            </div>
            <ReturnConfirmModal
                isOpen={isWithdrawModalOpen}
                onConfirm={handleWithdrawConfirm}
                onCancel={handleWithdrawCancel}
            />
            <ApproverStatusConfirmModal
                isOpen={isApproverStatusConfirmModalOpen}
                onClose={handleApproverStatusConfirmModalClose}
            />
        </main>
    );
}

export default ApprovalDetail;
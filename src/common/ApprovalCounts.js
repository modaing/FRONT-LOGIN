import { callApprovalCountsAPI } from '../apis/InsiteAPICalls';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../css/ApprovalCounts.css';
import { decodeJwt } from '../utils/tokenUtils';

function ApprovalCounts() {
    const dispatch = useDispatch();
    const [approvalCounts, setApprovalCounts] = useState('');
    const [resultArray, setResultArray] = useState('');
    const token = window.localStorage.getItem("accessToken");

    const memberInfo = decodeJwt(token);
    const memberId = memberInfo.memberId;

    useEffect(() => {
        const fetchApprovalCounts = async () => {
            try {
                const response = await dispatch(callApprovalCountsAPI());
                setApprovalCounts(response.data);
                setResultArray(response.data);
            } catch (error) {
                console.error('Error fetching approval counts:', error);
            }
        };

        fetchApprovalCounts();
    }, [dispatch]);

    function findCountByMemberId(memberId, resultArray) {
        for (let i = 0; i < resultArray.length; i++) {
            if (resultArray[i][0] === memberId) {
                return resultArray[i][1];
            }
        }
        return 0; // 해당하는 memberId가 없으면 0을 반환
    }

    const approvalCount = findCountByMemberId(memberId, approvalCounts);

    return (
        <div className="approval-counts-container">
            <div className="approval-counts-body">
                <h7 className="approval-counts-title">진행 중인 결자결재 건수</h7>

                <div className="content-container">
                    <div className="text-container">
                        <span className="percentage">{approvalCount}<span>건</span></span>
                    </div>
                    <div className="icon-container">
                        <i className="bi bi-menu-up"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApprovalCounts;

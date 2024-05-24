import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { callMyLeaveCountsAPI } from '../apis/InsiteAPICalls';
import { decodeJwt } from './../utils/tokenUtils';
import '../css/MyLeaveCounts.css';

function MyLeaveCounts() {
    const dispatch = useDispatch();
    const [totalDays, setTotalDays] = useState('');
    const [consumedDays, setConsumedDays] = useState('');
    const remainingDays = totalDays - consumedDays;
    const memberId = decodeJwt(window.localStorage.getItem("accessToken")).memberId;
    // const memberId = 241201001; (체크용)

    useEffect(() => {
        const fetchMyLeaveCounts = async () => {
            try {
                const response = await dispatch(callMyLeaveCountsAPI(memberId));
                const myData = response.data.find(item => item.memberId === memberId);

                if (myData) {
                    setConsumedDays(myData.consumedDays);
                    setTotalDays(myData.totalDays);
                }
            } catch (error) {
                console.error('Error fetching leave counts:', error);
            }
        };

        fetchMyLeaveCounts();
    }, [dispatch, memberId]);


    return (
        <div className="leave-counts-container">
            <div className="leave-counts-body">
                <h7 className="leave-counts-title">잔여 휴가 일수</h7>

                <div className="leave-content-container">
                    <div className="leave-text-container">
                        <span className="leave-percentage">{remainingDays}<span>일</span></span>
                    </div>
                    <div className="leave-icon-container">
                        <i className="bi bi-menu-up"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyLeaveCounts;
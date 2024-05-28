import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { callMyLeaveCountsAPI } from '../apis/InsiteAPICalls';
import {callSelectLeaveSubmitAPI} from '../apis/LeaveAPICalls'
import { decodeJwt } from './../utils/tokenUtils';
import '../css/MyLeaveCounts.css';

function MyLeaveCounts() {
    const dispatch = useDispatch();
    const [totalDays, setTotalDays] = useState('');
    const [remainingDays, setRemaingDats] = useState('');
    // const memberId = decodeJwt(window.localStorage.getItem("accessToken")).memberId;
    const memberId = 240528903; 

    const { leaveInfo } = useSelector(state => state.leaveReducer);

    console.log(leaveInfo)

    useEffect(() => {
        const fetchMyLeaveCounts = async () => {
            try {
                const response = await dispatch(callMyLeaveCountsAPI(memberId));
                const myData = response.data
                if (myData) {
                    setRemaingDats(myData.remainingDays);
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
                        <i className="bi bi-joystick"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyLeaveCounts;
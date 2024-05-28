import { GET_LEAVE_MEMBER, GET_MEMBER_DEPART, GET_COMMUTE_MEMBER, GET_APPROVAL_COUNTS, GET_APPROVER_COUNTS, GET_MY_LEAVES_COUNT, GET_LEAVE_COMMUTE_COUNT, GET_MEMBER_BIRTHDAY_COUNT } from '../modules/InsiteModule';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const getAccessToken = () => {
    return window.localStorage.getItem('accessToken') || '';
};

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + getAccessToken(),
};


export const callMemberDepartSelectAPI = () => {
    return async (dispatch) => {
        try {
            const memberDepartResponse = await axios.get(`${API_BASE_URL}/insites/departments`, { headers });
            dispatch({ type: GET_MEMBER_DEPART, payload: memberDepartResponse.data });
            console.log('memberDepartResponse', memberDepartResponse);
            return memberDepartResponse;
        } catch (error) {
            throw error;
        }
    }
};

export const callLeaveMemberSelectAPI = () => {
    return async (dispatch) => {
        try {
            const leaveMemberResponse = await axios.get(`${API_BASE_URL}/insites/leaves`, { headers });
            dispatch({ type: GET_LEAVE_MEMBER, payload: leaveMemberResponse.data });
            console.log('leaveMemberResponse', leaveMemberResponse);
            return leaveMemberResponse;
        } catch (error) {
            throw error;
        }
    }
};

export const callCommuteMemberSelectAPI = () => {
    return async (dispatch) => {
        try {
            const commuteMemberResponse = await axios.get(`${API_BASE_URL}/insites/commutes`, { headers });
            dispatch({ type: GET_COMMUTE_MEMBER, payload: commuteMemberResponse.data });
            console.log('commuteMemberResponse', commuteMemberResponse);
            return commuteMemberResponse;
        } catch (error) {
            throw error;
        }
    }
}

export const callApprovalCountsAPI = () => {
    return async (dispatch) => {
        try {
            const approvvalCountsResponse = await axios.get(`${API_BASE_URL}/insites/approvals`, { headers });
            dispatch({ type: GET_APPROVAL_COUNTS, payload: approvvalCountsResponse.data });
            console.log('approvvalCountsResponse', approvvalCountsResponse);
            return approvvalCountsResponse;
        } catch (error) {
            throw error;
        }
    }
}

export const callApproverCountsAPI = () => {
    return async (dispatch) => {
        try {
            const approverCountsResponse = await axios.get(`${API_BASE_URL}/insites/approvers`, { headers });
            dispatch({ type: GET_APPROVER_COUNTS, payload: approverCountsResponse.data });
            console.log('approverCountsResponse', approverCountsResponse);
            return approverCountsResponse;
        } catch (error) {
            throw error;
        }
    }
}

export const callMyLeaveCountsAPI = (memberId) => {
    return async (dispatch) => {
        try {
            const myLeaveCountsResponse = await axios.get(`${API_BASE_URL}/insites/leaves/${memberId}`, { headers });
            dispatch({ type: GET_MY_LEAVES_COUNT, payload: myLeaveCountsResponse.data });
            console.log('myLeaveCountsResponse', myLeaveCountsResponse);
            return myLeaveCountsResponse;
        } catch (error) {
            throw error;
        }
    }
}

export const callLeaveCommuteCountsAPI = () => {
    return async (dispatch) => {
        try {
            const leaveCommuteCountsResponse = await axios.get(`${API_BASE_URL}/insites/leaves/commutes`, { headers })
            dispatch( {type: GET_LEAVE_COMMUTE_COUNT, payload: leaveCommuteCountsResponse.data});
            console.log('leaveCommuteCountsResponse', leaveCommuteCountsResponse)
            return leaveCommuteCountsResponse;
        } catch (error) {
            throw error;
        }
    }
}

export const callMemberBirthdayCountsAPI = () => {
    return async (dispatch) => {
        try { 
            const memberBirthdayCountsResponse = await axios.get(`${API_BASE_URL}/insites/members`, { headers });
            dispatch({type: GET_MEMBER_BIRTHDAY_COUNT, payload: memberBirthdayCountsResponse.data});
            console.log('memberBirthdayCountsResponse', memberBirthdayCountsResponse)
            return memberBirthdayCountsResponse;
        } catch (error) {
            throw error;
        }
    }
};

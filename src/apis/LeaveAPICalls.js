import { DELETE_LEAVESUBMIT, GET_LEAVESUBMIT, POST_LEAVESUBMIT } from "../modules/LeaveModule";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};


export const callSelectMyLeaveSubmitAPI = ( number, properties, direction, memberId ) => {
    return async (dispatch) => {

        const page = number ? number : 0;
        
        try {
            
            const response = await axios.get(`${API_BASE_URL}/leaveSubmits?page=${page}&properties=${properties}&direction=${direction}&memberId=${memberId}`, { headers });

            dispatch({ type: GET_LEAVESUBMIT, payload: response.data.results });
            
        } catch (error) {
            console.log('휴가 내역 조회에 문제 발생', error);
        }
    }
};

export const callInsertLeaveSubmitAPI = requestData => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_BASE_URL}/leaveSubmits`, requestData, { headers });

            dispatch({ type: POST_LEAVESUBMIT, payload: response.data.results });

        } catch (error) {
            console.log('휴가 신청에 문제 발생', error)
        }
    }
};

export const callDeleteLeaveSubmitAPI = id => {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/leaveSubmits/${id}`, { headers });

            dispatch({ type: DELETE_LEAVESUBMIT, payload: response.data.results });

        } catch (error) {
            console.log('휴가 신청 삭제에 문제 발생', error)
        }
    }
};
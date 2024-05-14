import { GET_LEAVESUBMIT } from "../modules/LeaveModule";
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
        console.log('[callSelectMyLeaveSubmitAPI]:', page, properties, direction, memberId)

        try {
            
            const response = await axios.get(`${API_BASE_URL}/leaveSubmits?page=${page}&properties=${properties}&direction=${direction}&memberId=${memberId}`, { headers });

            console.log('[response.data]: ', response.data.results)

            dispatch({ type: GET_LEAVESUBMIT, payload: response.data.results });
            
        } catch (error) {
            console.log('휴가 내역 조회에 문제 발생', error);
        }
    }
};
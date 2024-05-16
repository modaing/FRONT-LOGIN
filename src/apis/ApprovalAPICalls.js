import axios from "axios";
import { getApprovals, getApproval } from "../modules/ApprovalModule"
import { request } from "./CommonAPI";


const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

export const ApprovalAPICalls = (fg, title, direction, pageNo) => {
    return async (dispatch) => {
        const page = pageNo ? pageNo : 0;

        try {

            const response = await axios.get(`${API_BASE_URL}/approvals?fg=${fg}&page=${page}&title=${title}`, { headers });

            console.log('[response.data]: ', response.data.results)

            
        }catch(error){

        }
    }
}

export const callAppListAPI = ({fg, title, direction, pageNo}) =>{
    let requestURL;

    requestURL = `/approvals?fg=${fg}&page=${pageNo}&title=${title}&direction=${direction}`;

    return async (dispatch, getState) => {
        /* const result = await request('GET', requestURL);
        if(result.status === 200){
            dispatch(getApprovals(result.data));
        }
 */
        /* try{
            const response = await axios.get(`${API_BASE_URL}/${requestURL}`, { headers });

            console.log('[response.data]:', response.data.results)

            return response.data;

        }catch(error){
            console.error('API request 에러: ', error);
            throw error;
        } */

        try{
            const response = await axios.get(`${API_BASE_URL}${requestURL}`);
            dispatch(getApprovals(response.data));
        }catch(error){
            console.error('API request 에러: ', error);
            throw error;
        }
    }

}
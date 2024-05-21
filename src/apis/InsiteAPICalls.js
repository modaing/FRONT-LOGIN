import { GET_MEMBER_DEPART } from '../modules/InsiteModule';
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

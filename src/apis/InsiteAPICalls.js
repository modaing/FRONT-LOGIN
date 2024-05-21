import { GET_LEAVE_MEMBER, GET_MEMBER_DEPART, GET_COMMUTE_MEMBER } from '../modules/InsiteModule';
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
            const leaveMemberResponse = await axios.get(`${API_BASE_URL}/insites/leaves`, {headers});
            dispatch ({ type: GET_LEAVE_MEMBER, payload: leaveMemberResponse.data});
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
            const commuteMemberResponse = await axios.get(`${API_BASE_URL}/insites/commutes`, {headers});
            dispatch({ type: GET_COMMUTE_MEMBER, payload: commuteMemberResponse.data });
            console.log('commuteMemberResponse', commuteMemberResponse);
            return commuteMemberResponse;
        } catch (error) {
            throw error;
        }
    }
}
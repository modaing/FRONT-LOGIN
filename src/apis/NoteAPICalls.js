import { GET_RECEIVE_NOTES, GET_SEND_NOTES, PUT_SEND_NOTES, PUT_RECEIVE_NOTES } from '../modules/NoteMudule';
import axios from 'axios';
import { decodeJwt } from './../utils/tokenUtils';

const API_BASE_URL = 'http://localhost:8080';

const getAccessToken = () => {
    return window.localStorage.getItem('accessToken') || ''; // 기본값으로 빈 문자열 반환
};

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + getAccessToken(),
};

const decodedTokenInfo = decodeJwt(getAccessToken());
const memberId = decodedTokenInfo ? decodedTokenInfo.memberId : null;

export const callReceiveNotesAPI = (page = 0, size = 10, sort = 'noteNo', direction = 'DESC', receiverId = memberId, senderId = memberId) => {
    return async (dispatch) => {
        try {
            const receiveNotesResponse = await axios.get(`${API_BASE_URL}/members/${memberId}/notes?receiverId=${receiverId}&size=${size}&page=${page}&sort=${sort}&direction=${direction}&sendDeleteYn=N&receiveDeleteYn=N`, { headers });
            dispatch({ type: GET_RECEIVE_NOTES, payload: receiveNotesResponse.data.results });
            console.log('receiveNotesResponse', receiveNotesResponse);

        } catch (error) {
        }
    };
};

export const callSendNotesAPI = (page = 0, size = 10, sort = 'noteNo', direction = 'DESC', receiverId = memberId, senderId = memberId) => {
    return async (dispatch) => {
        try {
            const sendNotesResponse = await axios.get(`${API_BASE_URL}/members/${memberId}/notes?senderId=${senderId}&size=${size}&page=${page}&sort=${sort}&direction=${direction}&sendDeleteYn=N&receiveDeleteYn=N`, { headers });

            dispatch({ type: GET_SEND_NOTES, payload: sendNotesResponse.data.results });
            console.log('sendNotesResponse', sendNotesResponse);
        } catch (error) {
        }
    };
};  

export const callPutSendNotesAPI = (noteNo, sendDeleteYn, receiveDeleteYn) => {
    return async (dispatch) => {
        try {
            const putNotesResponse = await axios.put(
                `${API_BASE_URL}/notes/${noteNo}`,
                { sendDeleteYn, receiveDeleteYn }, // sendDeleteYn / receiveDeleteYn 값을 전달
                {
                    headers: {
                        'Content-Type': 'application/json', 
                        Accept: '*/*',
                        Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
                    }
                }
            );
            dispatch({ type: PUT_SEND_NOTES, payload: putNotesResponse.data });
        } catch (error) {
            console.log("error", error);
        }
    };
};

export const callPutReceiceNotesAPI = (noteNo, receiveDeleteYn, sendDeleteYn) => {
    return async (dispatch) => {
        try {
            const putNotesResponse = await axios.put(
                `${API_BASE_URL}/notes/${noteNo}`,
                { receiveDeleteYn,sendDeleteYn }, // sendDeleteYn / receiveDeleteYn 값을 전달
                {
                    headers: {
                        'Content-Type': 'application/json', 
                        Accept: '*/*',
                        Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
                    }
                }
            );
            dispatch({ type: PUT_RECEIVE_NOTES, payload: putNotesResponse.data });
        } catch (error) {
            console.log("error", error);
        }
    };
};
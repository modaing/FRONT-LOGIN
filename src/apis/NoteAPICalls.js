import { GET_RECEIVE_NOTES, GET_SEND_NOTES } from '../modules/NoteMudule';
import axios from 'axios';
import { decodeJwt } from './../utils/tokenUtils';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

const API_BASE_URL = 'http://localhost:8080';

const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));
const memberId = decodedTokenInfo.memberId;

export const callReceiveNotesAPI = (page = 0, size = 10, sort = 'noteNo', direction = 'DESC', receiverId=memberId, senderId=memberId) => {
    return async (dispatch) => {
        try {
            const receiveNotesResponse = await axios.get(`${API_BASE_URL}/members/${memberId}/notes?receiverId=${receiverId}&size=${size}&page=${page}&sort=${sort}&direction=${direction}&deleteYn=N`, { headers });
            dispatch({ type: GET_RECEIVE_NOTES, payload: receiveNotesResponse.data.results });
            console.log('receiveNotesResponse', receiveNotesResponse);

        } catch (error) {
            console.log("error", error);
        }
    };
};

export const callSendNotesAPI = (page = 0, size = 10, sort = 'noteNo', direction = 'DESC', receiverId=memberId, senderId=memberId) => {
    return async (dispatch) => {
        try {
            const sendNotesResponse = await axios.get(`${API_BASE_URL}/members/${memberId}/notes?senderId=${senderId}&size=${size}&page=${page}&sort=${sort}&direction=${direction}&deleteYn=N`, { headers });
            dispatch({ type: GET_SEND_NOTES, payload: sendNotesResponse.data.results });
            console.log('sendNotesResponse',sendNotesResponse);
        } catch (error) {
            console.log("error", error);
        }
    };
};


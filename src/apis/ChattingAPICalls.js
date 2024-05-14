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

export const callMemberListAPI = () => {
  return axios.get(`${API_BASE_URL}/api/rooms/members`, {headers});
};




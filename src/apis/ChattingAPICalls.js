import axios from 'axios';
import { decodeJwt } from './../utils/tokenUtils';
import { POST_ROOM } from '../modules/CahttingModules';


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
  return axios.get(`${API_BASE_URL}/api/rooms/members`, { headers });
};


export const callCahttingAPI = async (memberId) => {
  try {
    let url = `${API_BASE_URL}/api/rooms/?memberId=${memberId}&receiverMemberId=${memberId}`;

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching rooms: ' + error.message);
  }
};

export const callInsertRoomAPI = (request) => {
  return async (dispatch) => {
    try {
      const postRoomResponse = await axios.post(
        `${API_BASE_URL}/api/rooms/enteredRooms`, request, {headers})
      dispatch({ type: POST_ROOM, payload: postRoomResponse.data });
      console.log(postRoomResponse)
    } catch (error) {
      console.log("error", error);
    }
  }
}



export const leaveRoom = (memberId, roomId) => {
  return axios.post(`${API_BASE_URL}/room/${roomId}/leave`, { memberId });
};
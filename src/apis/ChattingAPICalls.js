import axios from 'axios';
import { decodeJwt } from './../utils/tokenUtils';
import { POST_ROOM, DELETE_ROOM, POST_MESSAGES, GET_MESSAGES, PUT_ROOM_STATUS } from '../modules/CahttingModules';


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


export const callCahttingAPI = async (memberId, receiverDeleteYn, senderDeleteYn) => {
  try {
    let url = `${API_BASE_URL}/api/rooms/?memberId=${memberId}&receiverMemberId=${memberId}&receiverDeleteYn='N'&senderDeleteYn='N'`;

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
        `${API_BASE_URL}/api/rooms/`, request, { headers })
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


export const callDeleteRoomAPI = (enteredRoomId) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem("accessToken"); // 토큰 가져오기
      const headers = {
        'Authorization': `Bearer ${token}`, // Bearer 토큰 형식으로 전달
        'Content-Type': 'application/json'
      };

      const deleteRoomResponse = await axios.delete(
        `${API_BASE_URL}/api/rooms/${enteredRoomId}`, { headers });

      console.log(deleteRoomResponse);
      dispatch({ type: DELETE_ROOM, payload: enteredRoomId });
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  }
};


export const callPutRoomStatusAPI = (enteredRoomId, memberId) => {
  return async (dispatch) => {
    try {
      const putRoomStatusResponse = await axios.put(`${API_BASE_URL}/api/rooms/${enteredRoomId}?memberId=${memberId}&action=delete`, {}, { headers });
      console.log(putRoomStatusResponse);
      dispatch({ type: PUT_ROOM_STATUS, payload: putRoomStatusResponse });
      return putRoomStatusResponse;
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  }
}

export const callPostMessages = (messageDTO) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/`, messageDTO, { headers });
      dispatch({ type: POST_MESSAGES, payload: response.data });
      console.log(response);
      return response;
    } catch (error) {
      throw error
    }
  };
}

export const callGetMessages = (enteredRoomId) => {
  return async (dispatch) => {
    try {
      const getMessagesResponse = await axios.get(`${API_BASE_URL}/api/messages/${enteredRoomId}`, { headers });
      dispatch({ type: GET_MESSAGES, payload: getMessagesResponse.data });
      console.log('getMessagesResponse', getMessagesResponse);
      return getMessagesResponse;
    } catch (error) {
      throw error;
    }
  }
}
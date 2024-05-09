import { GET_CALENDAR } from "../modules/CalendarModule";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
  };

export const callInsertCalendarAPI = async (requestData) => {
    console.log('callInsertCalendarAPI [requestData]: ', requestData)

    try {
        console.log('axios 실행 전')
        const response = await axios.post(`${API_BASE_URL}/calendars`, requestData, { headers })
        console.log('[response]: ', response);
        console.log('[response]: ', response.data);
        return response.data;
    } catch (error) {
        console.error('일정 추가에 문제가 있습니다:', error);

    }

};
import { GET_CALENDAR, POST_CALENDAR, PUT_CALENDAR } from "../modules/CalendarModule";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};


export const callSelectCalendarAPI = (department) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/calendars?department=${department}`, { headers });

            dispatch({ type: GET_CALENDAR, payload: response.data.results });

        } catch (error) {
            console.log('일정 조회에 문제 발생', error);
        }
    };
};

export const callInsertCalendarAPI = (requestData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/calendars`, requestData, { headers })

            dispatch({ type: POST_CALENDAR, payload: response.data });

        } catch (error) {
            console.error('일정 추가에 문제 발생:', error);
        }
    };
};

export const callUpdateCalendarAPI = (requestData) => {
    return async (dispatch) => {
        try {
            console.log('[callUpdateCalendarAPI] axios 전');
            const response = await axios.put(`${API_BASE_URL}/calendars`, requestData, { headers })

            console.log('[response]: ', response);
            dispatch({ type: PUT_CALENDAR, payload: response.data });

        } catch (error) {
            console.error('일정 수정에 문제 발생:', error);
        }
    };
};
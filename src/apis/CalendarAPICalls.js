import {
    GET_CALENDAR,
    POST_CALENDAR,
    PUT_CALENDAR,
    DELETE_CALENDAR
} from "../modules/CalendarModule";
import axios from 'axios';

export const callInsertCalendarAPI = (requestData) => {

    return async (dispatch, getState) => {

        try {
            const response = await axios.post('http://localhost:8080/calendars', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'BEARER eyJkYXRlIjoxNzE0NTIyNDEyOTQyLCJ0eXBlIjoiand0IiwiYWxnIjoiSFMyNTYifQ.eyJwb3NpdGlvbk5hbWUiOiLslYzrsJQiLCJSb2xlIjoiQURNSU4iLCJpbWFnZSI6IuydtOuvuOyngOqwgCDrk6TslrTqsIgg6rK966GcIiwic3ViIjoiaW5zaWRlcidzIHRva2VuOiAyNDA0MDEwMDEiLCJ1c2VyTmFtZSI6Iuq5gOyngO2ZmCIsImV4cCI6MTcxNDYwODgxMiwiZGVwYXJ0TmFtZSI6IuyduOyCrO2MgCIsIm1lbWJlcklkIjoyNDA0MDEwMDF9.Ajn8VLUnWGkJJEOxi9o6ykMD5P6_IGK3wKKJcptuOrU'
                }
            });
    
            console.log(response.data);
            dispatch({ type: POST_CALENDAR, payload: response.data });
    
        } catch (error) {
            console.error('일정 추가에 문제가 있습니다:', error);
        }
    }

};
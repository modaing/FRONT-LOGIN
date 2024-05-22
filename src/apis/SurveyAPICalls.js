import { } from "../modules/LeaveModule";
import axios from 'axios';
import { GET_PAGE, POST_MESSAGE } from "../modules/SurveyModule";

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};


export const callSelectSurveyListAPI = (number, properties, direction, memberId) => {
    return async (dispatch) => {
        try {
            const page = number ? number : 0;

            const response = await axios.get(`${API_BASE_URL}/surveys?page=${page}&properties=${properties}&direction=${direction}&memberId=${memberId}`, { headers });
            
            dispatch({ type: GET_PAGE, payload: response.data.results.page });

        } catch (error) {
            console.log('수요 조사 목록 조회에 문제 발생', error);
        }
    }
};

export const callInsertSurveyResponse = requestData => {
    return async dispatch => {
        try {
        const response = await axios.post(`${API_BASE_URL}/surveyResponses`, requestData, { headers });

            dispatch({ type: POST_MESSAGE, payload: response.data})
        } catch {
            console.log('수요조사 응답 등록에 문제 발생', Error);
        }
    }
}

export const callInsertSurvey = requestData => {
    return async dispatch => {
        console.log('[requestData]',requestData);
        try {
        const response = await axios.post(`${API_BASE_URL}/surveys`, requestData, { headers });
console.log(response.data);
            dispatch({ type: POST_MESSAGE, payload: response.data})
        } catch {
            console.log('수요조사 응답 등록에 문제 발생', Error);
        }
    }
}
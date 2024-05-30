import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

export const callPositionDetailListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showAllPosition`, { headers });
        // console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching position details:', error);
        throw error
    }
}

export const callChangePositionNameAPI = async (positionInform) => {
    try {
        const { positionName, newPositionName } = positionInform;

        const response = await axios.put(`${API_BASE_URL}/position/${positionName}`,
        { newPositionName },
        { headers });
        console.log('response:',response);
        return response.data;
    } catch (error) {
        console.error('Error changing position name:', error);
        throw error;
    }
}

export const callRegisterPositionAPI = async (positionInform) => {
    try {
        const { newPositionName, positionLevel } = positionInform;

        const response = await axios.post(`${API_BASE_URL}/position`,
        { newPositionName, positionLevel },
        { headers }
    );
    console.log('response:',response);
    return response.data;
    } catch (error) {
        console.error('직급 등록하는데 실패했습니다:', error);
        throw error;
    }
};

export const callDeletePositionAPI = async (positionInform) => {
    try {
        const { positionName } = positionInform;

        const response = await axios.delete(`${API_BASE_URL}/positions/${positionName}`,
        { headers }
    );
    console.log('response:',response);
    return response.data;
    } catch (error) {
        console.error('직급을 삭제하는데 실패했습니다:', error);
        throw error;
    }
}
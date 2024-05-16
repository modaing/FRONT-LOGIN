import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
  };

export const callDepartmentDetailListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/departments`, { headers });
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching department details:', error);
        throw error
    }
}
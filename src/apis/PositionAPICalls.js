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
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching position details:', error);
        throw error
    }
}
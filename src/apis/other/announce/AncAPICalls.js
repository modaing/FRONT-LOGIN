import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  Accept: '*/*',
  Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};


export const ancListAPI = async (page = 0, size = 10, sort = 'ancNo', direction='DESC') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/announces?page=${page}&size=${size}&sort=${sort}&direction=${direction}`, { headers });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching announcements: ' + error.message);
  }
};

export const ancDetailAPI = async (ancNo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/announces/${ancNo}`, { headers });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching announcement detail: ' + error.message);
  }
};

export const ancInsertAPI = async (formData) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/announces`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
          }
      });
      return response.data;
  } catch (error) {
      throw new Error('Error insert: ' + error.message);
  }
};

export const ancDeleteAPI = async (ancNo) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/announces/${ancNo}`, {headers});
    return response.data;
  } catch (error) {
    throw new Error('Error fetching delete: ' + error.message);
  }
};

export const ancUpdateAPI = async (ancNo, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/announces/${ancNo}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error update: ' + error.message);
  }
};

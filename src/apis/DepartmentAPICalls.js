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
        // console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching department details:', error);
        throw error
    }
}

export const callChangeDepartmentNameAPI = async (departmentInform) => {
    try {
        const { newDepartName, departNo } = departmentInform;
        const response = await axios.put(`${API_BASE_URL}/departments/${departNo}`,
        { newDepartName },
        { headers });
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('부서명 변경하는 오류가 발생했습니다:', error);
        throw error;
    }
}

export const callRegisterDepartmentAPI = async (department) => {
    try {
        const { newDepartName } = department;
        console.log('inputted new department name:', newDepartName);
        const response = await axios.post(
            // `${API_BASE_URL}/departments?newDepartName=${encodeURIComponent(newDepartName)}`,
            `${API_BASE_URL}/departments`,
            { newDepartName }, // Empty body
            { headers }
        );
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('부서 등록하는데 실패했습니다:', error);
        throw error;
    }
};

export const callDeleteDepartmentAPI = async (department) => {
    try {
        const { departNo } = department;
        console.log('inputted department to be delete:', departNo);
        const response = await axios.delete(`${API_BASE_URL}/departments/${departNo}`,
        { headers }
    );
    console.log('response:', response);
    return response.data;
    } catch (error) {
        console.error('부서 삭제하는데 실패했습니다:', error);
        throw error;
    }
};

export const callGetDepartmentByDepartNoAPI = async (departNo) => {
    console.log('departNo:',departNo);
    try {
        const response = await axios.get(`${API_BASE_URL}/getDepartByNo/${departNo}`,
        { headers }
    );
    console.log('response:', response);
    return response.data;
    } catch (error) {
        console.error('특정 부서를 불러오는데 실패했습니다:', error);
        throw error;
    }
}
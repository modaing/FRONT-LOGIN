import { GET_MEMBER, POST_LOGIN, POST_REGISTER } from '../modules/MemberModule';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
  };

export const callGetMemberAPI = ({ memberId }) => {
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8080/api/v1/members/${memberId}`;

    return async (dispatch, getState) => {
        // 클라이언트 fetch mode : no-cors 사용시 application/json 방식으로 요청이 불가능
        // 서버에서 cors 허용을 해주어야 함
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
            },
        }).then((response) => response.json());

        console.log('[MemberAPICalls] callGetMemberAPI RESULT : ', result);

        dispatch({ type: GET_MEMBER, payload: result });
    };
};

export const callLoginAPI = ({ form }) => {
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8080/auth/login`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                'Access-Control-Allow-Origin': '*', // 모든 도멘인에서 접근할 수 있음을 의미 (특정도메인을 넣고싶으면 * 대신 http://test.com)
            },
            body: JSON.stringify({
                memberId: form.memberId,
                memberPassword: form.memberPassword,
            }),
        }).then((response) => response.json());

        console.log('[MemberAPICalls] callLoginAPI RESULT : ', result);
        if (result.status === 200) {
            window.localStorage.setItem('accessToken', result.userInfo.accessToken);
        }
        dispatch({ type: POST_LOGIN, payload: result });
    };
};

export const callLogoutAPI = () => {
    return async (dispatch, getState) => {
        dispatch({ type: POST_LOGIN, payload: '' });
        console.log('[MemberAPICalls] callLogoutAPI RESULT : SUCCESS');
        console.log('token 정보:', localStorage.getItem("accessToken"));
    };
};

export const callRegisterMemberAPI = async (formData) => {
    try {
        const result = await axios.post(`${API_BASE_URL}/signUp`, formData);
        console.log('Registration successful:', result);
        
    } catch (error) {
        console.error('Registration failed:',error);
    }
    
}

export const callGetDepartmentListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/departmentDetails`, { headers });
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching department list:', error);
        throw error;
    }
}

export const callGetPositionListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showAllPosition`, { headers });
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching position list:', error);
        throw error;
    }
}

export const callShowAllMemberListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showAllMembersPage`, { headers });
        console.log('response:',response);
        return response.data;
    } catch (error) {
        console.error('Error fetching position list:', error);
        throw error;
    }
}

export const callDownloadExcelFileAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/downloadMemberInfo`, {
        headers,
        responseType: 'blob'
    });
        console.log('response:', response);
        return response.data;
    } catch(error) {
        console.error('Error downloading excel file:', error);
        throw error;
    }
}

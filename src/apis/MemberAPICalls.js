import { GET_MEMBER, POST_LOGIN, POST_REGISTER } from '../modules/MemberModule';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

const header = {
    'Content-Type': 'application/json',
    Authorization: 'BEARER ' + window.localStorage.getItem('accessToken'),
}

export const callGetMemberAPI = async (memberId) => {
    // console.log('memberId:',memberId);
        try {
            const response = await axios.get(`${API_BASE_URL}/members/${memberId}`,
                { headers }
            );
            // console.log('member:',response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch member information:',error);
        }
    // };
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
    const memberDTOFile = formData.get('memberDTO');

    const memberDTOString = await memberDTOFile.text();
    const memberDTO = JSON.parse(memberDTOString);
    
    const memberProfilePicture = formData.get('memberProfilePicture');
    console.log('formData:',formData);

    try {
        const result = await axios.post(`${API_BASE_URL}/signUp`, 
        formData
    );
    console.log('Registration successful:', result);
    } catch (error) {
        console.error('Registration failed:',error);
    }
}

export const callGetDepartmentListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/departmentDetails`, { headers });
        // console.log('department list:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching department list:', error);
        throw error;
    }
}

export const callGetPositionListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showAllPosition`, { headers });
        // console.log('position list:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching position list:', error);
        throw error;
    }
}

export const callShowAllMemberListAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showAllMembersPage`, { headers });
        // console.log('response:',response);
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
        // console.log('response:', response);
        return response.data;
    } catch(error) {
        console.error('Error downloading excel file:', error);
        throw error;
    }
}

export const callGetTransferredHistory = async (memberId) => {
    try {
        console.log('memberId:',memberId);
        const response = await axios.get(`${API_BASE_URL}/transferredHistory/${memberId}`,
        { headers }
    );
    // console.log('transferred history:',response);
    return response.data;
    } catch (error) {
        console.error('Error bringing in transferred history:', error);
    }
}

export const callChangePasswordAPI = async (data) => {
    console.log('currentPassword:', data.currentPassword);
    console.log('password1:', data.newPassword1);
    console.log('password2:', data.newPassword2);

    if (!data.newPassword1 && !data.newPassword2) {
        console.log('Resetting password...');
        try {
            const response = await axios.put(`${API_BASE_URL}/updateOwnPassword`,
            {},
            { headers }
        );
        // console.log('Password reset response:', response);
        return response.data;
        } catch (error) {
            console.error('Error resetting member password:', error);
        }
    } else {
        console.log('Updating password...');
        try {
            const response = await axios.put(`${API_BASE_URL}/updateOwnPassword`,
            data,
            { headers }
        );
        console.log('Password update response:',response);
        return response.data;
        } catch (error) {
            console.log(error.response.data);
            if (error.response.data === 'Incorrect current password') {
                alert('비밀번호가 틀렸습니다');
            } 
        }
    }
}

export const callUpdateMemberAPI = async (formData) => {
    const memberDTOFile = formData.get('memberDTO');
    const memberDTOString = await memberDTOFile.text();
    const memberDTO = JSON.parse(memberDTOString);
    const memberId = memberDTO.memberId;
    console.log('memberDTO:', memberDTO);

    try {
        const response = await axios.put(`${API_BASE_URL}/members/updateProfile/${memberId}`,
        formData,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
                }
            }
        );
        
    return response.data
    } catch (error) {
        console.log('Error updating member:', error);
    }
};


// export const callResetPassAPI = async (memberId) => {
//     console.log('memberId:',memberId);
//     try {
//         const response = await axios.put(`${API_BASE_URL}/resetPassword/${memberId}`, {},
//         {
//             headers: {
//                 'Content-Type': 'application/json; charset=UTF-8',
//                 Accept: '*/*',
//                 Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
//                 'Access-Control-Allow-Origin': '*', // Optional depending on CORS policy of the server
//                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Optional depending on CORS policy of the server
//                 'Access-Control-Max-Age': '3600', // Optional depending on CORS policy of the server
//                 'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, X-XSRF-token', // Optional depending on CORS policy of the server
//                 'Access-Control-Allow-Credentials': 'false', // Optional depending on CORS policy of the server
//             }

//             // headers: {
//             //     'Content-Type': 'application/json',
//             //     'Access-Control-Allow-Origin': '*', // 모든 도멘인에서 접근할 수 있음을 의미 (특정도메인을 넣고싶으면 * 대신 http://test.com)
//             // }
//         }
//     );
//     console.log('response:', response.data);
//     return response.data;
//     } catch (error) {
//         console.error('fail',error);
//         throw error;
//     }
// }
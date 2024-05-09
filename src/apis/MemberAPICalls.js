import { GET_MEMBER, POST_LOGIN, POST_REGISTER } from '../modules/MemberModule';
import { useNavigate } from 'react-router-dom';



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

// export const callLoginAPI = ({ form }) => {
//     const requestURL = `http://localhost:8080/login`;

//     return async (dispatch, getState) => {
//         // 클라이언트 fetch mode : no-cors 사용시 application/json 방식으로 요청이 불가능
//         // 보안상의 이유로 브라우저는 스크립트에서 시작한 교차 출처 HTTP요청을 제한한다.
//         // 서버에서 cors 허용을 해주어야 함
//         const result = await fetch(requestURL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: '*/*',
//                 'Access-Control-Allow-Origin': '*', // 모든 도멘인에서 접근할 수 있음을 의미 (특정도메인을 넣고싶으면 * 대신 http://test.com)
//             },
//             body: JSON.stringify({
//                 memberId: form.memberId,
//                 memberPassword: form.memberPassword,
//             }),
//         }).then((response) => response.json());

//         console.log('[MemberAPICalls] callLoginAPI RESULT : ', result);
//         if (result.status === 200) {
//             window.localStorage.setItem('accessToken', result.userInfo.accessToken);
//         }
//         dispatch({ type: POST_LOGIN, payload: result });
//     };
// };

// export const callLoginAPI = ({ form }) => {

//     // const memberIdInt = parseInt(form.memberId);
//     const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8080/login`;

//     try {
//         const response = await fetch(requestURL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: '*/*',
//                 'Access-Control-Allow-Origin': '*', // 모든 도멘인에서 접근할 수 있음을 의미 (특정도메인을 넣고싶으면 * 대신 http://test.com)
//             },
//             body: JSON.stringify({
//                 memberId: form.memberId,
//                 password: form.password,
//             }),
//         }).then((response) => response.json());

//         console.log(`[MemberAICalls] callLoginAPI RESULT:`, response);
//         // const responseData = await response.json();
//         const token = response.token; // 토큰 정보

//         if (response.ok) {

//             /* 로그인 실패시... 예) 존재하지 않는 사용자입니다 */
//             if (response.failType != null) {
//                 alert (response.failType);
//                 console.log('response.failType:', response.failType);
                
//                 return { success: false, error: response.failType};
//             } else {
//                 /* 로그인 성공시 */
//                 localStorage.setItem('accessToken', token);     // 토큰 저장
//                 console.log("token 정보 in MemberAPICalls:", token);
    
//                 return { success: true };
//             }
//         } else {
//             console.error('Failed to login:', response);
//             return { success: false, error: '로그인에 실패했습니다. 다시 시도해주세요.' };
//         }
//     } catch (error) {
//         // 로그인할 때 다른 error가 발생할 시
//         console.error('Error during login:', error);
//         return { success: false, error: '로그인에 실패했습니다. 다시 시도해주세요.' };
//     }
// };

export const callLoginAPI = ({ form }) => {
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8080/auth/login`;

    return async (dispatch, getState) => {
        // 클라이언트 fetch mode : no-cors 사용시 application/json 방식으로 요청이 불가능
        // 보안상의 이유로 브라우저는 스크립트에서 시작한 교차 출처 HTTP요청을 제한한다.
        // 서버에서 cors 허용을 해주어야 함
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
//     // const requestURL = `http://localhost:8080/login`;
//     const apiUrl = process.env.REACT_APP_RESTAPI_IP || 'localhost';
//     const requestURL = `http://${apiUrl}:8080/login`;

//     return async (dispatch) => { // Use async (dispatch) to define it as a thunk action creator
//         try {
//             const response = await fetch(requestURL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Accept: '*/*',
//                     'Access-Control-Allow-Origin': '*',
//                 },
//                 body: JSON.stringify({
//                     memberId: form.memberId,
//                     password: form.password,
//                 }),
//             }).then((response) => response.json());

//             console.log(`[MemberAICalls] callLoginAPI RESULT:`, response);
//             const token = response.token;

//             if (response.ok) {
//                 if (response.failType != null) {
//                     alert(response.failType);
//                     console.log('response.failType:', response.failType);
//                     return { success: false, error: response.failType };
//                 } else {
//                     localStorage.setItem('accessToken', token);
//                     console.log("token 정보 in MemberAPICalls:", token);
//                     return { success: true };
//                 }
//             } else {
//                 console.error('Failed to login:', response);
//                 return { success: false, error: '로그인에 실패했습니다. 다시 시도해주세요.' };
//             }
//         } catch (error) {
//             console.error('Error during login:', error);
//             return { success: false, error: '로그인에 실패했습니다. 다시 시도해주세요.' };
//         }
//     };
// };

export const callLogoutAPI = () => {
    return async (dispatch, getState) => {
        dispatch({ type: POST_LOGIN, payload: '' });
        console.log('[MemberAPICalls] callLogoutAPI RESULT : SUCCESS');
        console.log('token 정보:', localStorage.getItem("accessToken"));
    };
};

export const callRegisterAPI = ({ form }) => {
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8080/auth/signup`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify({
                // memberId: form.memberId,
                // memberPassword: form.memberPassword,
                // memberName: form.memberName,
                // memberEmail: form.memberEmail,
                memberId: form.memberId,
                memberPassword: form.memberPassword
            }),
        }).then((response) => response.json());

        console.log('[MemberAPICalls] callRegisterAPI RESULT : ', result);

        if (result.status === 201) {
            dispatch({ type: POST_REGISTER, payload: result });
        }
    };
};

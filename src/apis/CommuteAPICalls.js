import {
    GET_COMMUTE,
    GET_COMMUTES,
    POST_COMMUTE,
    PUT_COMMUTE
} from '../modules/CommuteModule.js';

export const callCommuteListAPI = ({ currentPage, member, memberId, date }) => {
    let requestURL;

    if(currentPage !== undefined || currentPage !== null) {
        requestURL = `http://${process.env.REACT_APP_RESETAPI_IP}:8080/commutes?target=${member}&targetValue=${memberId}&date=${date}&offset=${currentPage}`;
    } else {
        requestURL = `http://${process.env.REACT_APP_RESETAPI_IP}:8080/commutes?target=${member}&targetValue=${memberId}&date=${date}`;
    }

    console.log('[callCommuteListAPI] requestURL : ', requestURL);

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }).then((response) => response.json());
        if (result.status === 200) {
            console.log('[callCommuteListAPI] result : ', result);
            dispatch({ type: GET_COMMUTES, payload: result.data});
        }
    };
};
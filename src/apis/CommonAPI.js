import axios from "axios";
import { decodeJwt } from '../utils/tokenUtils';
// import jwt_decode from 'jwt-decode';

const DOMAIN = 'http://localhost:8080';

// const decodedToken = (token) => {
//     try {
//         return jwt_decode(token);
//     } catch (error) {
//         console.error('Error decoding token : ', error);
//         return null;
//     }
// };

export const request = async (method, url, data) => {

    try {
        // const accessToken = localStorage.getItem('accessToken');
        // const decodedToken = decodeJwt(accessToken);

        // console.log('accessToken : ', accessToken);
        // console.log('decodedToken : ', decodedToken);

        const response = await axios({
            method: method,
            url: `${DOMAIN}${url}`,
            data,
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
            },
        });
        // const { memberId, role, departName } = decodedToken;

        console.log('[request] response.data : ', response.data.results.result);
        return {response};

    } catch (error) {
        console.error('API request error : ', error);
        throw error;
    }
};
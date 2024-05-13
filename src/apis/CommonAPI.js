import axios from "axios";
// import { decodeJwt } from '../utils/tokenUtils';

const DOMAIN = 'http://localhost:8080';

export const request = async (method, url, data) => {

    try {

        const response = await axios({
            method: method,
            url: `${DOMAIN}${url}`,
            data,
            headers: {
                Authorization: 'Bearer` ' + window.localStorage.getItem('accessToken'),
            },
        });

        console.log('[request] response.data : ', response.data.results.result);
        return {response};

    } catch (error) {
        console.error('API request error : ', error);
        throw error;
    }
};
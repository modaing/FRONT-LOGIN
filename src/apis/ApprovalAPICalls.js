import axios from "axios";


const API_BASE_URL = 'http://localhost:8080';

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

export const ApprovalAPICalls = (fg, title, direction, pageNo) => {
    return async (dispatch) => {
        const page = pageNo ? pageNo : 0;

        try {

            const response = await axios.get(`${API_BASE_URL}/approvals?fg=${fg}&page=${page}&title=${title}`, { headers });

            console.log('[response.data]: ', response.data.results)

            
        }catch(error){

        }
    }
}
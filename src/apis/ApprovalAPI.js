import axios from "axios";

const API_BASE_URL = "http://localhost:8080/";

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

const ApprovalAPI = {

    getApprovals : ({ fg, page, title, direction }) => {

        const params = {
            fg, page, title, direction
        };

        const approvalListUrl = `approvals?fg=${fg}&page=${page}&title=${title}&direction=${direction}`;

        return axios.get(API_BASE_URL + approvalListUrl, { headers });
        
    }
}


export default ApprovalAPI;
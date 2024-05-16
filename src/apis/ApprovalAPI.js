import axios from "axios";

const API_BASE_URL = "http://localhost:8080/";

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};

class ApprovalAPI{

    approvalListUrl = 'approvals?fg=given&page=0&title=';

    getApprovals () {

        return axios.get(API_BASE_URL + this.approvalListUrl, { headers });
        
    }
}


export default new ApprovalAPI();
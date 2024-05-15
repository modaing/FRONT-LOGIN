import { createActions, handleActions } from "redux-actions";

const initialState = {
    approvalNo: '',
    memberId : '',
    approvalTitle: '',
    approvalContent: '',
    approvalDate: '',
    approvalStatus: '', 
    rejectReason: '',
    formNo: '',
    formName: '',
    departName: '',
    name: '',
    positionName: '',
    attachment: [],
    approver: [],
    referencer : [],
    approverDate: '',
    standByApprover: ''
};

// 액션
const GET_APPROVALLIST = 'approval/GET_APPROVALLIST';
const GET_APPROVAL = 'approval/GET_APPROVAL';
const POST_APPROVAL = 'approval/POST_APPROVAL';
const PUT_APPROVAL = 'approval/PUT_APPROVAL';
const PUT_APPROVER = 'approver/PUT_APPROVER';
const DELETE_APPROVAL = 'approval/DELETE_APPROVAL';
const SET_PAGENUMBER = 'approval/SET_PAGENUMBER';

export const { approval : { getApprovals, getApproval }} = createActions({
    [GET_APPROVALLIST]: (res) => ({ type: GET_APPROVALLIST, payload: res }), // 액션 생성 함수에 대한 반환 추가
    [GET_APPROVAL]: () => ({})
});

// 리듀서
const approvalReducer = handleActions({
    [GET_APPROVALLIST]:(state, {payload}) => {return payload},
    [GET_APPROVAL]: (state, {payload}) => {return payload}
}, initialState);

export default approvalReducer;
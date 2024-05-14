const initialState = {};

export const GET_APPROVALLIST = 'approval/GET_APPROVALLIST';
export const GET_APPROVAL = 'approval/GET_APPROVAL';
export const POST_APPROVAL = 'approval/POST_APPROVAL';
export const PUT_APPROVAL = 'approval/PUT_APPROVAL';
export const PUT_APPROVER = 'approver/PUT_APPROVER';
export const DELETE_APPROVAL = 'approval/DELETE_APPROVAL';
export const SET_PAGENUMBER = 'approval/SET_PAGENUMBER';

const actions = createActions({
    [GET_APPROVALLIST]: () => {},
    [GET_APPROVAL]: () => {},
    [POST_APPROVAL]: () => {},
    [PUT_APPROVAL]: () => {},
    [PUT_APPROVER]: () => {},
    [DELETE_APPROVAL]: () => {},
    [SET_PAGENUMBER]: () => {}
});

const approvalReducer = handleActions({
    [GET_APPROVALLIST]:(state, {payload}) => ({})
})
import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_LEAVESUBMIT = 'leave/GET_LEAVESUBMIT';
export const POST_LEAVESUBMIT = 'leave/POST_LEAVESUBMIT';
export const PUT_LEAVESUBMIT = 'leave/PUT_LEAVESUBMIT';
export const DELETE_LEAVESUBMIT = 'leave/DELETE_LEAVESUBMIT';
export const SET_PAGENUMBER = 'leave/SET_PAGENUMBER';
export const GET_LEAVEACCRUAL = 'leave/GET_LEAVEACCRUAL';
export const GET_MEMBERLIST = 'leave/GET_MEMBERLIST';
export const POST_LEAVEACCRUAL = 'leave/POST_LEAVEACCRUAL';

const actions = createActions({
    [GET_LEAVESUBMIT]: () => {},
    [POST_LEAVESUBMIT]: () => {},
    [PUT_LEAVESUBMIT]: () => {},
    [DELETE_LEAVESUBMIT]: () => {},
    [SET_PAGENUMBER]:() => {},     
    [GET_LEAVEACCRUAL]: () => {},
    [GET_MEMBERLIST]: () => {},
    [POST_LEAVEACCRUAL]: () => {}
    
});

const leaveReducer = handleActions({
    [GET_LEAVESUBMIT]: (state, {payload}) => ({leaveInfo: payload.leaveInfo, submitPage: payload.submitPage}),
    [POST_LEAVESUBMIT]: (state, {payload}) => ({insertMessage: payload}),
    [PUT_LEAVESUBMIT]: (state, {payload}) => ({updateMessage: payload}),
    [DELETE_LEAVESUBMIT]: (state, {payload}) => ({deleteMessage: payload}),
    [SET_PAGENUMBER]: (state, {payload}) => ({
        ...state,
        submitPage: {
            ...state.submitPage,
            number: payload
        }
    }),
    [GET_LEAVEACCRUAL]: (state, {payload}) => ({...state, accrualPage: payload.accrualPage}),
    [GET_MEMBERLIST]: (state, {payload}) => ({...state, memberList: payload.memberList}),
    [POST_LEAVEACCRUAL]: (state, {payload}) => ({insertMessage: payload})
}, initialState);

export default leaveReducer;
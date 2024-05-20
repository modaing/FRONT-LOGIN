import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_PAGE = 'leave/GET_PAGE';
export const GET_LEAVEINFO = 'leave/GET_LEAVEINFO';
export const SET_PAGENUMBER = 'leave/SET_PAGENUMBER';
export const GET_MEMBERLIST = 'leave/GET_MEMBERLIST';
export const POST_MESSAGE = 'leave/POST_MESSAGE';
export const PUT_MESSAGE = 'leave/PUT_MESSAGE';
export const DELETE_MESSAGE = 'leave/DELETE_MESSAGE';

const actions = createActions({
    [GET_PAGE]: () => {},
    [GET_LEAVEINFO]: () => {},
    [SET_PAGENUMBER]:() => {},     
    [GET_MEMBERLIST]: () => {},
    [POST_MESSAGE]: () => {},
    [PUT_MESSAGE]: () => {},
    [DELETE_MESSAGE]: () => {},
});

const leaveReducer = handleActions({
    [GET_PAGE]: (state, {payload}) => ({...state, page: payload}),
    [GET_LEAVEINFO]: (state, {payload}) => ({...state, leaveInfo: payload}),
    [SET_PAGENUMBER]: (state, {payload}) => ({
        ...state,
        page: {
            ...state.page,
            number: payload
        }
    }),
    [GET_MEMBERLIST]: (state, {payload}) => ({...state, memberList: payload.memberList}),
    [POST_MESSAGE]: (state, {payload}) => ({insertMessage: payload}),
    [PUT_MESSAGE]: (state, {payload}) => ({updateMessage: payload}),
    [DELETE_MESSAGE]: (state, {payload}) => ({deleteMessage: payload}),
}, initialState);

export default leaveReducer;
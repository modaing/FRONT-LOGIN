import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_PAGE = 'survey/GET_PAGE';
export const SET_PAGENUMBER = 'survey/SET_PAGENUMBER';
export const POST_MESSAGE = 'survey/POST_MESSAGE';
export const PUT_MESSAGE = 'survey/PUT_MESSAGE';
export const DELETE_MESSAGE = 'survey/DELETE_MESSAGE';

const actions = createActions({
    [GET_PAGE]: () => {},
    [SET_PAGENUMBER]:() => {},       
    [POST_MESSAGE]: () => {},
    [PUT_MESSAGE]: () => {},
    [DELETE_MESSAGE]: () => {},
});

const surveyReducer = handleActions({
    [GET_PAGE]: (state, {payload}) => ({...state, page: payload}),
    [SET_PAGENUMBER]: (state, {payload}) => ({
        ...state,
        page: {
            ...state.page,
            number: payload
        }
    }),
    [POST_MESSAGE]: (state, {payload}) => ({insertMessage: payload}),
    [PUT_MESSAGE]: (state, {payload}) => ({updateMessage: payload}),
    [DELETE_MESSAGE]: (state, {payload}) => ({deleteMessage: payload}),

}, initialState);

export default surveyReducer;
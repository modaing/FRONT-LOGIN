import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_DEPARTNPOSITIONSUBMIT = 'departmentAndPositions/GET_LEAVESUBMIT';
export const POST_DEPARTNPOSITIONSUBMIT = 'departmentAndPositions/POST_LEAVESUBMIT';
export const PUT_DEPARTNPOSITIONSUBMIT = 'departmentAndPositions/PUT_LEAVESUBMIT';
export const DELETE_DEPARTNPOSITIONSUBMIT = 'departmentAndPositions/DELETE_LEAVESUBMIT';
export const SET_PAGENUMBER = 'departmentAndPositions/SET_PAGENUMBER';

const actions = createActions({
    [GET_DEPARTNPOSITIONSUBMIT]: () => {},
    [POST_DEPARTNPOSITIONSUBMIT]: () => {},
    [PUT_DEPARTNPOSITIONSUBMIT]: () => {},
    [DELETE_DEPARTNPOSITIONSUBMIT]: () => {},
    [SET_PAGENUMBER]:() => {}     
});

const leaveReducer = handleActions({
    [GET_DEPARTNPOSITIONSUBMIT]: (state, {payload}) => ({leaveInfo: payload.leaveInfo, submitPage: payload.submitPage}),
    [POST_DEPARTNPOSITIONSUBMIT]: (state, {payload}) => ({insertMessage: payload}),
    [PUT_DEPARTNPOSITIONSUBMIT]: (state, {payload}) => ({updateMessage: payload}),
    [DELETE_DEPARTNPOSITIONSUBMIT]: (state, {payload}) => ({deleteMessage: payload}),
    [SET_PAGENUMBER]: (state, {payload}) => ({
        ...state,
        submitPage: {
            ...state.submitPage,
            number: payload
        }
    })
}, initialState);

export default leaveReducer;
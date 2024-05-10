import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_CALENDAR = 'calendar/GET_CALENDAR';
export const POST_CALENDAR = 'calendar/POST_CALENDAR';
export const PUT_CALENDAR = 'calendar/PUT_CALENDAR';
export const DELETE_CALENDAR = 'calendar/DELETE_CALENDAR';

const actions = createActions({
    [GET_CALENDAR]: () => {},
    [POST_CALENDAR]: () => {},
    [PUT_CALENDAR]: () => {},
    [DELETE_CALENDAR]: () => {}
});

const calendarReducer = handleActions({
    [GET_CALENDAR]: (state, {payload}) => ({calendarList: payload.calendarList}),
    [POST_CALENDAR]: (state, {payload}) => ({insertMessage: payload}),
    [PUT_CALENDAR]: (state, {payload}) => ({updateMessage: payload}),
    [DELETE_CALENDAR]: (state, {payload}) => {}
}, initialState);

export default calendarReducer;
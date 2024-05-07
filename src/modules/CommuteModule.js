import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_COMMUTE = 'commute/GET_COMMUTE';
export const GET_COMMUTES = 'commute/GET_COMMUTES';
export const POST_COMMUTE = 'commute/POST_COMMUTE';
export const PUT_COMMUTE = 'commute/PUT_COMMUTE';

const actions = createActions({
    [GET_COMMUTE]: () => { },
    [GET_COMMUTES]: () => { },
    [POST_COMMUTE]: () => { },
    [PUT_COMMUTE]: () => { }
});

/* 리듀서 */
const commuteReducer = handleActions(
    {
        [GET_COMMUTE]: (state, { payload }) => {
            return payload;
        },
        [GET_COMMUTE]: (state, { payload }) => {
            return payload;
        },
        [POST_COMMUTE]: (state, { payload }) => {
            return payload;
        },
        [PUT_COMMUTE]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default commuteReducer;
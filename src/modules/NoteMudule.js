import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_RECEIVE_NOTES = 'note/GET_RECEIVE_NOTES';
export const GET_SEND_NOTES = 'note/GET_SEND_NOTES';
export const PUT_SEND_NOTES = 'note/PUT_SEND_NOTES';
export const PUT_RECEIVE_NOTES = 'note/PUT_RECEIVE_NOTES';

// 액션
const actions = createActions({
    [GET_RECEIVE_NOTES]: () => {},
    [GET_SEND_NOTES]: () => {},
    [PUT_SEND_NOTES]: (sendNoteList) => ({ sendNoteList }),
    [PUT_RECEIVE_NOTES]: (receiveNoteList) => ({ receiveNoteList }),
});

리듀서
const noteReducer = handleActions(
    {
        [GET_RECEIVE_NOTES]: (state, { payload }) => ({ receiveNoteList: payload }),
        [GET_SEND_NOTES]: (state, { payload }) => ({ sendNoteList: payload }),
        [PUT_SEND_NOTES]: (state, { payload }) => ({ ...state, sendNoteList: payload }),
        [PUT_RECEIVE_NOTES]: (state, { payload }) => ({ ...state, receiveNoteList: payload }), 
    },
    initialState
);

export default noteReducer;

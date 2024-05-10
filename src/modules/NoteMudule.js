import { createActions, handleActions } from 'redux-actions';


const initialState = {

     receiveNoteList: { notes: [] },
     sendNoteList: { notes: [] }

};

export const GET_RECEIVE_NOTES = 'note/GET_RECEIVE_NOTES';
export const GET_SEND_NOTES = 'note/GET_SEND_NOTES';

const actions = createActions({
    [GET_RECEIVE_NOTES]: () => { },
    [GET_SEND_NOTES]: () => { }
});


const noteReducer = handleActions(
    {
        [GET_RECEIVE_NOTES]: (state, { payload }) => ({ receiveNoteList: payload }),
        [GET_SEND_NOTES]: (state, { payload }) => ({ sendNoteList: payload })
    }, initialState);
export default noteReducer;

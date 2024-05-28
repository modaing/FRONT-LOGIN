import { create } from 'canvas-confetti';
import { createActions, handleActions } from 'redux-actions';

const initialState = {
    messages: []
  };

const initialRoomState = {
    postRoom: null,
    deleteRoom: null,
    loading: false,
    error: null,
};

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const POST_ROOM = 'room/POST_ROOM';
export const DELETE_ROOM = 'room/DELETE_ROOM';
export const POST_MESSAGES = 'POST_MESSAGES';
export const GET_MESSAGES = 'GET_MESSAGES';
export const PUT_ROOM_STATUS = 'PUT_ROOM';


export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message
});

const actions = createActions({
    [POST_ROOM]: ()=> {},
    [DELETE_ROOM]: () => {},
    [POST_MESSAGES]: () => {},
    [GET_MESSAGES]: () => {},
    [PUT_ROOM_STATUS]: () => {}
});


export const chattingReducer = (state = initialState, action) => {

  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    default:
      return state;
  }
};


export const roomReducer = handleActions (
  {
    [POST_ROOM]: (state, {payload}) => ({postRoom: payload}),
    [DELETE_ROOM]: (state, {payload}) => ({deleteRoom: payload}),
    [POST_MESSAGES]: (state, { payload }) => ({postMessage: payload}),
    [GET_MESSAGES]: (state, {payload}) => ({ getMessages: payload }),
    [PUT_ROOM_STATUS]: (status, {payload}) => ({ putRoomStatus: payload })
  } , initialRoomState
)

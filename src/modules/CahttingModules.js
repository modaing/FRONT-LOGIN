import { create } from 'canvas-confetti';
import { createActions, handleActions } from 'redux-actions';

const initialState = {
    messages: []
  };

const initialRoomState = {
    postRoom: null,
    loading: false,
    error: null,
};

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const POST_ROOM = 'room/POST_ROOM';


export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message
});

const actions = createActions({
    [POST_ROOM]: ()=> {}
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
    [POST_ROOM]: (state, {payload}) => ({postRoom: payload})
  } , initialRoomState
)

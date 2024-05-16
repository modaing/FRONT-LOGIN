import { createActions, handleActions } from 'redux-actions';

const initialState = {
    messages: []
  };

export const ADD_MESSAGE = 'ADD_MESSAGE';

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message
});


const chattingReducer = (state = initialState, action) => {
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

export default chattingReducer;

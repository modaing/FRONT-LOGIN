// Define action types
const SET_PASSWORD_1 = 'SET_PASSWORD_1';
const SET_PASSWORD_2 = 'SET_PASSWORD_2';

// Define initial state
const initialState = {
  password1: '',
  password2: ''
};

// Define the reducer function
const passwordReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PASSWORD_1:
      return {
        ...state,
        password1: action.payload
      };
    case SET_PASSWORD_2:
      return {
        ...state,
        password2: action.payload
      };
    default:
      return state;
  }
};

// Define action creators
export const setPassword1Action = (password) => ({
  type: SET_PASSWORD_1,
  payload: password
});

export const setPassword2Action = (password) => ({
  type: SET_PASSWORD_2,
  payload: password
});

export default passwordReducer;

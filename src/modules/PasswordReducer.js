// const passwordReducer = {
//     // Define your reducer or variable here
//   };
  
//   export const SET_PASSWORD_1 = 'SET_PASSWORD_1';
//   export const SET_PASSWORD_2 = 'SET_PASSWORD_2';
  
//   export const setPassword1Action = (password) => ({
//       type: SET_PASSWORD_1,
//       payload: password,
//   });
  
//   export const setPassword2Action = (password) => ({
//       type: SET_PASSWORD_2,
//       payload: password,
//   });
  
//   export default passwordReducer;

// PasswordReducer.js

// Define initial state
const initialState = {
  password1: '',
  password2: ''
};

// Define action types
export const setPassword1Action = (password) => ({
    type: setPassword1Action,
    payload: password
  });
  
  export const setPassword2Action = (password) => ({
    type: setPassword2Action,
    payload: password
  });

// Define reducer function
const passwordReducer = (state = initialState, action) => {
  switch (action.type) {
    case setPassword1Action:
      return {
        ...state,
        password1: action.payload
      };
    case setPassword2Action:
      return {
        ...state,
        password2: action.payload
      };
    default:
      return state;
  }
};

export default passwordReducer;

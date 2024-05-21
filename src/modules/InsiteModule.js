import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_MEMBER_DEPART = 'insite/GET_MEMBER_DEPART';


// 액션
const actions = createActions({
    [GET_MEMBER_DEPART]: () => {},

});

//리듀서
const insiteReducer = handleActions(
    {
        [GET_MEMBER_DEPART]: (state, { payload }) => ({ memberDepart: payload }),
            
    },
    initialState
);

export default insiteReducer;

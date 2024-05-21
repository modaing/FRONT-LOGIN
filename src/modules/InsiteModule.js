import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_MEMBER_DEPART = 'insite/GET_MEMBER_DEPART';
export const GET_LEAVE_MEMBER = 'insite/GET_LEAVE_MEMBER';
export const GET_COMMUTE_MEMBER = 'insite/GET/COMMUTE/MEMBER';



// 액션
const actions = createActions({
    [GET_MEMBER_DEPART]: () => {},
    [GET_LEAVE_MEMBER]: () => {},
    [GET_COMMUTE_MEMBER]: () => {}

});

//리듀서
const insiteReducer = handleActions(
    {
        [GET_MEMBER_DEPART]: (state, { payload }) => ({ memberDepart: payload }),
        [GET_LEAVE_MEMBER]: (state, { payload }) => ( {leaveMember: payload } ),
        [GET_COMMUTE_MEMBER]: (state, { payload }) => ( {commuteMember: payload } ),
            
    },
    initialState
);

export default insiteReducer;

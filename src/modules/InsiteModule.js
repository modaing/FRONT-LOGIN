import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_MEMBER_DEPART = 'insite/GET_MEMBER_DEPART';
export const GET_LEAVE_MEMBER = 'insite/GET_LEAVE_MEMBER';
export const GET_COMMUTE_MEMBER = 'insite/GET/COMMUTE/MEMBER';
export const GET_APPROVAL_COUNTS = 'insite/GET/APPROVAL_COUNTS';
export const GET_APPROVER_COUNTS = 'insite/GET/APPROVER_COUNTS';
export const GET_MY_LEAVES_COUNT = 'insite/GET/MY_LEAVE_COUNTS';




// 액션
const actions = createActions({
    [GET_MEMBER_DEPART]: () => {},
    [GET_LEAVE_MEMBER]: () => {},
    [GET_COMMUTE_MEMBER]: () => {},
    [GET_APPROVAL_COUNTS]: () => {},
    [GET_APPROVER_COUNTS]: () => {},
    [GET_MY_LEAVES_COUNT]: () => {}

});

//리듀서
const insiteReducer = handleActions(
    {
        [GET_MEMBER_DEPART]: (state, { payload }) => ({ memberDepart: payload }),
        [GET_LEAVE_MEMBER]: (state, { payload }) => ( {leaveMember: payload } ),
        [GET_COMMUTE_MEMBER]: (state, { payload }) => ( {commuteMember: payload } ),
        [GET_APPROVAL_COUNTS]: (state, { payload }) => ( {approvalCounts: payload} ),
        [GET_APPROVER_COUNTS]: (state, { payload }) => ( {approverCounts: payload} ),
        [GET_MY_LEAVES_COUNT]: (state, { payload }) => ( {myleaveCounts: payload})
    },
    initialState
);

export default insiteReducer;

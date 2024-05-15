import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = [];

// const initialState = [{
//     commuteNo: 0,
//     correction: {
//         commuteNo: 0,
//         corrNo: 0,
//         corrProcessingDate: '',
//         corrRegistrationDate: [],
//         corrStatus: '',
//         reasonForCorr: '',
//         reasonForRejection: '',
//         reqEndWork: '',
//         reqStartWork: ''
//     },
//     endWork: [],
//     memberId: '',
//     startWork: [],
//     totalWorkingHours: 0,
//     workingDate: [],
//     workingStatus: ''
// }];

/* 액션 타입 */
export const GET_COMMUTENO = 'commute/GET_COMMUTENO';
export const GET_COMMUTELIST = 'commute/GET_COMMUTELIST';
export const POST_COMMUTE = 'commute/POST_COMMUTE';
export const PUT_COMMUTE = 'commute/PUT_COMMUTE';

/* 액션 함수 */
export const { commute: { getCommuteNo, getCommutelist, postCommute, putCommute } } = createActions({
    [GET_COMMUTENO]: (res) => ({ commuteno: res }),
    [GET_COMMUTELIST]: (res) => ({ commutelist: res }),
    [POST_COMMUTE]: (res) => ({ postcommute: res }),
    [PUT_COMMUTE]: (res) => ({ putcommute: res })
});

/* 리듀서 */
const commuteReducer = handleActions(
    {
        [GET_COMMUTENO]: (state, { payload }) => {
            return ({ ...state, commuteno: payload });
        },
        [GET_COMMUTELIST]: (state, { payload }) => {
            return payload;
        },
        [POST_COMMUTE]: (state, { payload }) => {
            return ({ ...state, postcommute: payload });
        },
        [PUT_COMMUTE]: (state, { payload }) => {
            return ({ ...state, putcommute: payload });
        }
    },
    initialState
);

export default commuteReducer;
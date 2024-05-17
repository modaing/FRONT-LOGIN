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
// export const GET_COMMUTENO = 'commute/GET_COMMUTENO';
export const GET_COMMUTELIST = 'commute/GET_COMMUTELIST';
export const POST_COMMUTE = 'commute/POST_COMMUTE';
export const PUT_COMMUTE = 'commute/PUT_COMMUTE';

export const GET_CORRECTION = 'correction/GET_CORRECTION';
export const GET_CORRECTIONLIST = 'correction/GET_CORRECTIONLIST';
export const POST_CORRECTION = 'correction/POST_CORRECTION';
export const PUT_CORRECTION = 'correction/PUT_CORRECTION';

/* 액션 함수 */
export const { commute: { getCommutelist, postCommute, putCommute, getCorrection, getCorrectionlist, postCorrection, putCorrection } } = createActions({
    // [GET_COMMUTENO]: (res) => ({ commuteno: res }),
    [GET_COMMUTELIST]: (res) => ({ commutelist: res }),
    [POST_COMMUTE]: (res) => ({ postcommute: res }),
    [PUT_COMMUTE]: (res) => ({ putcommute: res }),
    [GET_CORRECTION]: (res) => ({ correction: res }),
    [GET_CORRECTIONLIST]: (res) => ({ correctionlist: res }),
    [POST_CORRECTION]: (res) => ({ postcorrection: res }),
    [PUT_CORRECTION]: (res) => ({ putcorrection: res })
});

/* 리듀서 */
const commuteReducer = handleActions(
    {
        // [GET_COMMUTENO]: (state, { payload }) => {
        //     return ({ ...state, commuteno: payload });
        // },
        [GET_COMMUTELIST]: (state, { payload }) => {
            return payload;
        },
        [POST_COMMUTE]: (state, { payload }) => {
            return ({ ...state, postcommute: payload });
        },
        [PUT_COMMUTE]: (state, { payload }) => {
            return ({ ...state, putcommute: payload });
        },
        [GET_CORRECTION]: (state, { payload }) => {
            return payload;
        },
        [GET_CORRECTIONLIST]: (state, { payload }) => {
            return payload;
        },
        [POST_CORRECTION]: (state, { payload }) => {
            return ({ ...state, postcorrection: payload });
        },
        [PUT_CORRECTION]: (state, { payload }) => {
            return ({ ...state, putcorrection: payload });
        }
    },
    initialState
);

export default commuteReducer;
import { createActions, handleActions } from "redux-actions";
import { callSelectCommuteListAPI } from "../apis/CommuteAPICalls";

/* 초기값 */
const initialState = {
    commutelist: [],
    correctionlist: {
        correctionlist: [],
        currentPage: 0,
        totalPages: 0,
    },
};

/* 액션 타입 */
export const GET_COMMUTELIST = 'commute/GET_COMMUTELIST';
export const POST_COMMUTE = 'commute/POST_COMMUTE';
export const PUT_COMMUTE = 'commute/PUT_COMMUTE';

export const GET_CORRECTION = 'commute/GET_CORRECTION';
export const GET_CORRECTIONLIST = 'commute/GET_CORRECTIONLIST';
export const POST_CORRECTION = 'commute/POST_CORRECTION';
export const PUT_CORRECTION = 'commute/PUT_CORRECTION';

export const SET_PAGENUMBER = 'commute/SET_PAGENUMBER';

/* 액션 함수 */
export const { commute: { getCommutelist, postCommute, putCommute, getCorrection, getCorrectionlist, postCorrection, putCorrection, setPagenumber } } = createActions({
    [GET_COMMUTELIST]: (res) => ({ commutelist: res }),
    [POST_COMMUTE]: (res) => ({ postcommute: res }),
    [PUT_COMMUTE]: (res) => ({ putcommute: res }),
    [GET_CORRECTION]: (res) => ({ correction: res }),
    [GET_CORRECTIONLIST]: (res) => ({ correctionlist: res }),
    [POST_CORRECTION]: (res) => ({ postcorrection: res }),
    [PUT_CORRECTION]: (res) => ({ putcorrection: res }),
    [SET_PAGENUMBER]: (page) => ({ page: page })
});

/* 비동기 액션 생성자 */
// export const fetchCommuteListAsync = (memberId, member, date) => async (dispatch) => {
//     try {
//         // API를 호출하여 출퇴근 내역 전체 가져오기
//         const data = await callSelectCommuteListAPI(memberId, member, date);
//         dispatch(getCommutelist(data));
//     } catch (error) {
//         console.error('Error fetching commute list:', error.message);
//     }
// };

/* 리듀서 */
const commuteReducer = handleActions(
    {
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
            return ({ ...state, correctionlist: payload });
        },
        [POST_CORRECTION]: (state, { payload }) => {
            return ({ ...state, postcorrection: payload });
        },
        [PUT_CORRECTION]: (state, { payload }) => {
            return ({ ...state, putcorrection: payload });
        },
        [SET_PAGENUMBER]: (state, { payload }) => {
            return ({
                ...state,
                currentPage: payload.page,
            })
        }
    },
    initialState
);

export default commuteReducer;
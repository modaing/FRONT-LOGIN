import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = [];

/* 액션 타입 */
export const GET_NOTICE = 'notice/GET_NOTICE';
export const ADD_NEW_NOTICE = 'notice/ADD_NEW_NOTICE';
export const DELETE_NOTICE = 'notice/DELETE_NOTICE';
export const DELETE_NOTICELIST = 'notice/DELETE_NOTICELIST';

/* 액션 함수 */
export const { notice: { getNotice, addNewNotice, deleteNotice, deleteNoticelist } } = createActions({
    [GET_NOTICE]: (res) => ({ notice: res }),
    [ADD_NEW_NOTICE]: (newNotice) => ({ newNotice }),
    [DELETE_NOTICE]: (res) => ({ deletenotice: res }),
    [DELETE_NOTICELIST]: (res) => ({ deletenoticelist: res })
});

/* 리듀서 */
const noticeReducer = handleActions(
    {
        [GET_NOTICE]: (state, { payload }) => ({
            ...state,
            noticeList: payload.notice,
        }),
        [ADD_NEW_NOTICE]: (state, { payload }) => ({
            ...state,
            noticeList: [...state.noticeList, payload.newNotice],
        }),
        [DELETE_NOTICE]: (state, { payload }) => ({
            ...state,
            deletenotice: payload,
        }),
        [DELETE_NOTICELIST]: (state, { payload }) => ({
            ...state,
            deletenoticelist: payload,
        })
    },
    initialState
);

export default noticeReducer;
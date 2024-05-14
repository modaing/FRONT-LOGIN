import { createAction, handleActions } from 'redux-actions';
import { ancListAPI } from '../apis/AncAPICalls';

/* 초기값 */
const initialState = {
  announcements: [],
  currentPage: 0,
  totalPages: 0
};

/* 액션 */
export const fetchAnnouncements = createAction('FETCH_ANNOUNCEMENTS');
export const setCurrentPage = createAction('SET_CURRENT_PAGE');

/* 비동기 액션 생성자 */
export const fetchAnnouncementsAsync = (page) => async (dispatch) => {
  try {
    // API를 호출하여 데이터 가져오기
    const data = await ancListAPI(page);
    dispatch(fetchAnnouncements(data.results)); // 액션에 데이터 전달
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
  }
};

/* 리듀서 */
const announceReducer = handleActions(
  {
    [fetchAnnouncements]: (state, { payload }) => ({
      ...state,
      announcements: payload.ancList,
      currentPage: payload.currentPage, 
      totalPages: payload.totalPages 
    }),
    [setCurrentPage]: (state, { payload }) => ({
      ...state,
      currentPage: payload.page
    })
  },
  initialState
);

export default announceReducer;

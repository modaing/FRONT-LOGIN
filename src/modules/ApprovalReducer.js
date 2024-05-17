
const SET_FG = 'SET_FG';
const SET_TITLE = 'SET_TITLE';
const SET_PAGE_INFO = 'SET_PAGE_INFO';
const FETCH_APPROVALS_SUCCESS = 'FETCH_APPROVALS_SUCCESS';
const FETCH_APPROVALS_FAILURE = 'FETCH_APPROVALS_FAILURE';
const DELETE_APPROVAL_SUCCESS = 'DELETE_APPROVAL_SUCCESS';
const DELETE_APPROVAL_FAILURE = 'DELETE_APPROVAL_FAILURE';


export const setFg = (fg) => ({
  type: SET_FG,
  payload: fg,
});

export const setTitle = (title) => ({
  type: SET_TITLE,
  payload: title,
});

export const setPageInfo = (pageInfo) => ({
  type: SET_PAGE_INFO,
  payload: pageInfo,
});

export const fetchApprovalsSuccess = (approvals) => ({
  type: FETCH_APPROVALS_SUCCESS,
  payload: approvals,
});

export const fetchApprovalsFailure = (error) => ({
  type: FETCH_APPROVALS_FAILURE,
  payload: error,
});

export const deleteApprovalSuccess = (approvalNo) => ({
  type: DELETE_APPROVAL_SUCCESS,
  payload: approvalNo,
});

export const deleteApprovalFailure = (error) => ({
  type: DELETE_APPROVAL_FAILURE,
  payload: error,
});


const initialState = {
  fg: 'given',
  title: '',
  pageInfo: { totalPages: 0, currentPage: 0 },
  approvals: [],
  error: null,
};

const approvalReducer = (state = initialState, action = {}) => {
    console.log('Action received:', action);  // 디버깅을 위해 추가
    switch (action.type) {
      case SET_FG:
        return {
          ...state,
          fg: action.payload,
          pageInfo: { totalPages: 0, currentPage: 0 },
        };
      case SET_TITLE:
        return {
          ...state,
          title: action.payload,
          pageInfo: { totalPages: 0, currentPage: 0 },
        };
      case SET_PAGE_INFO:
        return {
          ...state,
          pageInfo: action.payload,
        };
      case FETCH_APPROVALS_SUCCESS:
        return {
          ...state,
          approvals: action.payload,
          error: null,
        };
      case FETCH_APPROVALS_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      case DELETE_APPROVAL_SUCCESS:
        return {
          ...state,
          approvals: state.approvals.filter((a) => a.approvalNo !== action.payload),
          error: null,
        };
      case DELETE_APPROVAL_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  

export default approvalReducer;

import { createActions, handleActions } from "redux-actions";
import { submitApprovalAPI, updateApprovalAPI } from "../apis/ApprovalAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  fg: 'given',
  title: '',
  pageInfo: { totalPages: 0, currentPage: 0 },
  approvals: [],
  members: [],
  forms: [],
  files:[],
  uploadStatus: null,
  approvalStatus : null,
  loading: false,
  error: null,
};

export const submitApproval = createAsyncThunk (
  'approvals/submitApproval',
  async (formData, { rejectWithValue }) => {
    try{
      const response = await submitApprovalAPI(formData);
      console.log('submitApprovalAPI 호출 결과 : ' + response)
      return response;
    } catch (error){
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApproval = createAsyncThunk (
  'approvals/updateApproval',
  async ({ approvalNo, formData }, { rejectWithValue }) => {
    try {
      const response = await updateApprovalAPI(approvalNo, formData);
      return response;
    } catch (error){
      return rejectWithValue(error.response.data);
    }
  }
);


// 액션 타입 및 액션 생성자 정의
// export const {
//   setFg,
//   setTitle,
//   setPageInfo,
//   fetchApprovalsSuccess,
//   fetchApprovalsFailure,
//   deleteApprovalSuccess,
//   deleteApprovalFailure,
//   updateApprovalStatus,
//   setLoading,
//   fetchFormsSuccess,
//   fetchFormsFailure,
//   getAllMembers,
//   submitApprovalSuccess,
//   submitApprovalFailure,
// } = createActions({
//   SET_FG: (fg) => fg,
//   SET_TITLE: (title) => title,
//   SET_PAGE_INFO: (pageInfo) => pageInfo,
//   FETCH_APPROVALS_SUCCESS: (approvals) => approvals,
//   FETCH_APPROVALS_FAILURE: (error) => error,
//   DELETE_APPROVAL_SUCCESS: (approvalNo) => approvalNo,
//   DELETE_APPROVAL_FAILURE: (error) => error,
//   UPDATE_APPROVAL_STATUS: (approvalNo, status) => ({ approvalNo, status }),
//   SET_LOADING: (loading) => loading,
//   FETCH_FORMS_SUCCESS: (forms) => forms,
//   FETCH_FORMS_FAILURE: (error) => error,
//   GET_ALL_MEMBERS: (members) => members,
//   SUBMIT_APPROVAL_SUCCESS: () => {},
//   SUBMIT_APPROVAL_FAILURE: (error) => error,
// });

// // 리듀서 정의
// const approvalReducer = handleActions(
//   {
//     [setFg]: (state, { payload }) => ({
//       ...state,
//       fg: payload,
//       pageInfo: { totalPages: 0, currentPage: 0 },
//     }),
//     [setTitle]: (state, { payload }) => ({
//       ...state,
//       title: payload,
//       pageInfo: { totalPages: 0, currentPage: 0 },
//     }),
//     [setPageInfo]: (state, { payload }) => ({
//       ...state,
//       pageInfo: payload,
//     }),
//     [fetchApprovalsSuccess]: (state, { payload }) => ({
//       ...state,
//       approvals: payload,
//       error: null,
//     }),
//     [fetchApprovalsFailure]: (state, { payload }) => ({
//       ...state,
//       error: payload,
//     }),
//     [deleteApprovalSuccess]: (state, { payload }) => ({
//       ...state,
//       approvals: state.approvals.filter((a) => a.approvalNo !== payload),
//       error: null,
//     }),
//     [deleteApprovalFailure]: (state, { payload }) => ({
//       ...state,
//       error: payload,
//     }),
//     [updateApprovalStatus]: (state, { payload }) => ({
//       ...state,
//       approvals: state.approvals.map((approval) =>
//         approval.approvalNo === payload.approvalNo
//           ? { ...approval, approvalStatus: payload.status }
//           : approval
//       ),
//     }),
//     [setLoading]: (state, { payload }) => ({
//       ...state,
//       loading: payload,
//     }),
//     [fetchFormsSuccess]: (state, { payload }) => ({
//       ...state,
//       forms: payload,
//       error: null,
//     }),
//     [fetchFormsFailure]: (state, { payload }) => ({
//       ...state,
//       error: payload,
//     }),
//     [getAllMembers]: (state, { payload }) => ({
//       ...state, 
//       members: payload,
//     }),
//     [submitApprovalSuccess]: (state) => ({
//       ...state,
//       approvalStatus: 'success',
//       error: null,
//     }),
//     [submitApprovalFailure]: (state, { payload }) => ({
//       ...state,
//       approvalStatus : 'failure',
//       error: payload,
//     })
//   },
//   initialState
// );

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    setFg: (state, action) => {
      state.fg = action.payload;
      state.pageInfo = { totalPages: 0, currentPage: 0 };
    },
    setTitle: (state, action) => {
      state.title = action.payload;
      state.pageInfo = { totalPages: 0, currentPage: 0 };
    },
    setPageInfo: (state, action) => {
      state.pageInfo = action.payload;
    },
    fetchApprovalsSuccess: (state, action) => {
      state.approvals = action.payload;
      state.error = null;
    },
    fetchApprovalsFailure: (state, action) => {
      state.error = action.payload;
    },
    deleteApprovalSuccess: (state, action) => {
      state.approvals = state.approvals.filter((a) => a.approvalNo !== action.payload);
      state.error = null;
    },
    deleteApprovalFailure: (state, action) => {
      state.error = action.payload;
    },
    updateApprovalStatus: (state, action) => {
      state.approvals = state.approvals.map((approval) =>
        approval.approvalNo === action.payload.approvalNo
          ? { ...approval, approvalStatus: action.payload.status }
          : approval
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    fetchFormsSuccess: (state, action) => {
      state.forms = action.payload;
      state.error = null;
    },
    fetchFormsFailure: (state, action) => {
      state.error = action.payload;
    },
    getAllMembers: (state, action) => {
      state.members = action.payload;
    },
  },
  extraReducers : (builder) => {
    builder
      .addCase(submitApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApproval.fulfilled, (state, action) => {
        state.loading = false;
        state.approvals.push(action.payload);
        state.approvalStatus = 'success';
      })
      .addCase(submitApproval.rejected, (state, action) => {
        state.loading = false;
        state.approvalStatus = 'failure';
        state.error = action.payload;
      })
      .addCase(updateApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApproval.fulfilled, (state, action) =>{
        state.loading = false;
        const index = state.approvals.findIndex((a) => a.approvalNo === action.payload.approvalNo);
        if(index !== -1){
          state.approvals[index] = action.payload;
        }
      } )
      .addCase(updateApproval.rejected, (state, action )=> {
        state.loading = false;
        state.error = action.payload;
      });
  },
})

export const {
  setFg,
  setTitle,
  setPageInfo,
  fetchApprovalsSuccess,
  fetchApprovalsFailure,
  deleteApprovalSuccess,
  deleteApprovalFailure,
  updateApprovalStatus,
  setLoading,
  fetchFormsSuccess,
  fetchFormsFailure,
  getAllMembers,
} = approvalSlice.actions;


export default approvalSlice.reducer;

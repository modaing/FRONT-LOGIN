import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const GET_PAGE = 'survey/GET_PAGE';
export const SET_PAGENUMBER = 'survey/SET_PAGENUMBER';

const actions = createActions({
    [GET_PAGE]: () => {},
    [SET_PAGENUMBER]:() => {},       
});

const surveyReducer = handleActions({
    [GET_PAGE]: (state, {payload}) => ({...state, page: payload}),
    [SET_PAGENUMBER]: (state, {payload}) => ({
        ...state,
        page: {
            ...state.page,
            number: payload
        }
    }),
}, initialState);

export default surveyReducer;
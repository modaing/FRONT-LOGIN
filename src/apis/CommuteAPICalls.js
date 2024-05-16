import { getCommutelist, postCommute, putCommute } from "../modules/CommuteModule";
import { decodeJwt } from "../utils/tokenUtils";
import { request } from "./CommonAPI";

/* 출퇴근 내역 조회 api  */
export const callSelectCommuteListAPI = (target, targetValue, date) => {
    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch) => {
        try {
            console.log('[target] : ', target);
            console.log('[targetValue] : ', targetValue);
            console.log('[date] : ', date);

            const url = `/commutes?target=${target}&targetValue=${targetValue}&date=${date}`;
            console.log('url : ', url);
            // const url = `/commutes?target=member&targetValue=240401835&date=2024-05-09`;
            const response = await request('GET', url);

            console.log('[callSelectCommuteListAPI] response : ', response.response.data.results.result);

            /* action 생성 함수에 결과 전달하며 dispatch 호출 */
            dispatch(getCommutelist(response.response.data.results.result));

        } catch (error) {
            console.error('[callSelectCommuteListAPI] Error : ', error);
        }
    }
};

/* 출근 시간 등록 api */
export const callInsertCommuteAPI = (newCommute) => {
    return async (dispatch) => {
        try {
            const url = `/commutes`;
            const response = await request('POST', url, newCommute);

            console.log('[callInsertCommuteAPI] response : ', response);

            dispatch(postCommute(response));

        } catch (error) {
            console.log('[callInsertCommuteAPI] error : ', error);
        }
    }
};

/* 퇴근 시간 등록 api */
export const callUpdateCommuteAPI = (updateCommute) => {
    return async (dispatch) => {
        try {
            console.log('[callUpdateCommuteAPI] updateCommute.commuteNo : ', updateCommute.commuteNo);

            const url = `/commutes/${updateCommute.commuteNo}`;
            const response = await request('PUT', url, updateCommute);

            console.log('[callUpdateCommuteAPI] response : ', response);

            dispatch(putCommute(response));

        } catch (error) {
            console.log('[callUpdateCommuteAPI] error : ', error);
        }
    }
};

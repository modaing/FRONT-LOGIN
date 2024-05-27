import { getCommute, getCommutelist, getCorrectionlist, postCommute, postCorrection, putCommute, putCorrection } from "../modules/CommuteModule";
import { request } from "./CommonAPI";

/* 출퇴근 내역 조회 API  */
export const callSelectCommuteListAPI = (target, targetValue, date) => {
    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch) => {
        try {
                console.log('[target] : ', target);
                console.log('[targetValue] : ', targetValue);
                console.log('[date] : ', date);
    
                const url = `/commutes?target=${target}&targetValue=${targetValue}&date=${date}`;
                console.log('url : ', url);
                const response = await request('GET', url);
    
                console.log('[callSelectCommuteListAPI] response : ', response.response.data.results.result);
    
                /* action 생성 함수에 결과 전달하며 dispatch 호출 */
                dispatch(getCommutelist(response.response.data.results.result));    
            
        } catch (error) {
            console.error('[callSelectCommuteListAPI] Error : ', error);
        }
    }
};

/* 출근 시간 등록 API */
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

/* 퇴근 시간 등록 API */
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

/* 출퇴근 정정 등록 API */
export const callInsertCorrectionAPI = (newCorrection) => {
    return async (dispatch) => {
        try {
            console.log('api에서 출퇴근번호 : ', newCorrection.commuteNo);
            console.log('api에서 출퇴근 : ', newCorrection);

            const url = `/corrections`;
            const response = await request('POST', url, newCorrection);

            console.log('[callInsertCorrectionAPI] response : ', response);

            dispatch(postCorrection(response));


        } catch (error) {
            console.log('[callInsertCorrectionAPI] error : ', error);
        }
    }
};

/* 출퇴근 정정 내역 조회 API */
export const callSelectCorrectionListAPI = (memberId, page, size, sort, direction, date) => {
    return async (dispatch) => {
        try {
            // let url;

            if (memberId === null) {
                // console.log('출퇴근 정정 내역 API 멤버 널 :', memberId);
                const url = `/corrections?page=${page}&size=${size}&sort=${sort}&direction=${direction}&date=${date}`;
                // console.log('멤버 널 url', url);

                const response = await request('GET', url);

                console.log('[callSelectCorrectionListAPI] response : ', response);

                dispatch(getCorrectionlist(response));

            } else if (memberId !== null) {
                // console.log('출퇴근 정정 내역 API 멤버 낫널 :', memberId);
                const url = `/corrections?memberId=${memberId}&page=${page}&size=${size}&sort=${sort}&direction=${direction}&date=${date}`;
                console.log('멤버 낫널 url', url);

                const response = await request('GET', url);

                console.log('[callSelectCorrectionListAPI] response : ', response);

                dispatch(getCorrectionlist(response));
            }

        } catch (error) {
            console.log('[callSelectCorrectionListAPI] error : ', error);
        }
    }
};

/* 출퇴근 정정 처리 API */
export const callUpdateCorrectionAPI = (updateCorrection) => {
    return async (dispatch) => {
        try {
            console.log('api 에욥 : ', updateCorrection);
            const url = `/corrections/${updateCorrection.corrNo}`;
            const response = await request('PUT', url, updateCorrection);

            console.log('[callUpdateCorrectionAPI] response : ', response);

            dispatch(putCorrection(response));

        } catch (error) {
            console.log('[callUpdateCorrectionAPI] error : ', error);
        }
    }
};




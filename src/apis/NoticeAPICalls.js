import { getNotice } from "../modules/NoticeModule";
import { request } from "./CommonAPI";

/* 알림 내역 조회 API */
export const callSelectNoticeListAPI = (memberId) => {
    return async (dispatch) => {
        try {
            const url = `/notices?memberId=${memberId}`;
            console.log('[callSelectNoticeListAPI] url : ', url);

            const response = await request('GET', url);
            
            console.log('[callSelectNoticeListAPI] response : ', response);

            dispatch(getNotice(response));

        } catch (error) {
            console.log('[callSelectNoticeListAPI] Error : ', error);
        }
    }
};


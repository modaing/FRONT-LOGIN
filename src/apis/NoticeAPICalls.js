import { deleteNoticelist, getNotice } from "../modules/NoticeModule";
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

/* 알림 전체 삭제 API */
export const callDeleteNoticeListAPI = (memberId) => {
    return async (dispatch) => {
        try {
            const url = `/members/${memberId}/notices`;
            console.log('[callDeleteNoticeListAPI] url : ', url);

            const response = await request('DELETE', url);

            console.log('[callDeleteNoticeListAPI] response : ', response);

            dispatch(deleteNoticelist(response));

        } catch (error) {
            console.log('[callDeleteNoticeListAPI] Error : ', error);
        }
    }
};


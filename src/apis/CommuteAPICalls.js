import { getCommutelist } from "../modules/CommuteModule";
import { request, memberId } from "./CommonAPI";


// export function callCommuteListAPI(target, targetValue, date) {
//     console.log('[callCommuteListAPI] 들어옴 ');

//     const url = `/commutes?target=${target}&targetValue=${targetValue}&date=${date}`;

//     console.log('[callCommuteListAPI] url : ', url);

//     return async (dispatch) => {
//         try {

//             const result = await request('GET', url);

//             console.log('[callCommuteListAPI] result : ', result);

//             dispatch(getCommutelist(result));

//         } catch (error) {
//             console.error('Error commuteListAPI : ', error);
//         }
//     };
// }

export const callCommuteListAPI = (target, targetValue, date) => {
    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch) => {
        try {

            console.log('[target] : ', target);
            console.log('[targetValue] : ', targetValue);
            console.log('[date] : ', date);

            const url = `/commutes?target=${target}&targetValue=${targetValue}&date=${date}`;
            // const url = `/commutes?target=member&targetValue=240401835&date=2024-05-09`;
            const response = await request('GET', url);

            console.log('[callCommuteListAPI] response : ', response.response.data.results.result);

            /* action 생성 함수에 결과 전달하며 dispatch 호출 */
            dispatch(getCommutelist(response.response.data.results.result));

        } catch (error) {
            console.error('[callCommuteListAPI] Error : ', error);
        }
    }
}

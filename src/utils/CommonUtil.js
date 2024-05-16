export const convertToUtc = (date) => {

    // 클라이언트에서 전달된 날짜를 로컬 시간으로 생성
    const localDate = new Date(date);

    // 로컬 시간의 오프셋을 빼서 UTC 시간으로 변환
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    
    // UTC 시간을 ISO 문자열로 변환하여 반환
    return utcDate.toISOString();
}
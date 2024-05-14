import jwt_decode from "jwt-decode";

export function decodeJwt(token) {
    try {
        // 토큰이 없는 경우 또는 null인 경우
        if (!token) return null;

        // 토큰 디코딩
        return jwt_decode(token);
    } catch (error) {
        // 토큰 디코딩 중 오류가 발생한 경우
        console.error("Error decoding token:", error);
        return null;
    }
}
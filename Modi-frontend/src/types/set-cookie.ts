// 로그인 후 토큰 요청할 때 쓰일 request body
// body에 앞서 전달받은 code를 포함하여 보내면 응답 헤더에 Set-Cookie로 access_token이 포함됨
export interface CookieRequest {
  code: string;
}

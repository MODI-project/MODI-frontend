// 회원가입 요청 인터페이스
export interface SignUpRequest {
  nickname: string;
  character: string;
}

// 회원가입 응답 인터페이스
export interface SignUpResponse {
  userId: number;
  email: string;
  nickname: string;
  character: string;
}

// 기존 UserInfo 인터페이스 (다른 곳에서 사용 중일 수 있으므로 유지)
export interface UserInfo {
  userId: number;
  email: string;
  nickname: string;
  character: string;
}

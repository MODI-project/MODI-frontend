// 회원가입 & 회원 정보 수정 요청 인터페이스
export interface SignUpRequest {
  nickname: string;
  character: string;
}

// 회원가입, 회원 정보 수정, 회원 정보 조회 응답 인터페이스
export interface SignUpResponse {
  userId: number;
  email: string;
  nickname: string;
  character: string;
}

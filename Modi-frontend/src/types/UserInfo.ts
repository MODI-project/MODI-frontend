// 회원가입 & 회원 정보 수정 요청 인터페이스
export interface MeRequest {
  nickname: string;
  character: string;
  code?: string; // Google OAuth code (선택적)
}

// 회원가입, 회원 정보 수정, 회원 정보 조회 응답 인터페이스
export interface MeResponse {
  userId: number;
  email: string;
  nickname: string;
  character: "momo" | "boro" | "lumi" | "zuni";
}

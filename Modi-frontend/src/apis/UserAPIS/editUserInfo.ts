import axios from "axios";
import type { SignUpRequest, SignUpResponse } from "../../types/UserInfo";

const API_BASE_URL = "https://modidiary.store/api";

export const editUserInfo = async (
  userInfo: SignUpRequest
): Promise<SignUpResponse> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/members/me`, userInfo, {
      withCredentials: true, // HttpOnly 쿠키 자동 전송
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
    } else if (error.request) {
    } else {
    }

    throw error;
  }
};

export const handleEditUserInfo = async (
  nickname: string,
  character: string
) => {
  try {
    const userInfo: SignUpRequest = {
      nickname,
      character,
    };

    const response = await editUserInfo(userInfo);

    // 로컬 스토리지의 사용자 정보 업데이트
    const existingUserInfo = localStorage.getItem("userInfo");
    if (existingUserInfo) {
      const updatedUserInfo = { ...JSON.parse(existingUserInfo), ...response };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    }

    return response;
  } catch (error: any) {
    let userMessage = "회원 정보 수정에 실패했습니다.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        userMessage = "인증에 실패했습니다. 다시 로그인해주세요.";
      } else if (status === 400) {
        userMessage =
          data?.message || "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (status === 404) {
        userMessage = "사용자 정보를 찾을 수 없습니다.";
      } else if (status >= 500) {
        userMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }
    } else if (error.request) {
      userMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
    }

    error.userMessage = userMessage;
    throw error;
  }
};

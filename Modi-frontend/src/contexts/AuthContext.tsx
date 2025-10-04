import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import useLoadUserInfo, { MeResponse } from "../apis/UserAPIS/loadUserInfo";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MeResponse | null;
  login: (userData: MeResponse) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
  checkAuth: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<MeResponse | null>(null);
  const { fetchUserInfo } = useLoadUserInfo();
  const location = useLocation();

  const login = (userData: MeResponse) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    // 쿠키 삭제는 서버에서 처리하므로 클라이언트에서는 상태만 초기화
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await fetchUserInfo();
      login(userData);
    } catch (error) {
      // 403 또는 401 에러는 로그인하지 않은 상태로 간주
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // 앱 시작 시 인증 상태 확인 (로그인 페이지 및 OAuth 콜백 제외)
  useEffect(() => {
    // 로그인 페이지가 아니고, OAuth 콜백이 아닐 때만 인증 확인
    const isOAuthCallback = location.search.includes("code=");

    if (location.pathname !== "/" && !isOAuthCallback) {
      checkAuth();
    } else {
      // 로그인 페이지나 OAuth 콜백에서는 로딩 상태만 false로 설정
      setIsLoading(false);
    }
  }, [location.pathname, location.search]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
      logout();
    }
  };

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

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

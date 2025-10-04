import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CharacterProvider } from "./contexts/CharacterContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftContext";
import { FrameTemplateProvider } from "./contexts/FrameTemplate";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import { AlertBusProvider } from "./contexts/AlertBusContext";
import { NotificationManagerProvider } from "./contexts/NotificationManagerContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import HomePage from "./pages/home/HomePage";
import DiaryWritePage from "./pages/diary/DiaryWritePage";
import RecordDetailPage from "./pages/diary/RecordDetailPage";
import LoginPage from "./pages/login/LoginPage";
import MapPage from "./pages/map/MapPage";
import MyPage from "./pages/mypage/MyPage";
import InfoSetting from "./pages/login/InfoSetting";
import SearchPage from "./pages/search/SearchPage";
import DiaryEmotionTag from "./pages/diary/DiaryEmotionTag";
import DiaryKeywordPage from "./pages/diary/DiaryKeywordPage";
import DiaryStylePage from "./pages/diary/DiaryStylePage";
import NotificationPage from "./pages/notification/NotificationPage";
import Setting from "./pages/setting/Setting";
import MapSearchBar from "./components/map/SearchPlace/MapSearchBar";
import NotificationGridPage from "./pages/notification/NotificationGridPage";

function App() {
  return (
    <AuthProvider>
      <CharacterProvider>
        <DiaryDraftProvider>
          <FrameTemplateProvider>
            <AlertBusProvider>
              <GeolocationProvider>
                <NotificationManagerProvider>
                  <Routes>
                    {/* 공개 라우트 (로그인 없이 접근 가능) */}
                    <Route path="/" element={<LoginPage />} />

                    {/* 보호된 라우트 (로그인 필요) */}
                    <Route
                      path="/information-setting"
                      element={
                        <ProtectedRoute>
                          <InfoSetting />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute>
                          <HomePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <SearchPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/emotion"
                      element={
                        <ProtectedRoute>
                          <DiaryEmotionTag />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/detail"
                      element={
                        <ProtectedRoute>
                          <DiaryWritePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/keyword"
                      element={
                        <ProtectedRoute>
                          <DiaryKeywordPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/style"
                      element={
                        <ProtectedRoute>
                          <DiaryStylePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/recorddetail"
                      element={
                        <ProtectedRoute>
                          <RecordDetailPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/map"
                      element={
                        <ProtectedRoute>
                          <MapPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mypage"
                      element={
                        <ProtectedRoute>
                          <MyPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notification"
                      element={
                        <ProtectedRoute>
                          <NotificationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/setting"
                      element={
                        <ProtectedRoute>
                          <Setting />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/map-search-bar"
                      element={
                        <ProtectedRoute>
                          <MapSearchBar />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notification-grid"
                      element={
                        <ProtectedRoute>
                          <NotificationGridPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </NotificationManagerProvider>
              </GeolocationProvider>
            </AlertBusProvider>
          </FrameTemplateProvider>
        </DiaryDraftProvider>
      </CharacterProvider>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CharacterProvider } from "./contexts/CharacterContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftContext";
import { FrameTemplateProvider } from "./contexts/FrameTemplate";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import { AlertBusProvider } from "./contexts/AlertBusContext";
import { NotificationManagerProvider } from "./contexts/NotificationManagerContext";

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

// Route Guard
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <FrameTemplateProvider>
          <AlertBusProvider>
            <GeolocationProvider>
              <NotificationManagerProvider>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
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
                    path="/information-setting"
                    element={
                      <ProtectedRoute>
                        <InfoSetting />
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
  );
}

export default App;

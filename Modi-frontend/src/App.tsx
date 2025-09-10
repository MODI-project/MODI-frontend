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
import MapMarker from "./components/map/MapMarking/MapMarker";
import Popup from "./components/common/Popup";
import MapSearchBar from "./components/map/SearchPlace/MapSearchBar";
import NotificationGridPage from "./pages/notification/NotificationGridPage";

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
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/emotion" element={<DiaryEmotionTag />} />
                  <Route path="/detail" element={<DiaryWritePage />} />
                  <Route path="/keyword" element={<DiaryKeywordPage />} />
                  <Route path="/style" element={<DiaryStylePage />} />
                  <Route path="/recorddetail" element={<RecordDetailPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route
                    path="/information-setting"
                    element={<InfoSetting />}
                  />
                  <Route path="/notification" element={<NotificationPage />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="/map-search-bar" element={<MapSearchBar />} />
                  <Route
                    path="/notification-grid"
                    element={<NotificationGridPage />}
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

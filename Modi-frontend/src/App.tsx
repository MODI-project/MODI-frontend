import "./App.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/router";
import { CharacterProvider } from "./contexts/CharacterContext";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import { AlertBusProvider } from "./contexts/AlertBusContext";
import { NotificationManagerProvider } from "./contexts/NotificationManagerContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftProvider";
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
import NotificationGridPage from "./pages/notification/NotificationGridPage";
import "./App.css";

function App() {
  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <AlertBusProvider>
          <GeolocationProvider>
            <NotificationManagerProvider>
              <Router />
            </NotificationManagerProvider>
          </GeolocationProvider>
        </AlertBusProvider>
      </DiaryDraftProvider>
    </CharacterProvider>
  );
}

export default App;

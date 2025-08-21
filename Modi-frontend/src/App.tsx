import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
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
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/search",
      element: <SearchPage />,
    },
    {
      path: "/emotion",
      element: <DiaryEmotionTag />,
    },
    {
      path: "/detail",
      element: <DiaryWritePage />,
    },
    {
      path: "/keyword",
      element: <DiaryKeywordPage />,
    },
    {
      path: "/style",
      element: <DiaryStylePage />,
    },
    {
      path: "/recorddetail",
      element: <RecordDetailPage />,
    },
    {
      path: "/map",
      element: <MapPage />,
    },
    {
      path: "/mypage",
      element: <MyPage />,
    },
    {
      path: "/information-setting",
      element: <InfoSetting />,
    },
    {
      path: "/notification",
      element: <NotificationPage />,
    },
    {
      path: "/setting",
      element: <Setting />,
    },
    {
      path: "/notification-grid",
      element: <NotificationGridPage />,
    },
  ]);

  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <AlertBusProvider>
          <GeolocationProvider>
            <NotificationManagerProvider>
              <RouterProvider router={router} />
            </NotificationManagerProvider>
          </GeolocationProvider>
        </AlertBusProvider>
      </DiaryDraftProvider>
    </CharacterProvider>
  );
}

export default App;

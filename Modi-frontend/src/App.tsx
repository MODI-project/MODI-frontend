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
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/emotion",
      element: (
        <ProtectedRoute>
          <DiaryEmotionTag />
        </ProtectedRoute>
      ),
    },
    {
      path: "/detail",
      element: (
        <ProtectedRoute>
          <DiaryWritePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/keyword",
      element: (
        <ProtectedRoute>
          <DiaryKeywordPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/style",
      element: (
        <ProtectedRoute>
          <DiaryStylePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recorddetail",
      element: (
        <ProtectedRoute>
          <RecordDetailPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/map",
      element: (
        <ProtectedRoute>
          <MapPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/mypage",
      element: (
        <ProtectedRoute>
          <MyPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/information-setting",
      element: (
        <ProtectedRoute>
          <InfoSetting />
        </ProtectedRoute>
      ),
    },
    {
      path: "/notification",
      element: (
        <ProtectedRoute>
          <NotificationPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/setting",
      element: (
        <ProtectedRoute>
          <Setting />
        </ProtectedRoute>
      ),
    },
    {
      path: "/notification-grid",
      element: (
        <ProtectedRoute>
          <NotificationGridPage />
        </ProtectedRoute>
      ),
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

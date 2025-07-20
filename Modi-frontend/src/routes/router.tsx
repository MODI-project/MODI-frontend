import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import DiaryWritePage from "../pages/diary/DiaryWritePage";
import RecordDetailPage from "../pages/diary/RecordDetailPage";
import LoginPage from "../pages/login/LoginPage";
import MapPage from "../pages/map/MapPage";
import MyPage from "../pages/mypage/MyPage";
import Frame from "../components/common/frame/Frame";
import InitialSetting from "../pages/login/InitialSetting";
import SearchPage from "../pages/search/SearchPage";
import DiaryEmotionTag from "../pages/diary/DiaryEmotionTag";
import DiaryKeywordPage from "../pages/diary/DiaryKeywordPage";
import DiaryStylePage from "../pages/diary/DiaryStylePage";

const Router = () => {
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
      path: "/test-home",
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
    // test-frame, test-initialsetting 은 테스트용 라우터
    {
      path: "/test-frame",
      element: <Frame />,
    },
    {
      path: "/test-initialsetting",
      element: <InitialSetting />,
    },
    {
      path: "/test-recorddetail",
      element: <RecordDetailPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};
export default Router;

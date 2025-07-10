import style from "./HomePage.module.css";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

// import HomeHeader from "./components/HomeHeader";
// import PolaroidView from "./components/PolaroidView";
// import PhotoView from "./components/PhotoView";

const HomePage = () => {
  return (
    <div className={style.home_wrapper}>
      <div className={style.home_container}>
        <Header />
        {/* <HomeHeader viewType={viewType} onChangeView={setViewType} />
        <main className={style.mainContent}>
          {viewType === "polaroid" ? (
            <PolaroidView diary={todayDiary} />
          ) : (
            <PhotoView diaries={monthDiaries} />
          )}
        </main> */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;

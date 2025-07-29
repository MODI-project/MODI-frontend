import { useNavigate, useLocation } from "react-router-dom";
import style from "./Footer.module.css";
import FooterIcon from "./instance/footer";

interface FooterProps {
  showBalloon?: boolean;
}

const Footer = ({ showBalloon = false }: FooterProps) => {
  const navigator = useNavigate();
  const location = useLocation();

  return (
    <div className={style.footer_wrapper}>
      <div className={style.footer_container}>
        {Object.values(FooterIcon).map((icon, index) => {
          const isCurrent = location.pathname.includes(
            icon === "add" ? "diary" : icon
          );
          const iconSrc = isCurrent
            ? `/icons/clicked_${icon}.svg`
            : `/icons/${icon}.svg`;

          {
            showBalloon && (
              <div className={style.bubbleWrapper}>
                <img
                  src={`/assets/nodiary_home/Union.svg`}
                  alt="말풍선"
                  className={style.bubbleImage}
                ></img>
                <div className={style.bubble}>일기 기록하기</div>
              </div>
            );
          }
          return (
            <img
              className={style.footer_button}
              key={index}
              src={iconSrc}
              alt={icon}
              onClick={() => {
                navigator(`/${icon === "add" ? "emotion" : icon}`);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Footer;

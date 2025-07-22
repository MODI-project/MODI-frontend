import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./EmotionTag.module.css";
export default function EmotionTag({ label, type }) {
    return (_jsx("div", { className: styles.tag, children: _jsx("div", { className: `${styles["inner-border"]} ${styles[type]}`, children: _jsx("span", { className: styles.label, children: label }) }) }));
}

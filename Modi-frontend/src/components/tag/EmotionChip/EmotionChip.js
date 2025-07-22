import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./EmotionChip.module.css";
export default function EmotionChip({ label, type, selected, onClick, }) {
    return (_jsx("div", { className: `${styles.chip} ${styles[type]} ${selected ? styles.selected : styles.unselected}`, onClick: onClick, children: _jsx("span", { className: styles.label, children: label }) }));
}

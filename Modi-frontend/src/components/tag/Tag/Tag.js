import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./Tag.module.css";
export default function Tag({ label, onClick }) {
    return (_jsxs("button", { className: styles.container, onClick: onClick, children: [_jsx("span", { className: styles.label, children: label }), _jsx("img", { src: "/icons/Tag_X.svg", alt: "\uD0DC\uADF8 \uC0AD\uC81C \uC544\uC774\uCF58", className: styles.icon })] }));
}

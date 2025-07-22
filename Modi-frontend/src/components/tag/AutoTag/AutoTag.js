import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./AutoTag.module.css";
export default function AutoTag({ label, onClick }) {
    return (_jsxs("button", { className: styles.container, onClick: onClick, children: [_jsx("img", { src: "/icons/rotate_gray.svg", alt: "\uC790\uB3D9 \uC0DD\uC131 \uC544\uC774\uCF58", className: styles.icon }), _jsx("span", { className: styles.label, children: label })] }));
}

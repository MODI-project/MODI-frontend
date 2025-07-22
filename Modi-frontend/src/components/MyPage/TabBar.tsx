import React, { useState } from "react";
import Tab from "../../components/common/tab/Tab";
import styles from "./TabBar.module.css"; // 아래 CSS 모듈

const TAB_LABELS = ["즐겨찾기", "월간 일기"] as const;
type TabLabel = (typeof TAB_LABELS)[number];

export default function TabBar() {
  const [selectedTab, setSelectedTab] = useState<TabLabel>("즐겨찾기");

  return (
    <div className={styles.tab_container}>
      {TAB_LABELS.map((label) => (
        <Tab
          key={label}
          label={label}
          selected={selectedTab === label}
          onClick={() => setSelectedTab(label)}
        />
      ))}
    </div>
  );
}

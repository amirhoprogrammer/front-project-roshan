import React, { useState } from "react";
function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "ضبط صدا", content: "محتوای تب اول" },
    { label: "بارگزاری فایل", content: "محتوای تب دوم" },
    { label: "لینک", content: "محتوای تب سوم" },
  ];
  const Tab = ({ label, isActive, onClick }) => (
    <button
      className={`px-4 py-2 font-medium ${
        isActive ? "text-white active rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
  const TabContent = ({ isActive, children }) => (
    <div className={`p-4 ${isActive ? "block" : "hidden"}`}>{children}</div>
  );
  return (
    <div>
      <div className="flex" style={{ direction: "rtl" }}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            isActive={activeTab === index}
            onClick={() => setActiveTab(index)}
          />
        ))}
      </div>
      <div className="border-2 rounded-lg rounded-tr-none" style={{ borderColor: "#00B3A1" }}>
        {tabs.map((tab, index) => (
          <TabContent key={index} isActive={activeTab === index}>
            {tab.content}
          </TabContent>
        ))}
      </div>
    </div>
  );
}
export default Tabs;

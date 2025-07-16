import { useState, React } from "react";
import Guest from "../feathers/Guest";
//import { Tabs, Tab, Box } from "@mui/material";
//import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../App.css";
function ChangeTheVoice() {
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
  {
    /*style = {`${isActive ? { borderColor: "" } : { borderColor: "white" }}`
     */
  }
  const TabContent = ({ isActive, children }) => (
    <div className={`p-4 ${isActive ? "block" : "hidden"}`}>{children}</div>
  );

  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Guest />
      <h2
        className="flex items-center justify-center text-2xl font-bold"
        style={{ color: "#00b3a1" }}
      >
        تبدیل گفتار به متن
      </h2>
      <p
        className="flex items-center justify-center my-2 mx-88 text-center"
        style={{ color: "#969696" }}
      >
        آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف، زبان فارسی را یاد گرفته است
        می‌تواند متن صحبت‌ها را بنویسد
      </p>
      <div className="p-0 max-w-md mx-auto mt-4">
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
      <div className="flex mx-84 my-5 items-start w-48">
        <select
          name="language"
          id=""
          className="border-2 rounded-2xl mx-2 p-1"
          style={{
            border: "2px solid #00b3a1",
            direction: "rtl",
            borderRadius: "20px",
            color: "#00b3a1",
          }}
        >
          <option value="persian">فارسی</option>
          <option value="english">انگلیسی</option>
        </select>
        <p className="w-48 m-1" style={{ color: "#969696" }}>
          :زبان گفتار
        </p>
      </div>
    </div>
  );
}
export default ChangeTheVoice;

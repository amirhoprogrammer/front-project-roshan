import { useState, React } from "react";
import Select from "react-select";
//import { Tabs, Tab, Box } from "@mui/material";
//import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "../App.css";
function ChangeTheVoice() {
  const options = [
    {
      value: "user",
      label: (
        <div className="flex items-center rounded-2xl" style={{ direction: "rtl" }}>
          <svg
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-2xl"
          >
            <path
              d="M16.3874 16.1875V14.6458C16.3874 13.8281 16.0626 13.0438 15.4843 12.4656C14.9061 11.8874 14.1218 11.5625 13.3041 11.5625H7.13741C6.31966 11.5625 5.5354 11.8874 4.95716 12.4656C4.37893 13.0438 4.05408 13.8281 4.05408 14.6458V16.1875"
              stroke="#00BA9F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.2207 8.47917C11.9235 8.47917 13.304 7.09871 13.304 5.39583C13.304 3.69296 11.9235 2.3125 10.2207 2.3125C8.51778 2.3125 7.13733 3.69296 7.13733 5.39583C7.13733 7.09871 8.51778 8.47917 10.2207 8.47917Z"
              stroke="#00BA9F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mx-2" style={{ color: "#00B3A1" }}>
            مهمان
          </span>
        </div>
      ),
    },
    {
      value: "settings",
      label: (
        <div className="flex items-center rounded-2xl" style={{ direction: "rtl" }}>
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.24988 7.5H12.607"
              stroke="#00BA9F"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.74553 1H2.45089C1.63839 1 1 1.63839 1 2.39286V12.5491C1 13.3616 1.63839 14 2.45089 14H6.74553"
              stroke="#00BA9F"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.4021 5.29468L12.6075 7.50003L10.4021 9.70539"
              stroke="#00BA9F"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mx-2" style={{ color: "#00B3A1" }}>
            خروج
          </span>
        </div>
      ),
    },
  ];
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "2px solid #00b3a1",
      direction: "rtl",
      borderRadius: "20px",
    }),
  };
  /*const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "تب 1", content: "محتوای تب اول" },
    { label: "تب 2", content: "محتوای تب دوم" },
    { label: "تب 3", content: "محتوای تب سوم" },
  ];
  const Tab = ({ label, isActive, onClick }) => (
    <button
      className={`px-4 py-2 font-medium ${
        isActive
          ? "text-teal-600 border-2 border-teal-300 rounded-t-2xl"
          : "text-gray-500 rounded-2xl"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );*/
  /*style={`${isActive ? { borderColor: "#00B3A1" } : { borderColor: "white" }}`}*/
  {
    /*const TabContent = ({ isActive, children }) => (
    <div className={`p-4 ${isActive ? "block" : "hidden"}`}>{children}</div>
  );*/
  }

  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Select
        options={options}
        className="basic-select mx-6 w-30"
        classNamePrefix="select"
        styles={customStyles}
        placeholder="مهمان"
      />
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
          {/*{tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              isActive={activeTab === index}
              onClick={() => setActiveTab(index)}
            />
          ))}*/}
        </div>
        <div className="border-2 rounded-lg rounded-tr-none" style={{ borderColor: "#00B3A1" }}>
          {/*{tabs.map((tab, index) => (
            <TabContent key={index} isActive={activeTab === index}>
              {tab.content}
            </TabContent>
          ))}*/}
        </div>
      </div>
      <div className="flex mx-84 my-5 items-start w-48">
        <select
          name="language"
          id=""
          className="border-2 rounded-2xl mx-2 p-1 text-white"
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

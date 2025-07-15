import { useState, React } from "react";
import Select from "react-select";
import "../App.css";
function Archive() {
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
  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Select
        options={options}
        className="basic-select mx-6 w-30"
        classNamePrefix="select"
        styles={customStyles}
        placeholder="مهمان"
      />
      <h2 className="flex text-2xl mx-36" style={{ color: "#00b3a1", direction: "rtl" }}>
        آرشیو من
      </h2>
      <div className="flex flex-col mx-36 my-6" style={{ direction: "rtl" }}>
        <div className="flex">
          <div className="mx-16 w-60">
            <p>نام فایل</p>
          </div>
          <div className="mx-5 w-24">
            <p>تاریخ برگزاری</p>
          </div>
          <div className="mx-5 w-24">
            <p>نوع فایل</p>
          </div>
          <div className="mx-5 w-24">
            <p>مدت زمان</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Archive;

import { useState, React } from "react";
import Select from "react-select";
import Guest from "../feathers/Guest";
import "../App.css";
function Archive() {
  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Guest />
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

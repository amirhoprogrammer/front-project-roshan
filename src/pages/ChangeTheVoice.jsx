import { useState, React } from "react";
import Guest from "../feathers/Guest";
import Tabs from "../feathers/Tabs";
import Language from "../feathers/Language";
import "../App.css";
function ChangeTheVoice() {
  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Guest />
      <h2
        className="flex items-center justify-center text-2xl font-bold"
        style={{ color: "#00b3a1" }}
      >
        تبدیل گفتار به متن
      </h2>
      <p className="my-2 mx-88 p-0" style={{ textAlign: "center", color: "#969696" }}>
        آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف، زبان فارسی را یاد گرفته است
        می‌تواند متن صحبت‌ها را بنویسد
      </p>
      <div className="p-0 mx-76 mt-10">
        <Tabs />
      </div>
      <Language />
    </div>
  );
}
export default ChangeTheVoice;

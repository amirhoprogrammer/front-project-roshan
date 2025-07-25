/*import React, { useState, useEffect } from "react";
import ItemArchive1 from "./ItemArchive1";
import ItemArchive from "../Archive/ItemArchive";
import Guest from "../feathers/Guest";
import "../App.css";
function Archive() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    // فرض می‌کنیم اینجا درخواست به API list requests ارسال می‌شه
    const fetchRequests = async () => {
      const token = "a85d08400c622b50b18b61e239b9903645297196"; // توکن از Postman
      try {
        const response = await fetch("api/requests/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("پاسخ API:", data); // دیباگ برای دیدن داده
        setRequests(Array.isArray(data) ? data : data.results || []);
        //setRequests(data); // فرض می‌کنیم data شامل لیست درخواست‌هاست
        // مطمئن شو data یه آرایه هست
        setRequests(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("خطا در دریافت درخواست‌ها:", error);
        setRequests([]); // اگه خطا داد، آرایه خالی ست کن
      }
    };
    fetchRequests();
  }, []);
  return (
    <div className="mt-8 mb-4 flex flex-col">
      <Guest />
      <h2 className="flex text-2xl mx-20" style={{ color: "#00b3a1", direction: "rtl" }}>
        آرشیو من
      </h2>
      <div className="flex flex-col  my-6" style={{ direction: "rtl" }}>
        <div className="flex mx-20">
          <div className="mx-16 w-46">
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
        {requests.length === 0 ? (
          <p style={{ textAlign: "center", color: "#626262" }}>هیچ درخواستی یافت نشد.</p>
        ) : (
          requests.map((request, index) => (
            <ItemArchive
              key={index}
              name={request.name || "نام ناشناس"}
              date={request.date || "تاریخ نامشخص"}
              type={request.type || "نوع ناشناس"}
              duration={request.duration || "مدت نامشخص"}
              imageUrl={request.media_url ? `/api/media_image/${request.media_url}` : null} // اصلاح آدرس تصویر
            />
          ))
        )}
      </div>
    </div>
  );
}
export default Archive;*/

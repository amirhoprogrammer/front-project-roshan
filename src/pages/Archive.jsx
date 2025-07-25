import React, { useState, useEffect } from "react";
import axios from "axios";
import Guest from "../feathers/Guest";

function Archive() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = "a85d08400c622b50b18b61e239b9903645297196";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/requests/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setRequests(response.data.results || [response.data]); // فرض می‌کنیم response.data.results آرایه درخواست‌هاست، یا مستقیم object اصلی
      } catch (err) {
        setError("خطا در بارگذاری لیست درخواست‌ها");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="text-center text-gray-600">در حال بارگذاری...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col mt-8 mb-4">
      <Guest />
      <div className="p-4" style={{ direction: "rtl" }}>
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
        </div>
        <div className="space-y-4 my-2">
          {requests.map((request, index) => (
            <div
              key={index} // اگه درخواست‌ها شناسه منحصربه‌فرد دارن، از request.id استفاده کن
              className="flex flex-col p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
            >
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("fa-IR")}{" "}
                  {/* فرض تاریخ فعلی، اگه API تاریخ بده جایگزین کن */}
                </p>
                <p className="text-sm text-gray-500">مدت زمان: {request.duration || "نامشخص"}</p>
              </div>
              {/*<div className="overflow-y-auto max-h-40">
                {request.segments
                  .filter((segment) => segment.text.trim() !== "")
                  .map((segment, segIndex) => (
                    <div
                      key={segIndex}
                      className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <p className="text-sm">
                        {segment.start} - {segment.end}: {segment.text}
                      </p>
                    </div>
                  ))}
                  </div>*/}

              <div className="mt-2 text-sm text-gray-500">
                <p>کلمات: {request.stats?.words || 0}</p>
                <button
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => alert(`جزئیات درخواست ${index + 1}`)}
                >
                  مشاهده
                </button>
              </div>
            </div>
          ))}
        </div>
        {requests.length === 0 && (
          <p className="text-center text-gray-600">هیچ درخواستی یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

export default Archive;

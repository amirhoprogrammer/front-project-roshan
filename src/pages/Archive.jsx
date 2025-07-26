import React, { useState, useEffect } from "react";
import { transcribeFiles } from "../services/Api";
import axios from "axios";
import Guest from "../feathers/Guest";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
// تابع برای کپی کردن متن به کلیپ‌بورد
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      toast.success("متن با موفقیت کپی شد!", {
        position: "top-right",
        autoClose: "3000",
      });
    },
    (err) => {
      console.error("خطا در کپی کردن متن: ", err);
      toast.error("خطا در کپی کردن متن!", {
        position: "top-right",
        autoClose: "3000",
      });
    }
  );
};

// تابع برای دانلود متن به‌صورت فایل
const downloadText = (text, filename) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// تابع برای دانلود فایل صوتی
const downloadVoice = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "audio_file"; // اگر filename مشخص نبود، نام پیش‌فرض
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// تابع برای دانلود متن به‌صورت ورد
const downloadWord = (text, filename) => {
  const blob = new Blob([text], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function Archive() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileSizes, setFileSizes] = useState({}); // برای ذخیره حجم فایل‌ها

  // تبدیل فرمت زمان (ساعت:دقیقه:ثانیه:میلی‌ثانیه) به ثانیه
  const convertToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes, secondsWithMs] = timeStr.split(":");
    const [seconds, milliseconds] = secondsWithMs.split(".");
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      (milliseconds ? parseInt(milliseconds) / 1000 : 0)
    );
  };

  // تبدیل ثانیه به فرمت دقیقه:ثانیه (بدون ساعت)
  const formatTime = (seconds) => {
    const totalMinutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const mins = totalMinutes % 60; // فقط دقیقه رو می‌گیریم
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  // تابع برای تشخیص نوع درخواست
  const getRequestType = (request) => {
    if (request.url && request.url.startsWith("https://")) {
      return "ارسال لینک";
    } else if (request.file) {
      return "آپلود فایل";
    } else {
      return "ضبط صدا";
    }
  };

  // تابع برای استخراج متن کامل از segments
  const getFullTranscript = (segments) => {
    return segments
      .filter((segment) => segment.text.trim() !== "")
      .map((segment) => segment.text)
      .join(" ");
  };

  //function for sign of name
  const formatName = (linkUrl) => {
    if (linkUrl.slice(0, 52) === "https://as-v2.tamasha.com/statics/videos_file/e4/e4/") {
      const linkF = linkUrl.slice(52, linkUrl.length - 1);
      return linkF;
    } else {
      return linkUrl;
    }
  };
  //function for find the format of file
  function formatFile(link1) {
    const reversedLink1 = link1.split("").reverse().join("");
    const format = reversedLink1.split(".", 1);
    const formatFile1 = format[0].split("").reverse().join("");
    return formatFile1;
  }
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
            <div className="mx-20 w-46">
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
        <div className="my-2">
          {requests.map((request, index) => {
            const transcriptText = getFullTranscript(request.segments || []);
            const requestType = getRequestType(request);
            return (
              <div
                key={index} // اگه درخواست‌ها شناسه منحصربه‌فرد دارن، از request.id استفاده کن
                className="flex flex-col p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
              >
                <div className="flex mb-2">
                  {requestType === "ضبط صدا" && (
                    <div className="flex mx-2 rounded-full" style={{ backgroundColor: "#00B3A1" }}>
                      <svg
                        width="20"
                        height="34"
                        viewBox="0 0 20 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="items-center justify-center"
                      >
                        <path
                          d="M10 0.638916L9.20755 0.686849L8.43103 0.833843L7.68008 1.06392L6.95789 1.38987L6.28044 1.79889L5.65731 2.28461L5.0981 2.84383L4.61238 3.46696L4.20654 4.14122L3.8774 4.86341L3.64733 5.61755L3.50033 6.39407L3.4524 7.18656V18.6361L3.50033 19.4254L3.64733 20.1988L3.8774 20.9561L4.20654 21.6783L4.61238 22.3525L5.0981 22.9757L5.65731 23.5349L6.28044 24.0206L6.95789 24.4296L7.68008 24.7556L8.43103 24.9889L9.20755 25.1295L10 25.1806L10.7861 25.1295L11.5658 24.9889L12.32 24.7556L13.039 24.4296L13.7196 24.0206L14.3364 23.5349L14.8956 22.9757L15.3877 22.3525L15.7935 21.6783L16.1163 20.9561L16.3527 20.1988L16.4965 19.4254L16.5413 18.6361V7.18656L16.4965 6.39407L16.3527 5.61755L16.1163 4.86341L15.7935 4.14122L15.3877 3.46696L14.8956 2.84383L14.3364 2.28461L13.7196 1.79889L13.039 1.38987L12.32 1.06392L11.5658 0.833843L10.7861 0.686849L10 0.638916ZM9.66451 2.291H10.3356L10.997 2.38048L11.6425 2.55943L12.2561 2.82785L12.8281 3.17617L13.349 3.59478L13.8059 4.08689L14.1926 4.63333L14.4993 5.23089L14.723 5.86041L14.8604 6.5155L14.9084 7.18656V18.6361L14.8604 19.3072L14.723 19.9591L14.4993 20.5918L14.1926 21.183L13.8059 21.7358L13.349 22.2247L12.8281 22.6465L12.2561 22.9948L11.6425 23.2601L10.997 23.4422L10.3356 23.5317H9.66451L8.99984 23.4422L8.35434 23.2601L7.7376 22.9948L7.1656 22.6465L6.64793 22.2247L6.19097 21.7358L5.80431 21.183L5.49434 20.5918L5.27065 19.9591L5.13964 19.3072L5.0917 18.6361V7.18656L5.13964 6.5155L5.27065 5.86041L5.49434 5.23089L5.80431 4.63333L6.19097 4.08689L6.64793 3.59478L7.1656 3.17617L7.7376 2.82785L8.35434 2.55943L8.99984 2.38048L9.66451 2.291ZM0.180176 18.6361L0.224913 19.5469L0.349539 20.448L0.560444 21.3396L0.851237 22.2024L1.22192 23.0364L1.66929 23.8321L2.19016 24.5798L2.77495 25.2796L3.42364 25.9251L4.12665 26.5003L4.884 27.0116L5.68288 27.4526L6.51691 27.8169L7.3861 28.0949L8.27765 28.2994L9.17879 28.4177V31.725H3.4524V33.3611H16.5413V31.725H10.8181V28.4177L11.7192 28.2994L12.6108 28.0949L13.4768 27.8169L14.3172 27.4526L15.1161 27.0116L15.8734 26.5003L16.5764 25.9251L17.2219 25.2796L17.8099 24.5798L18.3276 23.8321L18.775 23.0364L19.1424 22.2024L19.4364 21.3396L19.6473 20.448L19.7752 19.5469L19.8135 18.6361H18.1806L18.1327 19.4893L17.9984 20.3362L17.7812 21.1638L17.4712 21.9627L17.0845 22.7264L16.6148 23.4454L16.0779 24.1069L15.4708 24.714L14.8061 25.2541L14.0871 25.7174L13.3266 26.1105L12.5277 26.4141L11.6969 26.6377L10.8564 26.772L10 26.8135L9.14364 26.772L8.29682 26.6377L7.47237 26.4141L6.67349 26.1105L5.90656 25.7174L5.19077 25.2541L4.5229 24.714L3.91575 24.1069L3.3789 23.4454L2.91555 22.7264L2.52569 21.9627L2.21892 21.1638L1.99524 20.3362L1.86102 19.4893L1.81948 18.6361H0.180176Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  )}
                  {requestType === "آپلود فایل" && (
                    <div className="flex mx-2 rounded-full" style={{ backgroundColor: "#118AD3" }}>
                      <svg
                        width="62"
                        height="62"
                        viewBox="0 0 62 62"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="31" cy="31" r="31" fill="#118AD3" />
                        <path
                          d="M36.7187 35.6195L31.2801 30.1809L25.8415 35.6195"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M31.2797 30.1809V42.4177"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M42.6869 38.8689C44.0131 38.146 45.0607 37.002 45.6644 35.6175C46.2681 34.233 46.3936 32.6869 46.0211 31.2232C45.6485 29.7595 44.7991 28.4615 43.607 27.5341C42.4148 26.6068 40.9478 26.1028 39.4374 26.1018H37.7242C37.3127 24.51 36.5456 23.0322 35.4807 21.7795C34.4158 20.5268 33.0808 19.5318 31.576 18.8693C30.0712 18.2068 28.4359 17.8941 26.7928 17.9546C25.1498 18.0152 23.5418 18.4474 22.0899 19.2188C20.6379 19.9902 19.3797 21.0808 18.4099 22.4084C17.4401 23.7361 16.7838 25.2664 16.4906 26.8842C16.1973 28.5019 16.2745 30.1652 16.7166 31.7488C17.1586 33.3324 17.9539 34.7952 19.0426 36.0273"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M36.7187 35.6195L31.2801 30.1809L25.8415 35.6195"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  {requestType === "ارسال لینک" && (
                    <div className="flex mx-2 rounded-full" style={{ backgroundColor: "#FF1654" }}>
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.91027 3.40673L8.63166 1.68534C9.72018 0.723395 11.3403 0.824653 12.3023 1.88786C13.1883 2.84981 13.1883 4.34336 12.3023 5.33063L10.5556 7.05201L11.0872 7.58361L12.8339 5.83691C14.1249 4.54588 14.0743 2.41946 12.7579 1.12843C11.4669 -0.111982 9.4164 -0.111982 8.12537 1.12843L6.37867 2.84981C5.08763 4.16616 5.08763 6.26726 6.37867 7.58361L6.91027 7.05201C5.92301 6.03943 5.92301 4.41931 6.91027 3.40673Z"
                          fill="white"
                        />
                        <path
                          d="M6.6065 14.95L8.35319 13.2286C9.64423 11.9123 9.64423 9.81118 8.35319 8.52014L7.82159 9.05174C8.83417 10.0643 8.83417 11.6844 7.82159 12.697L6.07489 14.4184C5.06231 15.431 3.44219 15.431 2.42961 14.4184C1.41703 13.4058 1.41703 11.7857 2.42961 10.7731L4.17631 9.05174L3.6447 8.52014L1.92332 10.2415C0.581654 11.5072 0.505712 13.6083 1.77143 14.95C3.03716 16.2917 5.13826 16.3676 6.47992 15.1019C6.53055 15.026 6.58118 15.0006 6.6065 14.95Z"
                          fill="white"
                        />
                        <path
                          d="M9.75684 6.23243L9.21985 5.69543L5.03128 9.884L5.56828 10.421L9.75684 6.23243Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  )}
                  {/*<p className="flex mx-2">{getRequestType(request)}</p>*/}
                  <p className="flex mx-5 w-80 overflow-x-auto p-0" style={{ direction: "ltr" }}>
                    {formatName(request.url)}
                  </p>
                  <p className="text-sm text-gray-600 mx-20">
                    {new Date().toLocaleDateString("fa-IR")}{" "}
                    {/* فرض تاریخ فعلی، اگه API تاریخ بده جایگزین کن */}
                  </p>
                  <p className="flex mx-2">{formatFile(request.url)}</p>
                  <p className="flex mr-24 ml-10">
                    {formatTime(convertToSeconds(request.duration))}
                  </p>
                  <div
                    className="mx-2"
                    id="download"
                    data-tooltip-id={`tooltip-${index}`}
                    data-tooltip-content={fileSizes[request.url] || "در حال محاسبه..."}
                    onClick={() => downloadVoice(request.url, formatName(request.url))}
                  >
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.39307 10C6.32739 10.0001 6.26235 9.98485 6.20166 9.95523C6.14098 9.92561 6.08584 9.88217 6.0394 9.82739C5.99296 9.77261 5.95613 9.70757 5.93102 9.63599C5.90591 9.5644 5.89301 9.48768 5.89307 9.41021V0.58979C5.89307 0.433368 5.94574 0.283352 6.03951 0.172745C6.13328 0.0621384 6.26046 0 6.39307 0C6.52567 0 6.65285 0.0621384 6.74662 0.172745C6.84039 0.283352 6.89307 0.433368 6.89307 0.58979V9.41021C6.89307 9.56663 6.84039 9.71665 6.74662 9.82725C6.65285 9.93786 6.52567 10 6.39307 10Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M6.60354 10.5149C6.42349 10.5152 6.24516 10.4799 6.0788 10.4111C5.91243 10.3423 5.76131 10.2412 5.63411 10.1138L2.74082 7.22052C2.6404 7.1201 2.58398 6.9839 2.58398 6.84188C2.58398 6.69986 2.6404 6.56366 2.74082 6.46324C2.84125 6.36281 2.97745 6.3064 3.11947 6.3064C3.26148 6.3064 3.39769 6.36281 3.49811 6.46324L6.39139 9.35652C6.41925 9.38438 6.45233 9.40648 6.48873 9.42156C6.52513 9.43664 6.56414 9.4444 6.60354 9.4444C6.64294 9.4444 6.68195 9.43664 6.71835 9.42156C6.75475 9.40648 6.78782 9.38438 6.81568 9.35652L9.70897 6.46324C9.80998 6.36562 9.94528 6.31159 10.0857 6.31277C10.2262 6.31395 10.3606 6.37025 10.4599 6.46955C10.5593 6.56885 10.6157 6.70319 10.6169 6.84366C10.6182 6.98412 10.5642 7.11946 10.4667 7.22052L7.57297 10.1138C7.44574 10.2412 7.29461 10.3422 7.12825 10.411C6.96189 10.4799 6.78358 10.5152 6.60354 10.5149Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M12.1319 14.5983H1.2892C0.947409 14.5979 0.619735 14.4481 0.378053 14.1818C0.13637 13.9156 0.000411796 13.5546 0 13.178V9.43318C0 9.29109 0.0512319 9.15483 0.142425 9.05437C0.233619 8.9539 0.357303 8.89746 0.48627 8.89746C0.615237 8.89746 0.738922 8.9539 0.830115 9.05437C0.921308 9.15483 0.97254 9.29109 0.97254 9.43318V13.178C0.972643 13.2705 1.00604 13.3592 1.0654 13.4246C1.12476 13.49 1.20525 13.5268 1.2892 13.5269H12.1319C12.2158 13.5268 12.2963 13.49 12.3557 13.4246C12.415 13.3592 12.4484 13.2705 12.4485 13.178V9.43318C12.4485 9.29109 12.4997 9.15483 12.5909 9.05437C12.6821 8.9539 12.8058 8.89746 12.9348 8.89746C13.0638 8.89746 13.1874 8.9539 13.2786 9.05437C13.3698 9.15483 13.4211 9.29109 13.4211 9.43318V13.178C13.4206 13.5546 13.2847 13.9156 13.043 14.1818C12.8013 14.4481 12.4736 14.5979 12.1319 14.5983Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                    <Tooltip id={`tooltip-${index}`} />
                  </div>
                  <div
                    className="mx-2"
                    id="download-word"
                    onClick={() => downloadText(transcriptText, "transcription.docx")}
                  >
                    <svg
                      width="13"
                      height="18"
                      viewBox="0 0 13 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.7 17.08H1.3C0.585 17.08 0 16.495 0 15.78V2.25996C0 1.54496 0.585 0.959961 1.3 0.959961H6.591C6.942 0.959961 7.753 1.25294 8 1.49994L12.5 5.99994C12.747 6.24694 13 7.01796 13 7.36896V15.78C13 16.495 12.415 17.08 11.7 17.08ZM1.3 1.99994C0.871 1.99994 1 1.83096 1 2.25996V15.2031C1 15.6321 1.571 15.9999 2 15.9999H10.5C10.929 15.9999 12 16.209 12 15.78V7.49994C12 7.29194 11.656 6.64294 11.5 6.49994L8.5 3.49994C7.5 2.49994 7 1.99994 7 1.99994H1.3Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M8.41107 13.1799H7.33207L6.73407 10.8399C6.70807 10.7619 6.66907 10.5799 6.61707 10.3199C6.56507 10.0599 6.52607 9.87795 6.52607 9.79995C6.51307 9.90395 6.48707 10.0859 6.43507 10.3329C6.38307 10.5799 6.34407 10.7489 6.31807 10.8529L5.72007 13.1799H4.64107L3.51007 8.72095H4.43307L5.00507 11.1519C5.10907 11.6069 5.17407 11.9839 5.22607 12.3219C5.23907 12.2049 5.26507 12.0229 5.30407 11.7889C5.34307 11.5549 5.39507 11.3599 5.42107 11.2299L6.07107 8.73395H6.96807L7.61807 11.2299C7.64407 11.3469 7.68307 11.5159 7.72207 11.7369C7.76107 11.9579 7.80007 12.1659 7.82607 12.3219C7.85207 12.1659 7.87807 11.9709 7.93007 11.7239C7.98207 11.4769 8.02107 11.2949 8.04707 11.1519L8.61907 8.72095H9.54207L8.41107 13.1799Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </div>
                  <div
                    className="mx-2"
                    id="copy"
                    onClick={() => copyToClipboard(transcriptText || "متن خالی")}
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.62156 17.2009H14.4574C14.8664 17.2004 15.2585 17.0233 15.5476 16.7085C15.8368 16.3938 15.9994 15.967 15.9998 15.522V6.99509C15.9993 6.55014 15.8366 6.12358 15.5475 5.80901C15.2583 5.49443 14.8663 5.31753 14.4574 5.31714H6.62202C6.2132 5.31753 5.82123 5.49445 5.53215 5.80904C5.24307 6.12363 5.08051 6.55019 5.08014 6.99509V15.522C5.08038 15.9669 5.24282 16.3936 5.5318 16.7083C5.82078 17.0231 6.2127 17.2003 6.62156 17.2009ZM14.4574 6.56376C14.5626 6.56376 14.6634 6.60919 14.7378 6.69006C14.8122 6.77094 14.8541 6.88065 14.8542 6.99509V15.522C14.8542 15.6365 14.8124 15.7464 14.738 15.8275C14.6636 15.9086 14.5627 15.9542 14.4574 15.9543H6.62202C6.51682 15.954 6.41601 15.9084 6.3417 15.8273C6.2674 15.7463 6.22567 15.6365 6.22567 15.522V6.99509C6.22567 6.88069 6.26743 6.77098 6.34176 6.69009C6.41609 6.6092 6.5169 6.56376 6.62202 6.56376H14.4574Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M1.73396 11.8808H5.65028C5.80219 11.8808 5.94787 11.8151 6.05529 11.6982C6.1627 11.5813 6.22305 11.4228 6.22305 11.2575C6.22305 11.0922 6.1627 10.9336 6.05529 10.8167C5.94787 10.6998 5.80219 10.6342 5.65028 10.6342H1.73396C1.62875 10.634 1.52789 10.5885 1.4535 10.5075C1.37911 10.4266 1.33727 10.3168 1.33715 10.2023V1.67795C1.33727 1.56351 1.37913 1.4538 1.45353 1.37292C1.52794 1.29205 1.6288 1.24662 1.73396 1.24662H9.56936C9.67452 1.24662 9.77538 1.29205 9.84978 1.37292C9.92419 1.4538 9.96605 1.56351 9.96617 1.67795V5.94039C9.96617 6.1057 10.0265 6.26424 10.1339 6.38114C10.2413 6.49803 10.387 6.5637 10.5389 6.5637C10.6908 6.5637 10.8365 6.49803 10.9439 6.38114C11.0513 6.26424 11.1117 6.1057 11.1117 5.94039V1.67795C11.1112 1.23344 10.9489 0.807251 10.6602 0.492746C10.3715 0.178241 9.98011 0.00105523 9.57165 0H1.73396C1.3251 0.000395897 0.933077 0.177291 0.643925 0.491867C0.354772 0.806444 0.192105 1.23301 0.19162 1.67795V10.2048C0.192711 10.6494 0.35563 11.0754 0.644704 11.3895C0.933778 11.7036 1.32545 11.8803 1.73396 11.8808Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </div>
                  <div className="mx-2" id="delete">
                    <svg
                      width="11"
                      height="16"
                      viewBox="0 0 11 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.49172 2.56934H9.94577C10.2182 2.56934 10.4375 2.78457 10.4375 3.05192V14.5175C10.4375 14.7848 10.2182 15.0001 9.94577 15.0001H1.49172C1.21931 15.0001 1 14.7848 1 14.5175V3.05192C1 2.78457 1.21931 2.56934 1.49172 2.56934V2.56934Z"
                        stroke="#8F8F8F"
                        strokeMiterlimit="6.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.03578 1.42236H10.4302"
                        stroke="#8F8F8F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.04933 4.17505V13.3949"
                        stroke="#8F8F8F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.71863 4.17505V13.3949"
                        stroke="#8F8F8F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.38811 4.17505V13.3949"
                        stroke="#8F8F8F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.35373 1H7.11263"
                        stroke="#8F8F8F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
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

                {/*<div className="mt-2 text-sm text-gray-500">
                <p>کلمات: {request.stats?.words || 0}</p>
                <button
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => alert(`جزئیات درخواست ${index + 1}`)}
                >
                  مشاهده
                </button>
                </div>*/}
                <ToastContainer />
              </div>
            );
          })}
        </div>
        {requests.length === 0 && (
          <p className="text-center text-gray-600">هیچ درخواستی یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

export default Archive;

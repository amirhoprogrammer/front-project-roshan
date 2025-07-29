import React, { useState } from "react";
import { transcribeFiles } from "../services/api";
import Audio from "../audio & voice/Audio";
import VoiceRecorder from "../audio & voice/VoiceRecorder";
import "@fontsource/vazir";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
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
function Tabs() {
  const imUrl = "../assets/upload.svg";
  const [mediaUrl, setMediaUrl] = useState("");
  const [transcription, setTranscription] = useState(null);
  const [transcription1, setTranscription1] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null); // for saving the recorded voice

  // when the recording is end,the file will save
  const handleRecordingComplete = (blob) => {
    setRecordedAudioBlob(blob);
  };

  //send file to api
  const handleTranscribe = async () => {
    if (!recordedAudioBlob) return;

    const formData = new FormData();
    formData.append("media", recordedAudioBlob, "recording.wav");

    try {
      setLoading(true);
      const token = "a85d08400c622b50b18b61e239b9903645297196";
      const response = await fetch("/api/transcribe_files/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("خطا در ترانسکریپشن");
      const data = await response.json();
      const textSegments = data[0].segments
        .filter((segment) => segment.text.trim() !== "")
        .map((segment) => segment.text)
        .join(" ");
      setTranscription(textSegments);
      setTranscription1(data[0]);
      setShowForm(false);
      console.log("ترانسکریپشن موفق:", data);
    } catch (err) {
      setError(`خطا در تبدیل به متن: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  //for upload file part
  const [uploadedFile, setUploadedFile] = useState(null);
  //check type of file that user upload it
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith("audio/") || file.type.startsWith("video/"))) {
      setUploadedFile(file);
      setError(null);
    } else {
      setError("لطفاً یک فایل صوتی یا تصویری انتخاب کنید.");
      setUploadedFile(null);
    }
  };

  const handleTranscribe1 = async () => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("media", uploadedFile, uploadedFile.name);

    try {
      setLoading(true);
      const token = "a85d08400c622b50b18b61e239b9903645297196";
      const response = await fetch("/api/transcribe_files/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("خطا در ترانسکریپشن");
      const data = await response.json();
      const textSegments = data[0].segments
        .filter((segment) => segment.text.trim() !== "")
        .map((segment) => segment.text)
        .join(" ");
      setTranscription(textSegments);
      setTranscription1(data[0]);
      setShowForm(false);
      console.log("ترانسکریپشن موفق:", data);
    } catch (err) {
      setError(`خطا در تبدیل به متن: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  //if (!segment.text.trim()) return null; // نادیده گرفتن segment‌های خالی
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeFiles([mediaUrl]);
      const textSegments = data[0].segments
        .filter((segment) => segment.text.trim() !== "")
        .map((segment) => segment.text)
        .join(" ");
      setTranscription(textSegments);
      setTranscription1(data[0]);
      setShowForm(false);
      // ارسال درخواست به API transcribe_files
      const token = "a85d08400c622b50b18b61e239b9903645297196"; // توکن از Postman
      const response = await fetch("/api/transcribe_files/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ media_urls: [mediaUrl] }),
      });
      if (!response.ok) throw new Error("خطا در ارسال به سرور");
      const result = await response.json();
      console.log("درخواست با موفقیت ثبت شد:", result);
      setLoading(false);
    } catch (err) {
      setError(`خطا در تبدیل فایل:${err.message}`);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowForm(true);
    setTranscription(null);
    setTranscription1(null);
    setMediaUrl("");
    //setFile(null);
    setRecordedAudioBlob(null); //reset the recorded voice
    setError(null);
  };
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
  // فرمت متن زمان‌بندی‌شده
  const getTimedText = () => {
    if (!transcription1 || !transcription1.segments) return "";
    return transcription1.segments
      .filter((segment) => segment.text.trim() !== "")
      .map(
        (segment, index) =>
          `${index + 1}\n${formatTime(convertToSeconds(segment.start))} --> ${formatTime(
            convertToSeconds(segment.end)
          )}\n${segment.text}\n`
      )
      .join("\n");
  };
  const [activeTab, setActiveTab] = useState(0);
  const [activeButton, setActiveButton] = useState(0);
  const tabs = [
    {
      label: (
        <div className="flex items-center rounded-2xl m-0 p-0" style={{ direction: "rtl" }}>
          <svg
            width="13"
            height="22"
            viewBox="0 0 13 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.50212 0L5.97738 0.0317415L5.46322 0.129082L4.96598 0.281441L4.48779 0.497284L4.03923 0.768145L3.62663 1.08979L3.25635 1.46011L2.93473 1.87275L2.66602 2.31925L2.44808 2.79749L2.29574 3.29689L2.19841 3.8111L2.16667 4.33589V11.9179L2.19841 12.4406L2.29574 12.9527L2.44808 13.4542L2.66602 13.9324L2.93473 14.3789L3.25635 14.7915L3.62663 15.1619L4.03923 15.4835L4.48779 15.7544L4.96598 15.9702L5.46322 16.1247L5.97738 16.2178L6.50212 16.2517L7.02262 16.2178L7.5389 16.1247L8.03825 15.9702L8.51432 15.7544L8.96501 15.4835L9.37337 15.1619L9.74365 14.7915L10.0695 14.3789L10.3382 13.9324L10.5519 13.4542L10.7085 12.9527L10.8037 12.4406L10.8333 11.9179V4.33589L10.8037 3.8111L10.7085 3.29689L10.5519 2.79749L10.3382 2.31925L10.0695 1.87275L9.74365 1.46011L9.37337 1.08979L8.96501 0.768145L8.51432 0.497284L8.03825 0.281441L7.5389 0.129082L7.02262 0.0317415L6.50212 0ZM6.27995 1.09402H6.72428L7.16227 1.15328L7.58968 1.27178L7.99593 1.44953L8.37467 1.68018L8.71956 1.95739L9.02214 2.28327L9.27816 2.64513L9.48128 3.04084L9.62939 3.45771L9.72038 3.89151L9.75212 4.33589V11.9179L9.72038 12.3623L9.62939 12.7939L9.48128 13.2129L9.27816 13.6044L9.02214 13.9705L8.71956 14.2943L8.37467 14.5736L7.99593 14.8042L7.58968 14.9799L7.16227 15.1005L6.72428 15.1598H6.27995L5.83984 15.1005L5.41244 14.9799L5.00407 14.8042L4.62533 14.5736L4.28255 14.2943L3.97998 13.9705L3.72396 13.6044L3.51872 13.2129L3.37061 12.7939L3.28385 12.3623L3.25212 11.9179V4.33589L3.28385 3.89151L3.37061 3.45771L3.51872 3.04084L3.72396 2.64513L3.97998 2.28327L4.28255 1.95739L4.62533 1.68018L5.00407 1.44953L5.41244 1.27178L5.83984 1.15328L6.27995 1.09402ZM0 11.9179L0.0296224 12.521L0.112142 13.1177L0.25179 13.7081L0.444336 14.2795L0.689779 14.8318L0.986003 15.3587L1.33089 15.8538L1.7181 16.3173L2.14762 16.7447L2.61312 17.1256L3.11458 17.4642L3.64355 17.7562L4.1958 17.9974L4.77132 18.1815L5.36165 18.317L5.95833 18.3953V20.5854H2.16667V21.6689H10.8333V20.5854H7.04378V18.3953L7.64046 18.317L8.23079 18.1815L8.8042 17.9974L9.36068 17.7562L9.88965 17.4642L10.3911 17.1256L10.8566 16.7447L11.284 16.3173L11.6733 15.8538L12.0161 15.3587L12.3123 14.8318L12.5557 14.2795L12.7503 13.7081L12.89 13.1177L12.9746 12.521L13 11.9179H11.9188L11.887 12.4829L11.7982 13.0436L11.6543 13.5917L11.4491 14.1207L11.193 14.6265L10.882 15.1026L10.5265 15.5406L10.1245 15.9427L9.68441 16.3003L9.20833 16.6072L8.70475 16.8674L8.17578 17.0685L7.62565 17.2166L7.06917 17.3055L6.50212 17.333L5.93506 17.3055L5.37435 17.2166L4.82845 17.0685L4.29948 16.8674L3.79167 16.6072L3.31771 16.3003L2.87549 15.9427L2.47347 15.5406L2.118 15.1026L1.8112 14.6265L1.55306 14.1207L1.34993 13.5917L1.20182 13.0436L1.11296 12.4829L1.08545 11.9179H0Z"
              fill="currentColor"
            />
          </svg>
          <span className="mx-2 font-light">ضبط صدا</span>
        </div>
      ),
      content: (
        <div
          className={`flex flex-col rounded-2xl ${
            transcription ? "p-0 m-0" : "m-16 p-8 items-center justify-center"
          }`}
          style={{ direction: "rtl" }}
        >
          {!transcription && (
            <>
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
              {recordedAudioBlob && !transcription && (
                <button
                  className="rounded-full px-4 py-2  mt-0"
                  style={{ backgroundColor: "#118AD3" }}
                  onClick={handleTranscribe}
                  disabled={loading}
                >
                  تبدیل به متن
                </button>
              )}
            </>
          )}
          {transcription && (
            <div style={{ direction: "rtl" }}>
              <div className="flex flex-col p-4 ">
                <div className="flex border-b-1 flex-row border-b-black my-0 h-10 p-0">
                  <button
                    className={`flex flex-row-reverse mx-0 my-0 py-0 gap-1 px-2 ${
                      activeButton === 0 ? "border-b-2" : ""
                    }`}
                    style={{ direction: "rtl" }}
                    onClick={() => setActiveButton(0)}
                  >
                    <p>متن ساده</p>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2"
                    >
                      <path
                        d="M1.47821 3.69568H15.7065"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.35858 6.92932H15.7064"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.47821 10.163H15.7065"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.35858 13.3967H15.7064"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className={`flex flex-row-reverse mx-2 my-0 py-0 gap-1 px-2 ${
                      activeButton === 1 ? "border-b-2 " : ""
                    }`}
                    style={{ direction: "rtl" }}
                    onClick={() => setActiveButton(1)}
                  >
                    <p>متن زمان بندی شده</p>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2"
                    >
                      <path
                        d="M8.50001 16.8125C6.27938 16.8125 4.19235 15.948 2.62248 14.3775C0.0562897 11.8119 -0.553491 7.92109 1.10604 4.69703C1.25626 4.4055 1.6137 4.29091 1.90582 4.44053C2.19795 4.59016 2.31254 4.94819 2.16232 5.24031C0.739696 8.00362 1.2622 11.3381 3.46204 13.538C4.80748 14.884 6.59645 15.625 8.50001 15.625C10.403 15.625 12.1925 14.884 13.538 13.538C14.8834 12.1919 15.625 10.403 15.625 8.5C15.625 6.59644 14.884 4.80747 13.538 3.46203C12.1919 2.11659 10.4036 1.375 8.50001 1.375C6.59645 1.375 4.80748 2.11659 3.46204 3.46203C3.22988 3.69419 2.85463 3.69419 2.62248 3.46203C2.39032 3.22987 2.39032 2.85462 2.62248 2.62247C4.19235 1.05259 6.27938 0.1875 8.50001 0.1875C10.7206 0.1875 12.8083 1.05259 14.3775 2.62247C15.948 4.19234 16.8125 6.27938 16.8125 8.5C16.8125 10.72 15.948 12.8077 14.3775 14.3775C12.8083 15.948 10.7206 16.8125 8.50001 16.8125Z"
                        fill="black"
                        fillOpacity="0.6"
                      />
                      <path
                        d="M11.4682 11.4688C11.3381 11.4688 11.2075 11.4266 11.0977 11.3387L8.12891 8.96372C7.98819 8.85091 7.90625 8.6805 7.90625 8.5V3.75C7.90625 3.42225 8.17225 3.15625 8.5 3.15625C8.82775 3.15625 9.09375 3.42225 9.09375 3.75V8.215L11.8398 10.4113C12.0957 10.6167 12.1373 10.9902 11.9325 11.2461C11.8149 11.3922 11.6427 11.4688 11.4682 11.4688Z"
                        fill="black"
                        fillOpacity="0.6"
                      />
                    </svg>
                  </button>
                  <button
                    className="px-2 py-2 mr-24"
                    onClick={() =>
                      activeButton === 0
                        ? downloadText(transcription, "transcription.txt")
                        : downloadText(getTimedText(), "timed_transcription.txt")
                    }
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
                        d="M6.60354 10.5151C6.42349 10.5154 6.24516 10.4801 6.0788 10.4112C5.91243 10.3424 5.76131 10.2414 5.63411 10.1139L2.74082 7.22064C2.6404 7.12022 2.58398 6.98402 2.58398 6.842C2.58398 6.69998 2.6404 6.56378 2.74082 6.46336C2.84125 6.36294 2.97745 6.30652 3.11947 6.30652C3.26148 6.30652 3.39769 6.36294 3.49811 6.46336L6.39139 9.35664C6.41925 9.3845 6.45233 9.4066 6.48873 9.42168C6.52513 9.43676 6.56414 9.44452 6.60354 9.44452C6.64294 9.44452 6.68195 9.43676 6.71835 9.42168C6.75475 9.4066 6.78782 9.3845 6.81568 9.35664L9.70897 6.46336C9.80998 6.36574 9.94528 6.31171 10.0857 6.31289C10.2262 6.31407 10.3606 6.37037 10.4599 6.46967C10.5593 6.56897 10.6157 6.70332 10.6169 6.84378C10.6182 6.98424 10.5642 7.11958 10.4667 7.22064L7.57297 10.1139C7.44574 10.2413 7.29461 10.3423 7.12825 10.4112C6.96189 10.48 6.78358 10.5153 6.60354 10.5151Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M12.1319 14.5984H1.2892C0.947409 14.598 0.619735 14.4482 0.378053 14.1819C0.13637 13.9157 0.000411796 13.5547 0 13.1782V9.4333C0 9.29122 0.0512319 9.15496 0.142425 9.05449C0.233619 8.95402 0.357303 8.89758 0.48627 8.89758C0.615237 8.89758 0.738922 8.95402 0.830115 9.05449C0.921308 9.15496 0.97254 9.29122 0.97254 9.4333V13.1782C0.972643 13.2706 1.00604 13.3593 1.0654 13.4247C1.12476 13.4901 1.20525 13.5269 1.2892 13.527H12.1319C12.2158 13.5269 12.2963 13.4901 12.3557 13.4247C12.415 13.3593 12.4484 13.2706 12.4485 13.1782V9.4333C12.4485 9.29122 12.4997 9.15496 12.5909 9.05449C12.6821 8.95402 12.8058 8.89758 12.9348 8.89758C13.0638 8.89758 13.1874 8.95402 13.2786 9.05449C13.3698 9.15496 13.4211 9.29122 13.4211 9.4333V13.1782C13.4206 13.5547 13.2847 13.9157 13.043 14.1819C12.8013 14.4482 12.4736 14.598 12.1319 14.5984Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </button>
                  <div
                    className="mx-2 px-2 py-2"
                    onClick={() =>
                      activeButton === 0
                        ? copyToClipboard(transcription)
                        : copyToClipboard(getTimedText())
                    }
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.43517 17.3084H14.2768C14.6861 17.3079 15.0785 17.1308 15.3679 16.816C15.6572 16.5013 15.8199 16.0746 15.8203 15.6295V7.10304C15.8198 6.65812 15.657 6.23158 15.3677 5.91701C15.0783 5.60245 14.686 5.42557 14.2768 5.42517H6.43563C6.0265 5.42557 5.63424 5.60247 5.34495 5.91704C5.05566 6.23162 4.89297 6.65816 4.89261 7.10304V15.6295C4.89285 16.0744 5.0554 16.5011 5.3446 16.8158C5.63379 17.1306 6.026 17.3077 6.43517 17.3084ZM14.2768 6.67173C14.3821 6.67173 14.483 6.71716 14.5575 6.79803C14.6319 6.8789 14.6738 6.9886 14.6739 7.10304V15.6295C14.6739 15.7441 14.6321 15.854 14.5577 15.935C14.4832 16.0161 14.3822 16.0617 14.2768 16.0618H6.43563C6.33035 16.0616 6.22946 16.0159 6.1551 15.9348C6.08074 15.8538 6.03898 15.744 6.03898 15.6295V7.10304C6.03898 6.98865 6.08077 6.87894 6.15516 6.79806C6.22954 6.71717 6.33043 6.67173 6.43563 6.67173H14.2768Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M1.54354 11.9886H5.46276C5.61478 11.9886 5.76058 11.9229 5.86807 11.8061C5.97556 11.6892 6.03595 11.5306 6.03595 11.3653C6.03595 11.2 5.97556 11.0415 5.86807 10.9246C5.76058 10.8077 5.61478 10.7421 5.46276 10.7421H1.54354C1.43826 10.7419 1.33732 10.6964 1.26288 10.6154C1.18843 10.5345 1.14655 10.4247 1.14643 10.3102V1.78627C1.14655 1.67183 1.18845 1.56213 1.26291 1.48126C1.33736 1.40038 1.4383 1.35496 1.54354 1.35496H9.38474C9.48998 1.35496 9.59092 1.40038 9.66538 1.48126C9.73983 1.56213 9.78173 1.67183 9.78185 1.78627V6.04851C9.78185 6.21381 9.84224 6.37235 9.94973 6.48923C10.0572 6.60612 10.203 6.67179 10.355 6.67179C10.5071 6.67179 10.6528 6.60612 10.7603 6.48923C10.8678 6.37235 10.9282 6.21381 10.9282 6.04851V1.78627C10.9277 1.34178 10.7653 0.915612 10.4764 0.601121C10.1875 0.286631 9.7958 0.109454 9.38704 0.108398H1.54354C1.13437 0.108794 0.742064 0.285681 0.452697 0.600242C0.16333 0.914804 0.000542641 1.34135 5.72205e-05 1.78627V10.3127C0.00114822 10.7573 0.164188 11.1832 0.453477 11.4973C0.742764 11.8114 1.13473 11.9881 1.54354 11.9886Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </div>
                  <button
                    className="flex flex-row rounded-2xl px-2 mb-1 mx-2 gap-1"
                    style={{ backgroundColor: "#00ba9f" }}
                    onClick={handleReset}
                  >
                    <div>
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="my-2"
                      >
                        <g clipPath="url(#clip0_1_864)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.53341 7.04167C0.817633 7.04167 1.04348 6.7951 1.04348 6.5C1.04348 4.48907 1.50822 3.18182 2.25338 2.37456C2.99059 1.57591 4.17242 1.08333 6 1.08333C7.8276 1.08333 9.00939 1.57591 9.74661 2.37456C10.1073 2.76531 10.4023 3.27321 10.6107 3.92135C10.6877 4.16079 10.8969 4.33333 11.1401 4.33333C11.4785 4.33333 11.7321 4.00745 11.63 3.67245C10.8833 1.22415 9.00663 0 6 0C2 0 0 2.16667 0 6.5C0 6.50796 6.73763e-06 6.51592 2.0213e-05 6.52383C0.000511731 6.81341 0.230884 7.04167 0.509807 7.04167H0.53341ZM1.38932 9.07866C1.31234 8.83919 1.10309 8.66667 0.859946 8.66667C0.521474 8.66667 0.26787 8.99253 0.370039 9.32755C1.11671 11.7758 2.99336 13 6 13C10 13 12 10.8333 12 6.5C12 6.49204 12 6.48408 12 6.47617C11.9995 6.18659 11.7691 5.95833 11.4902 5.95833H11.4666C11.1824 5.95833 10.9565 6.2049 10.9565 6.5C10.9565 8.51094 10.4918 9.8182 9.74661 10.6254C9.00939 11.4241 7.8276 11.9167 6 11.9167C4.17242 11.9167 2.99059 11.4241 2.25338 10.6254C1.89269 10.2347 1.5977 9.72682 1.38932 9.07866Z"
                            fill="white"
                          />
                          <path
                            d="M11.4782 0.541687V3.79169H8.34778"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M0.521729 12.4583L0.521729 9.20831H3.65216"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_864">
                            <rect width="12" height="13" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p className="text-white">شروع دوباره</p>
                  </button>
                </div>
                {activeButton === 0 && (
                  <div>
                    <p
                      className="p-2"
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "15px",
                        lineHeight: "1.5",
                        fontFamily: "Vazir, sans-serif",
                      }}
                    >
                      {transcription}
                    </p>
                    {(mediaUrl || recordedAudioBlob) && (
                      <Audio src={mediaUrl || URL.createObjectURL(recordedAudioBlob)} />
                    )}
                  </div>
                )}
                {activeButton === 1 && transcription1 && transcription1.segments && (
                  <div className="p-0" style={{ direction: "rtl" }}>
                    <div
                      className=""
                      style={{
                        maxHeight: "160px",
                        overflowY: "auto",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    >
                      {transcription1.segments.map((segment, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex my-1 px-2 py-3 border-2 border-white rounded-2xl gap-2 ${
                              index % 2 === 0 ? "activeseg" : "deactiveseg"
                            }`}
                            style={{
                              fontFamily: "Vazir, sans-serif",
                              fontSize: "15px",
                              lineHeight: "1.5",
                            }}
                          >
                            <p>{formatTime(convertToSeconds(segment.start))}</p>
                            <p>{formatTime(convertToSeconds(segment.end))}</p>
                            <p>{segment.text.trim() ? segment.text : "موسیقی"}</p>
                          </div>
                        );
                      })}
                    </div>
                    {(mediaUrl || recordedAudioBlob) && (
                      <Audio src={mediaUrl || URL.createObjectURL(recordedAudioBlob)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {!transcription && (
            <p
              className={`mx-15 ${!transcription ? "mt-0" : "mt-2"}`}
              style={{ textAlign: "center", color: "#626262" }}
            >
              برای شروع به صحبت، دکمه را فشار دهید متن پیاده شده آن، در اینجا ظاهر شود
            </p>
          )}
          {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        </div>
      ),
    },
    {
      label: (
        <div className="flex items-center rounded-2xl m-0 p-0" style={{ direction: "rtl" }}>
          <svg
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5044 11.8314L10.1711 8.49805L6.83777 11.8314"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.1711 8.49805V15.998"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.1628 13.823C17.9756 13.3798 18.6176 12.6787 18.9877 11.8301C19.3577 10.9816 19.4346 10.034 19.2063 9.13686C18.9779 8.23974 18.4573 7.44421 17.7267 6.87582C16.996 6.30744 16.0968 5.99856 15.1711 5.99795H14.1211C13.8689 5.02232 13.3987 4.11656 12.7461 3.34878C12.0934 2.58099 11.2751 1.97116 10.3529 1.56512C9.43057 1.15909 8.42823 0.967418 7.42121 1.00452C6.41418 1.04162 5.42867 1.30654 4.53876 1.77934C3.64885 2.25214 2.8777 2.92054 2.28329 3.73427C1.68889 4.548 1.28668 5.4859 1.10693 6.47745C0.927168 7.469 0.97453 8.48839 1.24545 9.459C1.51638 10.4296 2.00381 11.3262 2.67111 12.0813"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5044 11.8314L10.1711 8.49805L6.83777 11.8314"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mx-2 font-light">بارگزاری فایل</span>
        </div>
      ),
      content: (
        <div
          className="flex flex-col rounded-2xl p-0 items-center justify-center"
          style={{ direction: "rtl" }}
        >
          {!transcription && (
            <div
              className="flex flex-col mt-18 mx-20 w-20 rounded-full p-0"
              style={{ backgroundColor: "#118AD3" }}
            >
              <button
                className="rounded-full px-2 py-2"
                style={{ backgroundColor: "#118AD3" }}
                onClick={handleTranscribe1}
                disabled={!uploadedFile || loading}
              >
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
              </button>
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileUpload}
                className="mb-0"
                style={{ direction: "rtl" }}
              />
            </div>
          )}
          {transcription && (
            <div style={{ direction: "rtl" }}>
              <div className="flex flex-col p-4 w-160">
                <div className="flex border-b-1 flex-row border-b-black my-0 h-10 p-0">
                  <button
                    className={`flex flex-row-reverse mx-0 my-0 py-0 gap-1 px-2 ${
                      activeButton === 0 ? "border-b-2" : ""
                    }`}
                    style={{ direction: "rtl" }}
                    onClick={() => setActiveButton(0)}
                  >
                    <p>متن ساده</p>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2"
                    >
                      <path
                        d="M1.47821 3.69568H15.7065"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.35858 6.92932H15.7064"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.47821 10.163H15.7065"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.35858 13.3967H15.7064"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className={`flex flex-row-reverse mx-2 my-0 py-0 gap-1 px-2 ${
                      activeButton === 1 ? "border-b-2 " : ""
                    }`}
                    style={{ direction: "rtl" }}
                    onClick={() => setActiveButton(1)}
                  >
                    <p>متن زمان بندی شده</p>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2"
                    >
                      <path
                        d="M8.50001 16.8125C6.27938 16.8125 4.19235 15.948 2.62248 14.3775C0.0562897 11.8119 -0.553491 7.92109 1.10604 4.69703C1.25626 4.4055 1.6137 4.29091 1.90582 4.44053C2.19795 4.59016 2.31254 4.94819 2.16232 5.24031C0.739696 8.00362 1.2622 11.3381 3.46204 13.538C4.80748 14.884 6.59645 15.625 8.50001 15.625C10.403 15.625 12.1925 14.884 13.538 13.538C14.8834 12.1919 15.625 10.403 15.625 8.5C15.625 6.59644 14.884 4.80747 13.538 3.46203C12.1919 2.11659 10.4036 1.375 8.50001 1.375C6.59645 1.375 4.80748 2.11659 3.46204 3.46203C3.22988 3.69419 2.85463 3.69419 2.62248 3.46203C2.39032 3.22987 2.39032 2.85462 2.62248 2.62247C4.19235 1.05259 6.27938 0.1875 8.50001 0.1875C10.7206 0.1875 12.8083 1.05259 14.3775 2.62247C15.948 4.19234 16.8125 6.27938 16.8125 8.5C16.8125 10.72 15.948 12.8077 14.3775 14.3775C12.8083 15.948 10.7206 16.8125 8.50001 16.8125Z"
                        fill="black"
                        fillOpacity="0.6"
                      />
                      <path
                        d="M11.4682 11.4688C11.3381 11.4688 11.2075 11.4266 11.0977 11.3387L8.12891 8.96372C7.98819 8.85091 7.90625 8.6805 7.90625 8.5V3.75C7.90625 3.42225 8.17225 3.15625 8.5 3.15625C8.82775 3.15625 9.09375 3.42225 9.09375 3.75V8.215L11.8398 10.4113C12.0957 10.6167 12.1373 10.9902 11.9325 11.2461C11.8149 11.3922 11.6427 11.4688 11.4682 11.4688Z"
                        fill="black"
                        fillOpacity="0.6"
                      />
                    </svg>
                  </button>
                  <button
                    className="px-2 py-2 mr-24"
                    onClick={() =>
                      activeButton === 0
                        ? downloadText(transcription, "transcription.txt")
                        : downloadText(getTimedText(), "timed_transcription.txt")
                    }
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
                        d="M6.60354 10.5151C6.42349 10.5154 6.24516 10.4801 6.0788 10.4112C5.91243 10.3424 5.76131 10.2414 5.63411 10.1139L2.74082 7.22064C2.6404 7.12022 2.58398 6.98402 2.58398 6.842C2.58398 6.69998 2.6404 6.56378 2.74082 6.46336C2.84125 6.36294 2.97745 6.30652 3.11947 6.30652C3.26148 6.30652 3.39769 6.36294 3.49811 6.46336L6.39139 9.35664C6.41925 9.3845 6.45233 9.4066 6.48873 9.42168C6.52513 9.43676 6.56414 9.44452 6.60354 9.44452C6.64294 9.44452 6.68195 9.43676 6.71835 9.42168C6.75475 9.4066 6.78782 9.3845 6.81568 9.35664L9.70897 6.46336C9.80998 6.36574 9.94528 6.31171 10.0857 6.31289C10.2262 6.31407 10.3606 6.37037 10.4599 6.46967C10.5593 6.56897 10.6157 6.70332 10.6169 6.84378C10.6182 6.98424 10.5642 7.11958 10.4667 7.22064L7.57297 10.1139C7.44574 10.2413 7.29461 10.3423 7.12825 10.4112C6.96189 10.48 6.78358 10.5153 6.60354 10.5151Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M12.1319 14.5984H1.2892C0.947409 14.598 0.619735 14.4482 0.378053 14.1819C0.13637 13.9157 0.000411796 13.5547 0 13.1782V9.4333C0 9.29122 0.0512319 9.15496 0.142425 9.05449C0.233619 8.95402 0.357303 8.89758 0.48627 8.89758C0.615237 8.89758 0.738922 8.95402 0.830115 9.05449C0.921308 9.15496 0.97254 9.29122 0.97254 9.4333V13.1782C0.972643 13.2706 1.00604 13.3593 1.0654 13.4247C1.12476 13.4901 1.20525 13.5269 1.2892 13.527H12.1319C12.2158 13.5269 12.2963 13.4901 12.3557 13.4247C12.415 13.3593 12.4484 13.2706 12.4485 13.1782V9.4333C12.4485 9.29122 12.4997 9.15496 12.5909 9.05449C12.6821 8.95402 12.8058 8.89758 12.9348 8.89758C13.0638 8.89758 13.1874 8.95402 13.2786 9.05449C13.3698 9.15496 13.4211 9.29122 13.4211 9.4333V13.1782C13.4206 13.5547 13.2847 13.9157 13.043 14.1819C12.8013 14.4482 12.4736 14.598 12.1319 14.5984Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </button>
                  <div
                    className="mx-2 px-2 py-2"
                    onClick={() =>
                      activeButton === 0
                        ? copyToClipboard(transcription)
                        : copyToClipboard(getTimedText())
                    }
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.43517 17.3084H14.2768C14.6861 17.3079 15.0785 17.1308 15.3679 16.816C15.6572 16.5013 15.8199 16.0746 15.8203 15.6295V7.10304C15.8198 6.65812 15.657 6.23158 15.3677 5.91701C15.0783 5.60245 14.686 5.42557 14.2768 5.42517H6.43563C6.0265 5.42557 5.63424 5.60247 5.34495 5.91704C5.05566 6.23162 4.89297 6.65816 4.89261 7.10304V15.6295C4.89285 16.0744 5.0554 16.5011 5.3446 16.8158C5.63379 17.1306 6.026 17.3077 6.43517 17.3084ZM14.2768 6.67173C14.3821 6.67173 14.483 6.71716 14.5575 6.79803C14.6319 6.8789 14.6738 6.9886 14.6739 7.10304V15.6295C14.6739 15.7441 14.6321 15.854 14.5577 15.935C14.4832 16.0161 14.3822 16.0617 14.2768 16.0618H6.43563C6.33035 16.0616 6.22946 16.0159 6.1551 15.9348C6.08074 15.8538 6.03898 15.744 6.03898 15.6295V7.10304C6.03898 6.98865 6.08077 6.87894 6.15516 6.79806C6.22954 6.71717 6.33043 6.67173 6.43563 6.67173H14.2768Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M1.54354 11.9886H5.46276C5.61478 11.9886 5.76058 11.9229 5.86807 11.8061C5.97556 11.6892 6.03595 11.5306 6.03595 11.3653C6.03595 11.2 5.97556 11.0415 5.86807 10.9246C5.76058 10.8077 5.61478 10.7421 5.46276 10.7421H1.54354C1.43826 10.7419 1.33732 10.6964 1.26288 10.6154C1.18843 10.5345 1.14655 10.4247 1.14643 10.3102V1.78627C1.14655 1.67183 1.18845 1.56213 1.26291 1.48126C1.33736 1.40038 1.4383 1.35496 1.54354 1.35496H9.38474C9.48998 1.35496 9.59092 1.40038 9.66538 1.48126C9.73983 1.56213 9.78173 1.67183 9.78185 1.78627V6.04851C9.78185 6.21381 9.84224 6.37235 9.94973 6.48923C10.0572 6.60612 10.203 6.67179 10.355 6.67179C10.5071 6.67179 10.6528 6.60612 10.7603 6.48923C10.8678 6.37235 10.9282 6.21381 10.9282 6.04851V1.78627C10.9277 1.34178 10.7653 0.915612 10.4764 0.601121C10.1875 0.286631 9.7958 0.109454 9.38704 0.108398H1.54354C1.13437 0.108794 0.742064 0.285681 0.452697 0.600242C0.16333 0.914804 0.000542641 1.34135 5.72205e-05 1.78627V10.3127C0.00114822 10.7573 0.164188 11.1832 0.453477 11.4973C0.742764 11.8114 1.13473 11.9881 1.54354 11.9886Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </div>
                  <button
                    className="flex flex-row rounded-2xl px-2 mb-1 mx-2 gap-1"
                    style={{ backgroundColor: "#118AD3" }}
                    onClick={handleReset}
                  >
                    <div>
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="my-2"
                      >
                        <g clipPath="url(#clip0_1_864)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.53341 7.04167C0.817633 7.04167 1.04348 6.7951 1.04348 6.5C1.04348 4.48907 1.50822 3.18182 2.25338 2.37456C2.99059 1.57591 4.17242 1.08333 6 1.08333C7.8276 1.08333 9.00939 1.57591 9.74661 2.37456C10.1073 2.76531 10.4023 3.27321 10.6107 3.92135C10.6877 4.16079 10.8969 4.33333 11.1401 4.33333C11.4785 4.33333 11.7321 4.00745 11.63 3.67245C10.8833 1.22415 9.00663 0 6 0C2 0 0 2.16667 0 6.5C0 6.50796 6.73763e-06 6.51592 2.0213e-05 6.52383C0.000511731 6.81341 0.230884 7.04167 0.509807 7.04167H0.53341ZM1.38932 9.07866C1.31234 8.83919 1.10309 8.66667 0.859946 8.66667C0.521474 8.66667 0.26787 8.99253 0.370039 9.32755C1.11671 11.7758 2.99336 13 6 13C10 13 12 10.8333 12 6.5C12 6.49204 12 6.48408 12 6.47617C11.9995 6.18659 11.7691 5.95833 11.4902 5.95833H11.4666C11.1824 5.95833 10.9565 6.2049 10.9565 6.5C10.9565 8.51094 10.4918 9.8182 9.74661 10.6254C9.00939 11.4241 7.8276 11.9167 6 11.9167C4.17242 11.9167 2.99059 11.4241 2.25338 10.6254C1.89269 10.2347 1.5977 9.72682 1.38932 9.07866Z"
                            fill="white"
                          />
                          <path
                            d="M11.4782 0.541687V3.79169H8.34778"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M0.521729 12.4583L0.521729 9.20831H3.65216"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_864">
                            <rect width="12" height="13" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p className="text-white">شروع دوباره</p>
                  </button>
                </div>
                {activeButton === 0 && (
                  <div>
                    <p
                      className="p-2"
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "15px",
                        lineHeight: "1.5",
                        fontFamily: "Vazir, sans-serif",
                      }}
                    >
                      {transcription}
                    </p>
                    {uploadedFile && <Audio src={URL.createObjectURL(uploadedFile)} />}
                  </div>
                )}
                {activeButton === 1 && transcription1 && transcription1.segments && (
                  <div className="p-0" style={{ direction: "rtl" }}>
                    <div
                      className=""
                      style={{
                        maxHeight: "160px",
                        overflowY: "auto",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    >
                      {transcription1.segments.map((segment, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex my-1 px-2 py-3 border-2 border-white rounded-2xl gap-2 ${
                              index % 2 === 0 ? "activeseg" : "deactiveseg"
                            }`}
                            style={{
                              fontFamily: "Vazir, sans-serif",
                              fontSize: "15px",
                              lineHeight: "1.5",
                            }}
                          >
                            <p>{formatTime(convertToSeconds(segment.start))}</p>
                            <p>{formatTime(convertToSeconds(segment.end))}</p>
                            <p>{segment.text.trim() ? segment.text : "موسیقی"}</p>
                          </div>
                        );
                      })}
                    </div>
                    {uploadedFile && <Audio src={URL.createObjectURL(uploadedFile)} />}
                  </div>
                )}
              </div>
            </div>
          )}
          {!transcription && (
            <p className="mt-2 mb-18 mx-18" style={{ textAlign: "center", color: "#626262" }}>
              برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید متن پیاده شده آن، در اینجا
              ظاهر می شود
            </p>
          )}
          {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        </div>
      ),
    },
    {
      label: (
        <div className="flex items-center rounded-2xl m-0 p-0" style={{ direction: "rtl" }}>
          <svg
            width="17"
            height="21"
            viewBox="0 0 17 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.80607 4.14507L10.0299 1.92129C11.4361 0.678582 13.529 0.809393 14.7717 2.18291C15.9163 3.42561 15.9163 5.35507 14.7717 6.63048L12.5153 8.85427L13.202 9.54103L15.4585 7.28454C17.1263 5.6167 17.0609 2.86967 15.3604 1.20183C13.6926 -0.400609 11.0436 -0.400609 9.3758 1.20183L7.11931 3.42561C5.45147 5.12615 5.45147 7.84048 7.11931 9.54102L7.80607 8.85427C6.53066 7.54616 6.53066 5.45318 7.80607 4.14507Z"
              fill="currentColor"
            />
            <path
              d="M7.41365 19.0575L9.67014 16.8337C11.338 15.1331 11.338 12.4188 9.67014 10.751L8.98338 11.4377C10.2915 12.7458 10.2915 14.8388 8.98338 16.1469L6.72689 18.3707C5.41878 19.6788 3.32581 19.6788 2.0177 18.3707C0.70959 17.0626 0.70959 14.9696 2.0177 13.6615L4.27419 11.4377L3.58743 10.751L1.36364 12.9748C-0.369601 14.6099 -0.467709 17.3242 1.16743 19.0575C2.80257 20.7907 5.51689 20.8888 7.25014 19.2537C7.31554 19.1556 7.38095 19.1229 7.41365 19.0575Z"
              fill="currentColor"
            />
            <path
              d="M11.4833 7.79553L10.7896 7.10181L5.37857 12.5128L6.07229 13.2066L11.4833 7.79553Z"
              fill="currentColor"
            />
          </svg>
          <span className="mx-2 font-light">لینک</span>
        </div>
      ),
      content: (
        <div className="flex flex-col rounded-2xl px-2 py-2" style={{ direction: "rtl" }}>
          {showForm ? (
            <div className="px-20 py-28">
              <div
                className="rounded-full flex flex-row-reverse w-64 mx-24 p-1"
                style={{ border: "1px solid #FF1654" }}
              >
                <form onSubmit={handleSubmit} className="flex flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="p-3 rounded-3xl mx-1"
                    style={{
                      backgroundColor: "#FF1654",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
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
                  </button>
                  <input
                    type="text"
                    placeholder="example.com/sample.mp3"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    required
                    className="rounded-2xl p-1 mb-1"
                  />
                </form>
              </div>
              <p className="mt-2 mx-10" style={{ textAlign: "center", color: "#626262" }}>
                نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد و دکمه را فشار دهید
              </p>
              {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
            </div>
          ) : (
            <div style={{ direction: "rtl" }}>
              <div className="flex flex-col p-4 ">
                <div className="flex border-b-1 flex-row border-b-black my-0 h-10 p-0">
                  <button
                    className={`flex flex-row-reverse mx-0 my-0 py-0 gap-1 px-2 ${
                      activeButton === 0 ? "border-b-2" : ""
                    }`}
                    style={{ direction: "rtl" }}
                    onClick={() => setActiveButton(0)}
                  >
                    <p>متن ساده</p>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2"
                    >
                      <path
                        d="M1.47821 3.69568H15.7065"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.35858 6.92932H15.7064"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.47821 10.163H15.7065"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.35858 13.3967H15.7064"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className={`flex flex-row-reverse mx-2 my-0 py-0 gap-1 px-2  ${
                      activeButton === 1 ? "border-b-2 " : ""
                    }`}
                    style={{ direction: "rtl" }}
                    onClick={() => setActiveButton(1)}
                  >
                    <p>متن زمان بندی شده</p>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="my-2"
                    >
                      <path
                        d="M8.50001 16.8125C6.27938 16.8125 4.19235 15.948 2.62248 14.3775C0.0562897 11.8119 -0.553491 7.92109 1.10604 4.69703C1.25626 4.4055 1.6137 4.29091 1.90582 4.44053C2.19795 4.59016 2.31254 4.94819 2.16232 5.24031C0.739696 8.00362 1.2622 11.3381 3.46204 13.538C4.80748 14.884 6.59645 15.625 8.50001 15.625C10.403 15.625 12.1925 14.884 13.538 13.538C14.8834 12.1919 15.625 10.403 15.625 8.5C15.625 6.59644 14.884 4.80747 13.538 3.46203C12.1919 2.11659 10.4036 1.375 8.50001 1.375C6.59645 1.375 4.80748 2.11659 3.46204 3.46203C3.22988 3.69419 2.85463 3.69419 2.62248 3.46203C2.39032 3.22987 2.39032 2.85462 2.62248 2.62247C4.19235 1.05259 6.27938 0.1875 8.50001 0.1875C10.7206 0.1875 12.8083 1.05259 14.3775 2.62247C15.948 4.19234 16.8125 6.27938 16.8125 8.5C16.8125 10.72 15.948 12.8077 14.3775 14.3775C12.8083 15.948 10.7206 16.8125 8.50001 16.8125Z"
                        fill="black"
                        fillOpacity="0.6"
                      />
                      <path
                        d="M11.4682 11.4688C11.3381 11.4688 11.2075 11.4266 11.0977 11.3387L8.12891 8.96372C7.98819 8.85091 7.90625 8.6805 7.90625 8.5V3.75C7.90625 3.42225 8.17225 3.15625 8.5 3.15625C8.82775 3.15625 9.09375 3.42225 9.09375 3.75V8.215L11.8398 10.4113C12.0957 10.6167 12.1373 10.9902 11.9325 11.2461C11.8149 11.3922 11.6427 11.4688 11.4682 11.4688Z"
                        fill="black"
                        fillOpacity="0.6"
                      />
                    </svg>
                  </button>
                  <button
                    className="px-2 py-2 mr-24"
                    onClick={() =>
                      activeButton === 0
                        ? downloadText(transcription, "transcription.txt")
                        : downloadText(getTimedText(), "timed_transcription.txt")
                    }
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
                        d="M6.60354 10.5151C6.42349 10.5154 6.24516 10.4801 6.0788 10.4112C5.91243 10.3424 5.76131 10.2414 5.63411 10.1139L2.74082 7.22064C2.6404 7.12022 2.58398 6.98402 2.58398 6.842C2.58398 6.69998 2.6404 6.56378 2.74082 6.46336C2.84125 6.36294 2.97745 6.30652 3.11947 6.30652C3.26148 6.30652 3.39769 6.36294 3.49811 6.46336L6.39139 9.35664C6.41925 9.3845 6.45233 9.4066 6.48873 9.42168C6.52513 9.43676 6.56414 9.44452 6.60354 9.44452C6.64294 9.44452 6.68195 9.43676 6.71835 9.42168C6.75475 9.4066 6.78782 9.3845 6.81568 9.35664L9.70897 6.46336C9.80998 6.36574 9.94528 6.31171 10.0857 6.31289C10.2262 6.31407 10.3606 6.37037 10.4599 6.46967C10.5593 6.56897 10.6157 6.70332 10.6169 6.84378C10.6182 6.98424 10.5642 7.11958 10.4667 7.22064L7.57297 10.1139C7.44574 10.2413 7.29461 10.3423 7.12825 10.4112C6.96189 10.48 6.78358 10.5153 6.60354 10.5151Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M12.1319 14.5984H1.2892C0.947409 14.598 0.619735 14.4482 0.378053 14.1819C0.13637 13.9157 0.000411796 13.5547 0 13.1782V9.4333C0 9.29122 0.0512319 9.15496 0.142425 9.05449C0.233619 8.95402 0.357303 8.89758 0.48627 8.89758C0.615237 8.89758 0.738922 8.95402 0.830115 9.05449C0.921308 9.15496 0.97254 9.29122 0.97254 9.4333V13.1782C0.972643 13.2706 1.00604 13.3593 1.0654 13.4247C1.12476 13.4901 1.20525 13.5269 1.2892 13.527H12.1319C12.2158 13.5269 12.2963 13.4901 12.3557 13.4247C12.415 13.3593 12.4484 13.2706 12.4485 13.1782V9.4333C12.4485 9.29122 12.4997 9.15496 12.5909 9.05449C12.6821 8.95402 12.8058 8.89758 12.9348 8.89758C13.0638 8.89758 13.1874 8.95402 13.2786 9.05449C13.3698 9.15496 13.4211 9.29122 13.4211 9.4333V13.1782C13.4206 13.5547 13.2847 13.9157 13.043 14.1819C12.8013 14.4482 12.4736 14.598 12.1319 14.5984Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </button>
                  <div
                    className="mx-2 px-2 py-2"
                    onClick={() =>
                      activeButton === 0
                        ? copyToClipboard(transcription)
                        : copyToClipboard(getTimedText())
                    }
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.43517 17.3084H14.2768C14.6861 17.3079 15.0785 17.1308 15.3679 16.816C15.6572 16.5013 15.8199 16.0746 15.8203 15.6295V7.10304C15.8198 6.65812 15.657 6.23158 15.3677 5.91701C15.0783 5.60245 14.686 5.42557 14.2768 5.42517H6.43563C6.0265 5.42557 5.63424 5.60247 5.34495 5.91704C5.05566 6.23162 4.89297 6.65816 4.89261 7.10304V15.6295C4.89285 16.0744 5.0554 16.5011 5.3446 16.8158C5.63379 17.1306 6.026 17.3077 6.43517 17.3084ZM14.2768 6.67173C14.3821 6.67173 14.483 6.71716 14.5575 6.79803C14.6319 6.8789 14.6738 6.9886 14.6739 7.10304V15.6295C14.6739 15.7441 14.6321 15.854 14.5577 15.935C14.4832 16.0161 14.3822 16.0617 14.2768 16.0618H6.43563C6.33035 16.0616 6.22946 16.0159 6.1551 15.9348C6.08074 15.8538 6.03898 15.744 6.03898 15.6295V7.10304C6.03898 6.98865 6.08077 6.87894 6.15516 6.79806C6.22954 6.71717 6.33043 6.67173 6.43563 6.67173H14.2768Z"
                        fill="#8F8F8F"
                      />
                      <path
                        d="M1.54354 11.9886H5.46276C5.61478 11.9886 5.76058 11.9229 5.86807 11.8061C5.97556 11.6892 6.03595 11.5306 6.03595 11.3653C6.03595 11.2 5.97556 11.0415 5.86807 10.9246C5.76058 10.8077 5.61478 10.7421 5.46276 10.7421H1.54354C1.43826 10.7419 1.33732 10.6964 1.26288 10.6154C1.18843 10.5345 1.14655 10.4247 1.14643 10.3102V1.78627C1.14655 1.67183 1.18845 1.56213 1.26291 1.48126C1.33736 1.40038 1.4383 1.35496 1.54354 1.35496H9.38474C9.48998 1.35496 9.59092 1.40038 9.66538 1.48126C9.73983 1.56213 9.78173 1.67183 9.78185 1.78627V6.04851C9.78185 6.21381 9.84224 6.37235 9.94973 6.48923C10.0572 6.60612 10.203 6.67179 10.355 6.67179C10.5071 6.67179 10.6528 6.60612 10.7603 6.48923C10.8678 6.37235 10.9282 6.21381 10.9282 6.04851V1.78627C10.9277 1.34178 10.7653 0.915612 10.4764 0.601121C10.1875 0.286631 9.7958 0.109454 9.38704 0.108398H1.54354C1.13437 0.108794 0.742064 0.285681 0.452697 0.600242C0.16333 0.914804 0.000542641 1.34135 5.72205e-05 1.78627V10.3127C0.00114822 10.7573 0.164188 11.1832 0.453477 11.4973C0.742764 11.8114 1.13473 11.9881 1.54354 11.9886Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </div>
                  <button
                    className="flex flex-row rounded-2xl px-2 mb-1 mx-2 gap-1"
                    style={{ backgroundColor: "#FF1654" }}
                    onClick={handleReset}
                  >
                    <div>
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="my-2"
                      >
                        <g clipPath="url(#clip0_1_864)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.53341 7.04167C0.817633 7.04167 1.04348 6.7951 1.04348 6.5C1.04348 4.48907 1.50822 3.18182 2.25338 2.37456C2.99059 1.57591 4.17242 1.08333 6 1.08333C7.8276 1.08333 9.00939 1.57591 9.74661 2.37456C10.1073 2.76531 10.4023 3.27321 10.6107 3.92135C10.6877 4.16079 10.8969 4.33333 11.1401 4.33333C11.4785 4.33333 11.7321 4.00745 11.63 3.67245C10.8833 1.22415 9.00663 0 6 0C2 0 0 2.16667 0 6.5C0 6.50796 6.73763e-06 6.51592 2.0213e-05 6.52383C0.000511731 6.81341 0.230884 7.04167 0.509807 7.04167H0.53341ZM1.38932 9.07866C1.31234 8.83919 1.10309 8.66667 0.859946 8.66667C0.521474 8.66667 0.26787 8.99253 0.370039 9.32755C1.11671 11.7758 2.99336 13 6 13C10 13 12 10.8333 12 6.5C12 6.49204 12 6.48408 12 6.47617C11.9995 6.18659 11.7691 5.95833 11.4902 5.95833H11.4666C11.1824 5.95833 10.9565 6.2049 10.9565 6.5C10.9565 8.51094 10.4918 9.8182 9.74661 10.6254C9.00939 11.4241 7.8276 11.9167 6 11.9167C4.17242 11.9167 2.99059 11.4241 2.25338 10.6254C1.89269 10.2347 1.5977 9.72682 1.38932 9.07866Z"
                            fill="white"
                          />
                          <path
                            d="M11.4782 0.541687V3.79169H8.34778"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M0.521729 12.4583L0.521729 9.20831H3.65216"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_864">
                            <rect width="12" height="13" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p className="text-white">شروع دوباره</p>
                  </button>
                </div>
                {activeButton === 0 && (
                  <div>
                    <p
                      className="p-2"
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "15px",
                        lineHeight: "1.5",
                        fontFamily: "Vazir, sans-serif",
                      }}
                    >
                      {transcription}
                    </p>
                    {mediaUrl && <Audio src={mediaUrl} />}
                  </div>
                )}
                {activeButton === 1 && transcription1 && transcription1.segments && (
                  <div className="p-0" style={{ direction: "rtl" }}>
                    <div
                      className=""
                      style={{
                        maxHeight: "160px",
                        overflowY: "auto",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    >
                      {transcription1.segments.map((segment, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex my-1 px-2 py-3 border-2 border-white rounded-2xl gap-2 ${
                              index % 2 == 0 ? "activeseg" : "deactiveseg"
                            }`}
                            style={{
                              fontFamily: "Vazir, sans-serif",
                              fontSize: "15px",
                              lineHeight: "1.5",
                            }}
                          >
                            <p>{formatTime(convertToSeconds(segment.start))}</p>
                            <p>{formatTime(convertToSeconds(segment.end))}</p>
                            <p>{segment.text.trim() ? segment.text : "موسیقی"}</p>
                          </div>
                        );
                      })}
                    </div>
                    {mediaUrl && <Audio src={mediaUrl} />}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];
  const Tab1 = ({ isActive, onClick }) => (
    <button
      className={`px-2 py-2 font-medium ${
        isActive ? "active rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {tabs[0].label}
    </button>
  );
  const Tab2 = ({ isActive, onClick }) => (
    <button
      className={`px-2 py-2 font-medium ${
        isActive ? "active2 rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {tabs[1].label}
    </button>
  );
  const Tab3 = ({ isActive, onClick }) => (
    <button
      className={`px-2 py-2 font-medium ${
        isActive ? "active3 rounded-t-2xl" : "deactive rounded-2xl"
      }`}
      onClick={onClick}
    >
      {tabs[2].label}
    </button>
  );
  const TabContent1 = ({ isActive }) => (
    <div
      className={`border-2 rounded-2xl ${
        isActive ? "rounded-tr-none activecont1" : "deactivecont1 rounded-tr-2xl"
      }`}
    >
      <div className={`${isActive ? "block" : "hidden"}`}>{tabs[0].content}</div>
    </div>
  );
  const TabContent2 = ({ isActive }) => (
    <div className={`border-2 rounded-2xl ${isActive ? "activecont2" : "deactivecont2"} `}>
      <div className={`${isActive ? "block" : "hidden"}`}>{tabs[1].content}</div>
    </div>
  );
  const TabContent3 = ({ isActive }) => (
    <div className={`border-2 rounded-2xl ${isActive ? "activecont3" : "deactivecont3"} `}>
      <div className={`${isActive ? "block" : "hidden"}`}>{tabs[2].content}</div>
    </div>
  );
  return (
    <div className="p-0 m-0">
      <div className="flex" style={{ direction: "rtl" }}>
        {tabs.map(
          (tab, index) =>
            (index === 0 && (
              <Tab1
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            )) ||
            (index === 1 && (
              <Tab2
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            )) ||
            (index === 2 && (
              <Tab3
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))
        )}
      </div>
      {tabs.map(
        (tab, index) =>
          (index === 0 && (
            <TabContent1
              key={index}
              isActive={activeTab === index}
              content={tab}
              onClick={() => setActiveTab(index)}
            />
          )) ||
          (index === 1 && (
            <TabContent2
              key={index}
              isActive={activeTab === index}
              content={tab}
              onClick={() => setActiveTab(index)}
            />
          )) ||
          (index === 2 && (
            <TabContent3
              key={index}
              isActive={activeTab === index}
              content={tab}
              onClick={() => setActiveTab(index)}
            />
          ))
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
export default Tabs;

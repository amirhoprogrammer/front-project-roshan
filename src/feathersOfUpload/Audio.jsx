import { useState, useRef } from "react";
import "../App.css";
import "./audio.css";
function Audio(src) {
  const [progress, setProgress] = useState(0); // درصد پیشرفت
  const [isPlaying, setIsPlaying] = useState(false); // وضعیت پخش
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null); // رفرنس به تگ audio
  // به‌روزرسانی Progress Bar
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    setProgress(progressPercent);
  };
  // کنترل پخش و توقف
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };
  // وقتی صدا به پایان رسید
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    audioRef.current.currentTime = 0; // بازگرداندن به ابتدا
  };
  // جابجایی در صدا با کلیک روی Progress Bar
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const seekPercent = (clickPosition / progressBarWidth) * 100;
    const audio = audioRef.current;
    audio.currentTime = (seekPercent / 100) * audio.duration;
    setProgress(seekPercent);
  };

  // تنظیم صدا
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume; // به‌روزرسانی مقدار صدا
  };
  return (
    <div
      className="mx-10 flex flex-row rounded-2xl align-middle items-center justify-center p-1 gap-2.5"
      style={{ backgroundColor: "#F8F8F8" }}
    >
      <button className="mx-2 py-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="12" height="12" rx="2" fill="#3D3D3D" />
        </svg>
      </button>
      <button className="mx-2 py-2" onClick={togglePlayPause}>
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.53081 11.9998H0.469187C0.210063 11.9998 0 11.5367 0 10.9656V1.04373C0 0.472552 0.210063 0.00952148 0.469187 0.00952148H1.53081C1.78994 0.00952148 2 0.472552 2 1.04373V10.9656C2 11.5367 1.78994 11.9998 1.53081 11.9998Z"
            fill="#3D3D3D"
          />
          <path
            d="M6.53081 11.9902H5.46919C5.21006 11.9902 5 11.5272 5 10.956V1.03421C5 0.463031 5.21006 0 5.46919 0H6.53081C6.78994 0 7 0.463031 7 1.03421V10.956C7 11.5272 6.78994 11.9902 6.53081 11.9902Z"
            fill="#3D3D3D"
          />
        </svg>
      </button>
      <audio
        ref={audioRef}
        src={src} // مسیر فایل صوتی
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progress}%` }} // تنظیم عرض نوار پیشرفت
        ></div>
      </div>
      {/*<button onClick={togglePlayPause}>{isPlaying ? "توقف" : "پخش"}</button>*/}
      <div className="flex">4:29</div>
      <div className="flex">
        <svg
          width="15"
          height="13"
          viewBox="0 0 15 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.19652 8.9946L7.6608 12.3799C7.75893 12.4781 7.89522 12.538 8.04516 12.538C8.3448 12.538 8.59023 12.2955 8.59023 11.9982V0.53973C8.59023 0.24267 8.3448 0 8.04516 0C7.89237 0 7.75344 0.0627 7.65522 0.16356L4.19913 3.54336H2.0487C1.44639 3.54336 0.958496 4.03128 0.958496 4.63365V7.9044C0.958496 8.50674 1.44642 8.9946 2.0487 8.9946H4.19652ZM11.6566 2.92197C11.3949 3.18084 11.3949 3.60336 11.6566 3.86508C12.3053 4.5165 12.7085 5.41329 12.7085 6.40533C12.7085 7.39764 12.3026 8.29413 11.654 8.9457C11.392 9.20739 11.392 9.62982 11.654 9.88875C11.9127 10.1505 12.3353 10.1505 12.597 9.88875C13.4882 8.99739 14.0415 7.76553 14.0415 6.40536C14.0415 5.04801 13.4937 3.81861 12.6052 2.92746L12.5996 2.922C12.3381 2.66022 11.9183 2.66022 11.6566 2.92197ZM11.0923 8.38134C11.5964 7.87458 11.9073 7.1766 11.9073 6.4053C11.9073 5.63391 11.5964 4.93623 11.0923 4.42917C10.8307 4.16754 10.4082 4.16754 10.1492 4.42917C9.88752 4.68819 9.88752 5.11056 10.1492 5.37228C10.4109 5.63673 10.5743 6.00192 10.5743 6.4053C10.5743 6.80877 10.4109 7.17399 10.1492 7.43835C9.88752 7.70004 9.88752 8.1198 10.1492 8.38137C10.4082 8.64042 10.8307 8.64303 11.0923 8.38134Z"
            fill="#3D3D3D"
          />
        </svg>
      </div>
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
}
export default Audio;

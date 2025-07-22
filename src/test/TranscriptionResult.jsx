// src/TranscriptionResult.jsx
import React from "react";
import "@fontsource/vazir";

function TranscriptionResult({ transcription, onReset }) {
  return (
    <div
      className="transcription-container"
      style={{
        direction: "rtl",
        fontFamily: "Vazir, sans-serif",
      }}
    >
      <h2 className="transcription-title">نتیجه تبدیل به متن</h2>
      <div className="transcription-content">
        <p>{transcription || "هیچ متنی برای نمایش وجود ندارد."}</p>
      </div>
      <button onClick={onReset} className="reset-button">
        تلاش دوباره
      </button>
    </div>
  );
}

export default TranscriptionResult;

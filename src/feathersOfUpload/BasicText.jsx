import { useState, useRef } from "react";
import Audio from "./Audio";
import "../App.css";
import "./basictext.css";
import "@fontsource/vazir";
import { transcribeFiles } from "../services/Api";
function BasicText() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeFiles([mediaUrl]);
      const textSegments = data[0].segments
        .filter((segment) => segment.text.trim() !== "")
        .map((segment) => segment.text)
        .join("\n");
      setTranscription(textSegments);
      setShowForm(false);
      setLoading(false);
    } catch (err) {
      setError(`خطا در تبدیل فایل: ${err.message}`);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowForm(true);
    setTranscription(null);
    setMediaUrl("");
    setError(null);
  };
  return (
    <div className="flex flex-col" style={{ direction: "rtl" }}>
      {showForm ? (
        <div className="p-2">
          <form onSubmit={handleSubmit} className="flex flex-row-reverse">
            <button
              type="submit"
              disabled={loading}
              className="p-1.5 rounded-3xl"
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
          {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        </div>
      ) : (
        <div className="transcription-container">
          <h2 className="transcription-title">نتیجه تبدیل به متن</h2>
          <div className="transcription-content">
            <p>{transcription || "هیچ متنی برای نمایش وجود ندارد."}</p>
          </div>
          <button onClick={handleReset} className="reset-button">
            تلاش دوباره
          </button>
        </div>
      )}
      <Audio />
    </div>
  );
}
export default BasicText;

/*<div className="flex flex-col">  
      <div>
        <p
          className="p-2 m-0"
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            lineHeight: "1.5",
            fontFamily: "Vazir, sans-serif",
          }}
        >
          {transcription}
        </p>
        </div>
      <Audio />
    </div>*/

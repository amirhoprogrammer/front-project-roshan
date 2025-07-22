// src/components/Transcribe.jsx
import React, { useState } from "react";
import { transcribeFiles } from "../services/Api";

const Transcribe = () => {
  const [mediaUrl, setMediaUrl] = useState("");
  //const [result, setResult] = useState(null);
  const [transcription, setTranscription] = useState(null);
  //const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeFiles([mediaUrl]);
      //setResult(data);
      const textSegments = data[0].segments
        .filter((segment) => segment.text.trim() !== "")
        .map((segment) => segment.text)
        .join("\n");
      setTranscription(textSegments);
      setLoading(false);
      //setText(data.text);
    } catch (err) {
      setError(`خطا در تبدیل فایل :${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "right", padding: "20px" }}>
      <h1>تبدیل صوت/ویدئو به متن</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="آدرس فایل صوتی یا تصویری"
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "در حال پردازش..." : "تبدیل"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {transcription && (
        <div>
          <h2 style={{ marginTop: "20px" }}>نتیجه:</h2>
          {/*<pre style={{ whiteSpace: "pre wrap" }}>{text}</pre>
          <pre>{JSON.stringify(result, null, 2)}</pre>*/}
          <p style={{ whiteSpace: "pre-wrap", fontSize: "16px", lineHeight: "1.5" }}>
            {transcription}
          </p>
        </div>
      )}
    </div>
  );
};

export default Transcribe;

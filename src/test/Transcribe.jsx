// src/components/Transcribe.jsx
import React, { useState } from "react";
import { transcribeFiles } from "../services/Api";

const Transcribe = () => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeFiles([mediaUrl]);
      setResult(data);
      setLoading(false);
    } catch (err) {
      setError("خطا در تبدیل فایل");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>تبدیل صوت/ویدئو به متن</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="آدرس فایل صوتی یا تصویری"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "در حال پردازش..." : "تبدیل"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h2>نتیجه:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Transcribe;

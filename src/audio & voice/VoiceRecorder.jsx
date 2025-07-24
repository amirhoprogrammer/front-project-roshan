import { useState, useRef } from "react";
function VoiceRecoder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => audioChunks.push(event.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        if (onRecordingComplete) onRecordingComplete(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("خطا در دسترسی به میکروفون:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setStream(null);
      setMediaRecorder(null);
    }
  };
  return (
    <div style={{ direction: "rtl" }}>
      {!isRecording && !audioBlob && (
        <button
          className="rounded-full px-4 py-2"
          style={{ backgroundColor: "#00B3A1" }}
          onClick={startRecording}
        >
          <svg
            width="20"
            height="34"
            viewBox="0 0 20 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0.638916L9.20755 0.686849L8.43103 0.833843L7.68008 1.06392L6.95789 1.38987L6.28044 1.79889L5.65731 2.28461L5.0981 2.84383L4.61238 3.46696L4.20654 4.14122L3.8774 4.86341L3.64733 5.61755L3.50033 6.39407L3.4524 7.18656V18.6361L3.50033 19.4254L3.64733 20.1988L3.8774 20.9561L4.20654 21.6783L4.61238 22.3525L5.0981 22.9757L5.65731 23.5349L6.28044 24.0206L6.95789 24.4296L7.68008 24.7556L8.43103 24.9889L9.20755 25.1295L10 25.1806L10.7861 25.1295L11.5658 24.9889L12.32 24.7556L13.039 24.4296L13.7196 24.0206L14.3364 23.5349L14.8956 22.9757L15.3877 22.3525L15.7935 21.6783L16.1163 20.9561L16.3527 20.1988L16.4965 19.4254L16.5413 18.6361V7.18656L16.4965 6.39407L16.3527 5.61755L16.1163 4.86341L15.7935 4.14122L15.3877 3.46696L14.8956 2.84383L14.3364 2.28461L13.7196 1.79889L13.039 1.38987L12.32 1.06392L11.5658 0.833843L10.7861 0.686849L10 0.638916Z"
              fill="white"
            />
          </svg>
        </button>
      )}
      {isRecording && (
        <button
          className="rounded-full px-4 py-2"
          style={{ backgroundColor: "#FF1654" }}
          onClick={stopRecording}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="5" y="5" width="10" height="10" rx="2" fill="white" />
          </svg>
        </button>
      )}
    </div>
  );
}
export default VoiceRecoder;

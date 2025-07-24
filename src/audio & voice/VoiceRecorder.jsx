import { useState, useRef } from "react";
function VoiceRecoder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  //function for start to record the voice
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
  //function to stop recoding
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
            className="items-center justify-center"
          >
            <path
              d="M10 0.638916L9.20755 0.686849L8.43103 0.833843L7.68008 1.06392L6.95789 1.38987L6.28044 1.79889L5.65731 2.28461L5.0981 2.84383L4.61238 3.46696L4.20654 4.14122L3.8774 4.86341L3.64733 5.61755L3.50033 6.39407L3.4524 7.18656V18.6361L3.50033 19.4254L3.64733 20.1988L3.8774 20.9561L4.20654 21.6783L4.61238 22.3525L5.0981 22.9757L5.65731 23.5349L6.28044 24.0206L6.95789 24.4296L7.68008 24.7556L8.43103 24.9889L9.20755 25.1295L10 25.1806L10.7861 25.1295L11.5658 24.9889L12.32 24.7556L13.039 24.4296L13.7196 24.0206L14.3364 23.5349L14.8956 22.9757L15.3877 22.3525L15.7935 21.6783L16.1163 20.9561L16.3527 20.1988L16.4965 19.4254L16.5413 18.6361V7.18656L16.4965 6.39407L16.3527 5.61755L16.1163 4.86341L15.7935 4.14122L15.3877 3.46696L14.8956 2.84383L14.3364 2.28461L13.7196 1.79889L13.039 1.38987L12.32 1.06392L11.5658 0.833843L10.7861 0.686849L10 0.638916ZM9.66451 2.291H10.3356L10.997 2.38048L11.6425 2.55943L12.2561 2.82785L12.8281 3.17617L13.349 3.59478L13.8059 4.08689L14.1926 4.63333L14.4993 5.23089L14.723 5.86041L14.8604 6.5155L14.9084 7.18656V18.6361L14.8604 19.3072L14.723 19.9591L14.4993 20.5918L14.1926 21.183L13.8059 21.7358L13.349 22.2247L12.8281 22.6465L12.2561 22.9948L11.6425 23.2601L10.997 23.4422L10.3356 23.5317H9.66451L8.99984 23.4422L8.35434 23.2601L7.7376 22.9948L7.1656 22.6465L6.64793 22.2247L6.19097 21.7358L5.80431 21.183L5.49434 20.5918L5.27065 19.9591L5.13964 19.3072L5.0917 18.6361V7.18656L5.13964 6.5155L5.27065 5.86041L5.49434 5.23089L5.80431 4.63333L6.19097 4.08689L6.64793 3.59478L7.1656 3.17617L7.7376 2.82785L8.35434 2.55943L8.99984 2.38048L9.66451 2.291ZM0.180176 18.6361L0.224913 19.5469L0.349539 20.448L0.560444 21.3396L0.851237 22.2024L1.22192 23.0364L1.66929 23.8321L2.19016 24.5798L2.77495 25.2796L3.42364 25.9251L4.12665 26.5003L4.884 27.0116L5.68288 27.4526L6.51691 27.8169L7.3861 28.0949L8.27765 28.2994L9.17879 28.4177V31.725H3.4524V33.3611H16.5413V31.725H10.8181V28.4177L11.7192 28.2994L12.6108 28.0949L13.4768 27.8169L14.3172 27.4526L15.1161 27.0116L15.8734 26.5003L16.5764 25.9251L17.2219 25.2796L17.8099 24.5798L18.3276 23.8321L18.775 23.0364L19.1424 22.2024L19.4364 21.3396L19.6473 20.448L19.7752 19.5469L19.8135 18.6361H18.1806L18.1327 19.4893L17.9984 20.3362L17.7812 21.1638L17.4712 21.9627L17.0845 22.7264L16.6148 23.4454L16.0779 24.1069L15.4708 24.714L14.8061 25.2541L14.0871 25.7174L13.3266 26.1105L12.5277 26.4141L11.6969 26.6377L10.8564 26.772L10 26.8135L9.14364 26.772L8.29682 26.6377L7.47237 26.4141L6.67349 26.1105L5.90656 25.7174L5.19077 25.2541L4.5229 24.714L3.91575 24.1069L3.3789 23.4454L2.91555 22.7264L2.52569 21.9627L2.21892 21.1638L1.99524 20.3362L1.86102 19.4893L1.81948 18.6361H0.180176Z"
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

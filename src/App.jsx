//import { useState } from "react";
import Home from "./pages/Home";
import ChangeTheVoice from "./pages/ChangeTheVoice.jsx";
import Guest from "./feathers/Guest";
import Archive from "./pages/Archive.jsx";
import Tabs from "./feathers/Tabs";
import Language from "./feathers/Language";
import Audio from "./audio & voice/Audio";
import VoiceRecoder from "./audio & voice/VoiceRecorder";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/changethevoice" element={<ChangeTheVoice />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/guest" element={<Guest />} />
      <Route path="/tabs" element={<Tabs />} />
      <Route path="/language" element={<Language />} />
      <Route path="/audio" element={<Audio />} />
      <Route path="/voicerecorder" element={<VoiceRecoder />} />
    </Routes>
  );
}

export default App;

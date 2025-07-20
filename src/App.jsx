//import { useState } from "react";
import Home from "./pages/Home";
import ChangeTheVoice from "./pages/ChangeTheVoice.jsx";
import Guest from "./feathers/Guest";
import Archive from "./pages/Archive.jsx";
import Tabs from "./feathers/Tabs";
import Language from "./feathers/Language";
import UploadHome from "./feathersOfUpload/UploadHome";
import TimeText from "./feathersOfUpload/TimeText";
import BasicText from "./feathersOfUpload/BasicText";
import Audio from "./feathersOfUpload/Audio";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/changethevoice" element={<ChangeTheVoice />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/guest" element={<Guest />} />
      <Route path="/tabs" element={<Tabs />} />
      <Route path="/language" element={<Language />} />
      <Route path="/uploadhome" element={<UploadHome />} />
      <Route path="/timetext" element={<TimeText />} />
      <Route path="/basictext" element={<BasicText />} />
      <Route path="/audio" element={<Audio />} />
    </Routes>
  );
}

export default App;

//import { useState } from "react";
import Home from "./pages/Home";
import ChangeTheVoice from "./pages/ChangeTheVoice.jsx";
import Guest from "./feathers/Guest";
import Archive from "./pages/Archive.jsx";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/changethevoice" element={<ChangeTheVoice />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/guest" element={<Guest />} />
    </Routes>
  );
}

export default App;

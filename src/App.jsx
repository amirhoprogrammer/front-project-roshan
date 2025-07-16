import { useState } from "react";
import Home from "./pages/Home";
import ChangeTheVoice from "./pages/ChangeTheVoice";
import Archive from "./pages/Archive";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="./" element={<Home />} />
      <Route path="./changethevoice" element={<ChangeTheVoice />} />
      <Route path="./archieve" element={<Archive />} />
    </Routes>
  );
}

export default App;

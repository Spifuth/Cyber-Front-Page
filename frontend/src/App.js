import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import UndergroundPage from "./pages/UndergroundPage";
import KrbtgtPage from "./pages/KrbtgtPage";
import SelfDestructPage from "./pages/SelfDestructPage";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <div className="App dark">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/underground" element={<UndergroundPage />} />
            <Route path="/krbtgt" element={<KrbtgtPage />} />
            <Route path="/selfdestruct" element={<SelfDestructPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
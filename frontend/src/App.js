import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import UndergroundPage from "./pages/UndergroundPage";
import KrbtgtPage from "./pages/KrbtgtPage";
import SelfDestructPage from "./pages/SelfDestructPage";
import ResumePage from "./pages/ResumePage";
import TimelinePage from "./pages/TimelinePage";
import StackPage from "./pages/StackPage";
import InfraPage from "./pages/InfraPage";
import CertsPage from "./pages/CertsPage";
import ContactPage from "./pages/ContactPage";
import LearningPage from "./pages/LearningPage";
import LogsPage from "./pages/LogsPage";
import "./App.css";

function App() {
  // Remove Emergent watermark to maintain cyberpunk aesthetic
  useEffect(() => {
    const removeWatermark = () => {
      // Look for the watermark and remove it
      const watermarkSelectors = [
        '[data-testid*="emergent"]',
        '[class*="emergent"]',
        '[id*="emergent"]',
        'button[title*="Made with Emergent"]',
        'button[aria-label*="Made with Emergent"]',
        'a[href*="emergent.sh"]',
        'button[style*="background: white"]',
        'button[style*="background-color: white"]'
      ];
      
      watermarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Check if it contains "Emergent" text
          if (element.textContent?.includes('Made with Emergent') || 
              element.textContent?.includes('Emergent') ||
              element.getAttribute('title')?.includes('Made with Emergent')) {
            element.style.display = 'none';
            element.remove();
          }
        });
      });
    };

    // Run immediately
    removeWatermark();
    
    // Run periodically to catch dynamically added elements
    const interval = setInterval(removeWatermark, 1000);
    
    // Also run on DOM mutations
    const observer = new MutationObserver(removeWatermark);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

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
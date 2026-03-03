import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import UndergroundPage from "./pages/UndergroundPage";
import KrbtgtPage from "./pages/KrbtgtPage";
import SelfDestructPage from "./pages/SelfDestructPage";
import ResumePage from "./pages/ResumePage";
import TimelinePage from "./pages/TimelinePage";
import StackPage from "./pages/StackPage";
import SkillsPage from "./pages/SkillsPage";
import InfraPage from "./pages/InfraPage";
import CertsPage from "./pages/CertsPage";
import ContactPage from "./pages/ContactPage";
import LearningPage from "./pages/LearningPage";
import LogsPage from "./pages/LogsPage";
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
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/stack" element={<StackPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/infra" element={<InfraPage />} />
            <Route path="/certs" element={<CertsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import HomePage from "./page/Homepage/HomePage.jsx";
import SpotGameHomePage from "./page/spotImposterGame/SpotGameHomePage/SpotGameHomePage.jsx";
import ChatInfoPage from "./page/spotImposterGame/ChatInfoPage/ChatInfoPage.jsx";
import ChatPage from "./page/spotImposterGame/ChatPage/ChatPage.jsx";

function App() {
  return (
    <Routes>
      {/* HOME PAGE */}
      <Route path="/" element={<HomePage />} />

      {/* SPOT THE IMPOSTER GAME */}
      <Route path="/spot-game" element={<SpotGameHomePage />} />

      {/* INFO / COUNTDOWN */}
      <Route path="/chat-info" element={<ChatInfoPage />} />

      {/* CHAT */}
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default App;


import { Routes, Route } from "react-router-dom";
import ChatInfoPage from "./pages/HomePage/spotImposterGame/ChatInfoPage.jsx";
import ChatPage from "./pages/HomePage/spotImposterGame/ChatPage.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<ChatInfoPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );

}

export default App;
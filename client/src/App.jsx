import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePage/HomePage'; 
import styles from './styles/App.module.css';
import ChatInfoPage from "src/pages/spotImposterGame/ChatInfoPage.jsx"; 
import ChatPage from "src/pages/spotImposterGame/ChatPage.jsx"; 
import SpotGameHomePage from 'src/pages/spotImposterGame/SpotGameHomePage.jsx';

function App() {
  return (
    <BrowserRouter>
      <nav>
         {/* Using Link satisfies the 'Link' error */}
         <Link to="/">Home</Link> 
      </nav>

      <main className={styles.main}>
        <Routes>
          {/* Using these components satisfies the other errors */}
          <Route path="/home-original" element={<Home />} />
          <Route path="/chat-info" element={<ChatInfoPage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Your main focus */}
          <Route path="/" element={<SpotGameHomePage />} />
          <Route path="/game" element={<SpotGameHomePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
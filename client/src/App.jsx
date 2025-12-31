
import {Routes, Route} from 'react-router-dom';
import Home from './pages/HomePage/HomePage.jsx';
import styles from './styles/App.module.css';
import ChatInfoPage from "./pages/spotImposterGame/ChatInfoPage.jsx"; 
import ChatPage from "./pages/spotImposterGame/ChatPage.jsx"; 
import SpotGameHomePage from './pages/spotImposterGame/SpotGameHomePage.jsx';

function App() {
  return (
      <main className={styles.main}>
        <Routes>

          <Route path="/" element={<SpotGameHomePage />} />
          <Route path="/game" element={<SpotGameHomePage />} />
          
          {/* ... other routes ... */}
          <Route path="/home" element={<Home />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/chat-info" element={<ChatInfoPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
  );
}

export default App;
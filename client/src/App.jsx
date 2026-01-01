import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Homepage/HomePage';
import Register from './page/Register/Register';
import './page/Register/Register.css';
import styles from './styles/App.module.css';
import StoriesSection from './page/Stories/StoriesSection';
import SpotGameHomePage from './page/SpotImposterGame/SpotGameHomePage';
import ChatInfoPage from './page/ChatInfo/ChatInfoPage';
import ChatPage from './page/Chat/ChatPage';



function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <main className={styles.main}>
          <Routes>
            <Route path="/Homepage" element={<Home />} />
            <Route path="/" element={<Register />} /> 
            <Route path="/Stories" element={<StoriesSection />} /> 
            <Route path="/game" element={<SpotGameHomePage />} />
            <Route path="/chat-info" element={<ChatInfoPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
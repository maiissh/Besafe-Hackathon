import { Routes, Route } from 'react-router-dom'; 
import Home from './page/Homepage/HomePage';
import Register from './page/Register/Register';
import styles from './styles/App.module.css';
import StoriesSection from './page/Stories/StoriesSection';
import SpotGameHomePage from './page/spotImposterGame/SpotGameHomePage/SpotGameHomePage';  
import ChatInfoPage from './page/spotImposterGame/ChatInfoPage/ChatInfoPage';              
import ChatPage from './page/spotImposterGame/ChatPage/ChatPage';    
import GetHelp from './page/Gethelp/Gethelp';                     

function App() {
  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <Routes>
        <Route path="/" element={<Register/>} />
          <Route path="/homepage" element={<Home />} />
          <Route path="/Stories" element={<StoriesSection />} /> 
          <Route path="/spot-game" element={<SpotGameHomePage />} />
          <Route path="/chat-info" element={<ChatInfoPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/help" element={<GetHelp />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

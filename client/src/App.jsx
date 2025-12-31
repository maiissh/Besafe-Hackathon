
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import Register from './pages/Register/Register';
import './pages/Register/Register.css';
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

          <Route path="/" element={<SpotGameHomePage />} />
          <Route path="/game" element={<SpotGameHomePage />} />
          
          {/* ... other routes ... */}
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat-info" element={<ChatInfoPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
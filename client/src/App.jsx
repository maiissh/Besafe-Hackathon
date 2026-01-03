import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import Register from './pages/Register/Register';
import './pages/Register/Register.css';
import styles from './styles/App.module.css';
import StoriesSection from './page/Stories/StoriesSection';
import SpotGameHomePage from './page/spotImposterGame/SpotGameHomePage/SpotGameHomePage';  
import ChatInfoPage from './page/spotImposterGame/ChatInfoPage/ChatInfoPage';              
import ChatPage from './page/spotImposterGame/ChatPage/ChatPage';    
import GetHelp from './page/Gethelp/Gethelp';                     

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />  
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

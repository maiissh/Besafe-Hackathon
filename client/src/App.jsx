import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import Register from './pages/Register/Register';
import './pages/Register/Register.css';
import styles from './styles/App.module.css';


// import Home from './pages/HomePage/HomePage';
// import styles from './styles/App.module.css';

// import projectLogo from './assets/project-logo.png'
import { Routes, Route } from "react-router-dom";
import ChatInfoPage from "./pages/HomePage/spotImposterGame/ChatInfoPage.jsx";
import ChatPage from "./pages/HomePage/spotImposterGame/ChatPage.jsx";

function App() {

  return (
<<<<<<< HEAD
    <BrowserRouter>
      <div className={styles.app}>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />  

            {/* <Route path="/" element={<ChatInfoPage />} />
            <Route path="/chat" element={<ChatPage />} /> */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );

  // return (
  //   <BrowserRouter>
  //     <div className={styles.app}>
  //       <header className={styles.appHeader}>
  //         <img src={projectLogo} alt="Logo" className={styles.appLogo} />
  //         <nav className={styles.appNav}>
  //           <Link to="/" className={styles.appLink}>Home</Link>
  //         </nav>
  //       </header>
  //       <main className={styles.main}>
  //         <Routes>
  //           <Route path="/" element={<Home />} />
  //         </Routes>
  //       </main>
  //       <footer className={styles.footer}>
  //         <p>&copy; 2024 My App</p>
  //       </footer>
  //     </div>
  //   </BrowserRouter>
  // );
}

export default App;
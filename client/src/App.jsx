
// import Home from './pages/HomePage/HomePage';
// import styles from './styles/App.module.css';

// import projectLogo from './assets/project-logo.png'
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

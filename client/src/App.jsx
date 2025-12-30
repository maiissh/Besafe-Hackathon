import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Homepage/HomePage';
import Register from './page/Register/Register';
import './page/Register/Register.css';
import styles from './styles/App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <main className={styles.main}>
          <Routes>
            <Route path="/Homepage" element={<Home />} />
            <Route path="/" element={<Register />} />  
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
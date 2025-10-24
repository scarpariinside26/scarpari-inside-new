import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import pagine
import Eventi from './pages/Eventi';
import Classifica from './pages/Classifica';
import Squadre from './pages/Squadre';
import Profilo from './pages/Profilo';
import Impostazioni from './pages/Impostazioni';

// Componente Homepage
function HomePage() {
  return (
    <div className="container">
      <header className="header">
        <img 
          src="/Scarpari Inside simplelogo_2023.png" 
          alt="Scarpari Inside" 
          className="logo-image"
        />
        <h1 className="logo">SCARPARI INSIDE</h1>
        <p className="slogan">Il tempio del calcetto</p>
      </header>

      <main className="main">
        <div className="menu-grid">
          <a href="/eventi" className="menu-btn">
            <span className="icon">🗓️</span>
            <span className="text">EVENTI</span>
          </a>

          <a href="/squadre" className="menu-btn">
            <span className="icon">👥</span>
            <span className="text">GENERA SQUADRE</span>
          </a>

          <a href="/classifica" className="menu-btn">
            <span className="icon">📊</span>
            <span className="text">SCARPAROMETRO</span>
          </a>

          <a href="/profilo" className="menu-btn">
            <span className="icon">👤</span>
            <span className="text">IL MIO PROFILO</span>
          </a>

          <a href="/impostazioni" className="menu-btn">
            <span className="icon">⚙️</span>
            <span className="text">IMPOSTAZIONI</span>
          </a>
        </div>
      </main>

      <footer className="footer">
        <p>- proudly made with rabbia in Veneto -</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventi" element={<Eventi />} />
        <Route path="/classifica" element={<Classifica />} />
        <Route path="/squadre" element={<Squadre />} />
        <Route path="/profilo" element={<Profilo />} />
        <Route path="/impostazioni" element={<Impostazioni />} />
      </Routes>
    </div>
  );
}

export default App;

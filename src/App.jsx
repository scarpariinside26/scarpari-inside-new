import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import delle pagine
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

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
          <Link to="/eventi" className="menu-btn">
            <span className="icon">🗓️</span>
            <span className="text">EVENTI</span>
            <span className="desc">Gestione eventi e generazione squadre</span>
          </Link>

          <Link to="/eventi" className="menu-btn">
            <span className="icon">👥</span>
            <span className="text">GENERA SQUADRE</span>
            <span className="desc">Crea squadre bilanciate per le partite</span>
          </Link>

          <Link to="/" className="menu-btn">
            <span className="icon">📊</span>
            <span className="text">SCARPAROMETRO</span>
            <span className="desc">Classifica e statistiche giocatori</span>
          </Link>

          <Link to="/" className="menu-btn">
            <span className="icon">👤</span>
            <span className="text">IL MIO PROFILO</span>
            <span className="desc">Profilo personale e statistiche</span>
          </Link>

          <Link to="/" className="menu-btn">
            <span className="icon">⚙️</span>
            <span className="text">IMPOSTAZIONI</span>
            <span className="desc">Configurazione sistema</span>
          </Link>
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
        <Route path="/eventi" element={<GestioneEventi />} />
      </Routes>
    </div>
  );
}

export default App;

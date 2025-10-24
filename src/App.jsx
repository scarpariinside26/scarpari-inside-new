import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

// Componenti pagina semplici per test
function EventiPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        <h1>🗓️ Pagina Eventi</h1>
      </header>
      <div className="eventi-content">
        <p>Questa è la pagina dedicata agli eventi!</p>
        <p>Qui andrà la lista completa degli eventi.</p>
      </div>
    </div>
  );
}

function ClassificaPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        <h1>📊 Classifica</h1>
      </header>
      <p>Qui andrà lo Scarparometro</p>
    </div>
  );
}

function SquadrePage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        <h1>👥 Genera Squadre</h1>
      </header>
      <p>Qui andrà il generatore di squadre</p>
    </div>
  );
}

// Componente Homepage - SOLO PULSANTI
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
          </Link>

          <Link to="/squadre" className="menu-btn">
            <span className="icon">👥</span>
            <span className="text">GENERA SQUADRE</span>
          </Link>

          <Link to="/classifica" className="menu-btn">
            <span className="icon">📊</span>
            <span className="text">SCARPAROMETRO</span>
          </Link>

          <Link to="/profilo" className="menu-btn">
            <span className="icon">👤</span>
            <span className="text">IL MIO PROFILO</span>
          </Link>

          <Link to="/impostazioni" className="menu-btn">
            <span className="icon">⚙️</span>
            <span className="text">IMPOSTAZIONI</span>
          </Link>
        </div>
        
        {/* RIMOSSO: la sezione dati che vedi sotto i pulsanti */}
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
        <Route path="/eventi" element={<EventiPage />} />
        <Route path="/classifica" element={<ClassificaPage />} />
        <Route path="/squadre" element={<SquadrePage />} />
        <Route path="/profilo" element={<HomePage />} /> {/* Temporaneo */}
        <Route path="/impostazioni" element={<HomePage />} /> {/* Temporaneo */}
      </Routes>
    </div>
  );
}

export default App;

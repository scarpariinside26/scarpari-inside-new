import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Eventi() {
  return (
    <div style={{ padding: '2rem', background: '#0f1a2f', color: 'white', minHeight: '100vh' }}>
      <h1>🗓️ PAGINA EVENTI - FUNZIONA!</h1>
      <p>Se vedi questo, il routing funziona</p>
      <Link to="/" style={{ color: '#a8c6ff' }}>← Torna alla Home</Link>
    </div>
  );
}

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
          {/* Altri pulsanti... */}
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
      </Routes>
    </div>
  );
}

export default App;

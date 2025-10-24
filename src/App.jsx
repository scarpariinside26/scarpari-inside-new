import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [activeMenu, setActiveMenu] = useState('');

  const handleEventi = () => {
    setMessage('🎯 EVENTI - Prossimi match in caricamento...');
    setActiveMenu('eventi');
    console.log('Eventi clicked');
  };

  const handleGeneraSquadre = () => {
    setMessage('👥 GENERA SQUADRE - Mescolando i giocatori...');
    setActiveMenu('squadre');
    console.log('Genera Squadre clicked');
  };

  const handleScarparometro = () => {
    setMessage('📊 SCARPAROMETRO - Calcolando le statistiche...');
    setActiveMenu('scarparometro');
    console.log('Scarparometro clicked');
  };

  const handleProfilo = () => {
    setMessage('👤 IL MIO PROFILO - Caricamento dati...');
    setActiveMenu('profilo');
    console.log('Profilo clicked');
  };

  const handleImpostazioni = () => {
    setMessage('⚙️ IMPOSTAZIONI - Configurazione...');
    setActiveMenu('impostazioni');
    console.log('Impostazioni clicked');
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header con Logo */}
        <header className="header">
          <img 
            src="/Scarpari Inside simplelogo_2023.png" 
            alt="Scarpari Inside" 
            className="logo-image"
          />
          <h1 className="logo">SCARPARI INSIDE</h1>
          <p className="slogan">Il tempio del calcetto</p>
        </header>

        {/* Messaggio di stato */}
        {message && (
          <div className="message-box">
            {message}
            {activeMenu && <div className="active-menu">Menu attivo: {activeMenu}</div>}
          </div>
        )}

        {/* Menu Principale */}
        <main className="main">
          <div className="menu-grid">
            <button className="menu-btn" onClick={handleEventi}>
              <span className="icon">🗓️</span>
              <span className="text">EVENTI</span>
            </button>

            <button className="menu-btn" onClick={handleGeneraSquadre}>
              <span className="icon">👥</span>
              <span className="text">GENERA SQUADRE</span>
            </button>

            <button className="menu-btn" onClick={handleScarparometro}>
              <span className="icon">📊</span>
              <span className="text">SCARPAROMETRO</span>
            </button>

            <button className="menu-btn" onClick={handleProfilo}>
              <span className="icon">👤</span>
              <span className="text">IL MIO PROFILO</span>
            </button>

            <button className="menu-btn" onClick={handleImpostazioni}>
              <span className="icon">⚙️</span>
              <span className="text">IMPOSTAZIONI</span>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>- proudly made with rabbia in Veneto -</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

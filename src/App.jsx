import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const handleEventi = () => {
    setMessage('🎯 EVENTI - Prossimi match in caricamento...');
    // Qui collegherai la funzione eventi
  };

  const handleGeneraSquadre = () => {
    setMessage('👥 GENERA SQUADRE - Mescolando i giocatori...');
    // Qui collegherai il team generator
  };

  const handleScarparometro = () => {
    setMessage('📊 SCARPAROMETRO - Calcolando le statistiche...');
    // Qui collegherai la classifica
  };

  const handleProfilo = () => {
    setMessage('👤 IL MIO PROFILO - Caricamento dati...');
    // Qui collegherai il profilo utente
  };

  const handleImpostazioni = () => {
    setMessage('⚙️ IMPOSTAZIONI - Configurazione...');
    // Qui collegherai le settings
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header con Logo */}
        <header className="header">
          <img src="/logo.png" alt="Scarpari Inside" className="logo-image" />
          <h1 className="logo">SCARPARI INSIDE</h1>
          <p className="slogan">Il tempio del calcetto</p>
        </header>

        {/* Messaggio di stato */}
        {message && (
          <div className="message-box">
            {message}
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

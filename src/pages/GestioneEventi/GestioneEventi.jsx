import React from 'react';
import { Link } from 'react-router-dom';
import './GestioneEventi.css';

function GestioneEventi() {
  return (
    <div className="gestione-eventi-container">
      <header className="page-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        <h1>🗓️ GESTIONE EVENTI - NUOVA VERSIONE</h1>
      </header>
      
      <main className="page-main">
        <div className="menu-grid">
          <Link to="/" className="menu-btn">
            <span className="icon">📋</span>
            <span className="text">Lista Eventi</span>
          </Link>
          
          <Link to="/" className="menu-btn">
            <span className="icon">➕</span>
            <span className="text">Crea Evento</span>
          </Link>
        </div>
        
        <div className="test-message">
          <h2>✅ Funziona! La nuova struttura è attiva</h2>
          <p>Ora possiamo procedere con i componenti avanzati</p>
        </div>
      </main>
    </div>
  );
}

export default GestioneEventi;

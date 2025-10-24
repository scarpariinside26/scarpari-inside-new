import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GestioneEventi.css';
import CreaEvento from './components/CreaEvento';

function GestioneEventi() {
  const [view, setView] = useState('home'); // 'home', 'crea'

  const handleCreaEventoSuccess = () => {
    setView('home');
    // Qui potremmo ricaricare la lista eventi in futuro
  };

  return (
    <div className="gestione-eventi-container">
      <header className="page-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        
        <div className="header-actions">
          <h1>🗓️ Gestione Eventi</h1>
          {view === 'home' && (
            <button 
              className="btn-primary" 
              onClick={() => setView('crea')}
            >
              + Crea Nuovo Evento
            </button>
          )}
        </div>
      </header>

      <main className="page-main">
        {view === 'home' && (
          <>
            <div className="menu-grid">
              <div className="menu-btn" onClick={() => setView('crea')}>
                <span className="icon">➕</span>
                <span className="text">Crea Evento</span>
              </div>
              
              <div className="menu-btn">
                <span className="icon">📋</span>
                <span className="text">Lista Eventi</span>
              </div>
              
              <div className="menu-btn">
                <span className="icon">👥</span>
                <span className="text">Iscrizioni</span>
              </div>
              
              <div className="menu-btn">
                <span className="icon">📊</span>
                <span className="text">Statistiche</span>
              </div>
            </div>

            <div className="test-message">
              <h2>🚀 Sistema Eventi Avanzato</h2>
              <p>Benvenuto nella nuova gestione eventi con:</p>
              <ul style={{textAlign: 'left', marginTop: '1rem'}}>
                <li>✅ Creazione eventi sportivi/community</li>
                <li>✅ Ricorrenze automatiche</li>
                <li>✅ Chat integrata</li>
                <li>✅ Upload file multimediali</li>
                <li>✅ Sondaggi real-time</li>
                <li>✅ Auto-generazione squadre</li>
                <li>✅ Sistema notifiche intelligente</li>
              </ul>
              <button 
                className="btn-primary"
                style={{marginTop: '2rem'}}
                onClick={() => setView('crea')}
              >
                Prova a Creare un Evento →
              </button>
            </div>
          </>
        )}

        {view === 'crea' && (
          <CreaEvento 
            onSuccess={handleCreaEventoSuccess}
            onCancel={() => setView('home')}
          />
        )}
      </main>
    </div>
  );
}

export default GestioneEventi;

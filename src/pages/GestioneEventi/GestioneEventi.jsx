import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';  // ✅ CORRETTO
import './GestioneEventi.css';
import CreaEvento from './components/CreaEvento';
import ListaEventi from './components/ListaEventi';
import GeneraSquadre from './components/GeneraSquadre';

function GestioneEventi() {
  const [view, setView] = useState('home'); // 'home', 'crea', 'lista', 'squadre'

  const handleCreaEventoSuccess = () => {
    setView('home');
    alert('Evento creato con successo!');
  };

  const handleEventoCliccato = (evento) => {
    console.log('Evento cliccato:', evento);
    // Qui potremo aprire il dettaglio evento in futuro
    alert(`Hai cliccato su: ${evento.nome_evento}`);
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
          {view !== 'home' && (
            <button 
              className="btn-secondary" 
              onClick={() => setView('home')}
            >
              ← Torna al Menu
            </button>
          )}
        </div>
      </header>

      <main className="page-main">
        {/* HOME - MENU PRINCIPALE */}
        {view === 'home' && (
          <>
            <div className="menu-grid">
              <div className="menu-btn" onClick={() => setView('crea')}>
                <span className="icon">➕</span>
                <span className="text">Crea Evento</span>
                <span className="desc">Crea nuovi eventi sportivi o community</span>
              </div>
              
              <div className="menu-btn" onClick={() => setView('lista')}>
                <span className="icon">📋</span>
                <span className="text">Lista Eventi</span>
                <span className="desc">Visualizza e gestisci tutti gli eventi</span>
              </div>
              
              <div className="menu-btn" onClick={() => setView('squadre')}>
                <span className="icon">👥</span>
                <span className="text">Genera Squadre</span>
                <span className="desc">Crea squadre bilanciate per le partite</span>
              </div>
              
              <div className="menu-btn">
                <span className="icon">📊</span>
                <span className="text">Statistiche</span>
                <span className="desc">Analisi e report partecipazione</span>
              </div>
            </div>

            <div className="test-message">
              <h2>🚀 Sistema Eventi Avanzato</h2>
              <p>Benvenuto nella nuova gestione eventi con tutte le funzionalità!</p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <span className="feature-icon">🎯</span>
                  <h4>Eventi Intelligenti</h4>
                  <p>Creazione avanzata con tutte le opzioni</p>
                </div>
                
                <div className="feature-card">
                  <span className="feature-icon">👥</span>
                  <h4>Genera Squadre</h4>
                  <p>Bilanciamento automatico per livelli</p>
                </div>
                
                <div className="feature-card">
                  <span className="feature-icon">💬</span>
                  <h4>Chat Integrata</h4>
                  <p>Comunicazione in tempo reale</p>
                </div>
                
                <div className="feature-card">
                  <span className="feature-icon">📎</span>
                  <h4>File Multimediali</h4>
                  <p>Condivisione documenti e immagini</p>
                </div>
              </div>

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

        {/* CREA EVENTO */}
        {view === 'crea' && (
          <CreaEvento 
            onSuccess={handleCreaEventoSuccess}
            onCancel={() => setView('home')}
          />
        )}

        {/* LISTA EVENTI */}
        {view === 'lista' && (
          <ListaEventi 
            onEventoCliccato={handleEventoCliccato}
          />
        )}

        {/* GENERA SQUADRE */}
        {view === 'squadre' && (
          <GeneraSquadre />
        )}
      </main>
    </div>
  );
}

export default GestioneEventi;

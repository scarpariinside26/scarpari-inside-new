import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  // TEST DIRETTO E SEMPLICE
  const testOneSignalDirect = () => {
    console.log('🎯 Test diretto OneSignal');
    
    // Controlla se OneSignal esiste
    if (typeof window.OneSignal === 'undefined') {
      alert('❌ OneSignal NON è caricato nella pagina');
      return;
    }
    
    if (!Array.isArray(window.OneSignal)) {
      alert('❌ OneSignal non è un array');
      return;
    }
    
    // Prova l'inizializzazione diretta
    window.OneSignal.push(function() {
      if (typeof OneSignal === 'undefined') {
        alert('❌ OneSignal interno non definito');
        return;
      }
      
      // Inizializza
      OneSignal.init({
        appId: "35648a40-c681-40dd-8151-2db3867ee0fc"
      }).then(() => {
        alert('✅ OneSignal inizializzato!');
        return OneSignal.showSlidedownPrompt();
      }).then(() => {
        alert('✅ Popup mostrato!');
      }).catch(error => {
        alert('❌ Errore: ' + error.message);
      });
    });
    
    alert('✅ Comando OneSignal inviato!');
  };

  // VERIFICA STATO ONESIGNAL
  const checkOneSignal = () => {
    console.log('🔍 Controllo stato OneSignal:');
    console.log('- window.OneSignal:', window.OneSignal);
    console.log('- Tipo:', typeof window.OneSignal);
    console.log('- È array:', Array.isArray(window.OneSignal));
    
    if (typeof window.OneSignal === 'undefined') {
      alert('❌ OneSignal NON è caricato');
    } else if (Array.isArray(window.OneSignal)) {
      alert('✅ OneSignal è caricato come array');
    } else {
      alert('⚠️ OneSignal è caricato ma non come array');
    }
  };

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
        {/* SEZIONE TEST SEMPLIFICATA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: '#fff3cd', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>🧪 Debug OneSignal</h3>
            <p>Stato: {isOneSignalReady ? '✅ PRONTO' : '❌ NON CARICATO'}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={checkOneSignal}
              style={{
                padding: '12px 24px',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '300px'
              }}
            >
              🔍 Verifica Caricamento OneSignal
            </button>

            <button 
              onClick={testOneSignalDirect}
              style={{
                padding: '12px 24px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '300px'
              }}
            >
              🚀 Test OneSignal Diretto
            </button>
          </div>
        </div>

        {/* MENU PRINCIPALE */}
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
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Codice di verifica OneSignal: OS7K3L
        </p>
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

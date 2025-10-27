import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  // TEST ONE SIGNAL - VERSIONE UNIVERSALE
  const testOneSignalUniversal = () => {
    console.log('🎯 Test OneSignal Universale');
    
    // Controlla tutti i possibili stati di OneSignal
    if (typeof window.OneSignal === 'undefined') {
      alert('❌ OneSignal NON è caricato nella pagina');
      return;
    }
    
    console.log('OneSignal trovato:', window.OneSignal);
    console.log('Tipo:', typeof window.OneSignal);
    console.log('È array:', Array.isArray(window.OneSignal));
    console.log('È oggetto:', typeof window.OneSignal === 'object');
    console.log('Ha init:', typeof window.OneSignal.init === 'function');

    // PROVA TUTTI I METODI POSSIBILI
    try {
      // Metodo 1: Se è un oggetto con init
      if (typeof window.OneSignal.init === 'function') {
        console.log('🚀 Metodo 1: OneSignal come oggetto con init');
        window.OneSignal.init({
          appId: "35648a40-c681-40dd-8151-2db3867ee0fc"
        }).then(() => {
          console.log('✅ OneSignal inizializzato (oggetto)');
          return window.OneSignal.showSlidedownPrompt();
        }).then(() => {
          alert('✅ Popup mostrato! (metodo oggetto)');
        }).catch(error => {
          console.error('❌ Errore metodo oggetto:', error);
          alert('❌ Errore: ' + error.message);
        });
        return;
      }

      // Metodo 2: Se è un array (pattern standard)
      if (Array.isArray(window.OneSignal)) {
        console.log('🚀 Metodo 2: OneSignal come array');
        window.OneSignal.push(function() {
          OneSignal.init({
            appId: "35648a40-c681-40dd-8151-2db3867ee0fc"
          }).then(() => {
            console.log('✅ OneSignal inizializzato (array)');
            return OneSignal.showSlidedownPrompt();
          }).then(() => {
            alert('✅ Popup mostrato! (metodo array)');
          }).catch(error => {
            console.error('❌ Errore metodo array:', error);
            alert('❌ Errore: ' + error.message);
          });
        });
        return;
      }

      // Metodo 3: Se è già inizializzato
      if (typeof window.OneSignal.showSlidedownPrompt === 'function') {
        console.log('🚀 Metodo 3: OneSignal già inizializzato');
        window.OneSignal.showSlidedownPrompt().then(() => {
          alert('✅ Popup mostrato! (già inizializzato)');
        }).catch(error => {
          console.error('❌ Errore già inizializzato:', error);
          alert('❌ Errore: ' + error.message);
        });
        return;
      }

      // Se nessun metodo funziona
      alert('❌ OneSignal è caricato ma in uno stato sconosciuto:\n' + 
            'Tipo: ' + typeof window.OneSignal + '\n' +
            'Controlla la console per dettagli');
            
    } catch (error) {
      console.error('💥 Errore generale:', error);
      alert('💥 Errore generale: ' + error.message);
    }
  };

  // VERIFICA DETTAGLIATA
  const checkOneSignalDetailed = () => {
    console.log('=== DEBUG DETTAGLIATO ONESIGNAL ===');
    console.log('window.OneSignal:', window.OneSignal);
    console.log('Tipo:', typeof window.OneSignal);
    console.log('È array:', Array.isArray(window.OneSignal));
    console.log('È oggetto:', typeof window.OneSignal === 'object');
    
    if (window.OneSignal) {
      console.log('Proprietà disponibili:', Object.keys(window.OneSignal));
      console.log('Ha init?', typeof window.OneSignal.init === 'function');
      console.log('Ha showSlidedownPrompt?', typeof window.OneSignal.showSlidedownPrompt === 'function');
    }
    
    alert('✅ Controlla la console per i dettagli completi');
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
        {/* SEZIONE TEST MIGLIORATA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: '#e7f3ff', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '2px solid #007bff'
          }}>
            <h3>🔧 Debug OneSignal Avanzato</h3>
            <p>OneSignal è caricato ma in stato sconosciuto</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={checkOneSignalDetailed}
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
              🔍 Debug Dettagliato (Console)
            </button>

            <button 
              onClick={testOneSignalUniversal}
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
              🚀 Test Universale OneSignal
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

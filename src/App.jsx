import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  // Test semplice - senza API complesse
  const testOneSignal = () => {
    if (window.OneSignal) {
      alert('✅ OneSignal è caricato correttamente!\n\nOra puoi:\n• Inviare notifiche dalla Dashboard OneSignal\n• Gli utenti riceveranno le notifiche push\n• Il sistema è pronto!');
    } else {
      alert('❌ OneSignal non è ancora pronto. Ricarica la pagina.');
    }
  };

  useEffect(() => {
    // CARICAMENTO SEMPLIFICATO E SICURO
    const script = document.createElement('script');
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.async = true;
    
    script.onload = () => {
      console.log('✅ OneSignal script caricato');
      
      // Inizializzazione minima e sicura
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
        });
      });
      
      // Aspetta un po' e poi segna come pronto
      setTimeout(() => {
        setIsOneSignalReady(true);
        console.log('✅ OneSignal pronto per l\'uso');
      }, 2000);
    };
    
    document.head.appendChild(script);

  }, []);

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
        {/* BOTTONE SEMPLIFICATO */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            onClick={testOneSignal}
            style={{
              padding: '12px 24px',
              background: '#2c5aa0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🧪 Verifica OneSignal
          </button>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Clicca per verificare se OneSignal è pronto
          </p>
          
          <div style={{ 
            fontSize: '12px', 
            color: isOneSignalReady ? 'green' : 'orange',
            marginTop: '10px'
          }}>
            {isOneSignalReady ? '✅ Sistema Notifiche PRONTO' : '🔄 Caricamento in corso...'}
          </div>
        </div>

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

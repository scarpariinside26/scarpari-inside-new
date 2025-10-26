import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import delle pagine
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

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
  useEffect(() => {
    // Carica OneSignal direttamente dallo script
    const loadOneSignal = () => {
      // Se OneSignal è già caricato, non fare nulla
      if (window.OneSignal) {
        console.log('✅ OneSignal già caricato');
        initializeOneSignal();
        return;
      }

      // Carica lo script OneSignal
      const script = document.createElement('script');
      script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      script.async = true;
      script.onload = () => {
        console.log('✅ OneSignal script caricato');
        initializeOneSignal();
      };
      document.head.appendChild(script);
    };

    const initializeOneSignal = () => {
      window.OneSignal = window.OneSignal || [];
      
      // Inizializza OneSignal
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        });
        
        // Mostra il prompt
        window.OneSignal.showSlidedownPrompt();
        
        console.log('✅ OneSignal inizializzato');
        
        // Gestisci click notifiche
        window.OneSignal.on('notificationClick', function(event) {
          const buttonId = event.action;
          console.log('🔔 Notifica cliccata:', buttonId);
        });
      });
    };

    // Inizializza solo se l'App ID è presente
    if (import.meta.env.VITE_ONESIGNAL_APP_ID) {
      loadOneSignal();
    } else {
      console.warn('⚠️ OneSignal App ID non configurato');
    }
  }, []);

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

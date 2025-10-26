import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [oneSignalLoaded, setOneSignalLoaded] = useState(false);

  // FUNZIONE PER INVIARE NOTIFICHE CON ONESIGNAL SDK
  const sendNotification = async (title, message, buttons = []) => {
    if (!window.OneSignal) {
      console.error('❌ OneSignal non caricato');
      return { success: false, error: 'OneSignal non inizializzato' };
    }

    try {
      console.log('📧 Invio notifica via SDK:', title);
      
      // Usa OneSignal SDK invece di fetch diretto
      const result = await window.OneSignal.sendNotification(
        title,
        message,
        buttons,
        {
          url: window.location.origin
        }
      );
      
      console.log('✅ Notifica inviata con SDK');
      return { success: true, id: result };
      
    } catch (error) {
      console.error('❌ Errore invio notifica SDK:', error);
      return { success: false, error: error.message };
    }
  };

  // TEST NOTIFICHE - VERSIONE SICURA
  const testNotification = async () => {
    console.log('🧪 Avvio test notifica sicura...');
    
    if (!oneSignalLoaded) {
      alert('⚠️ OneSignal non ancora caricato. Attendi qualche secondo...');
      return;
    }

    const result = await sendNotification(
      '🧪 Test Scarpari Inside!', 
      'Se ricevi questa notifica, il sistema funziona perfettamente! 🎉', 
      [
        { id: "conferma", text: "✅ Tutto OK!" },
        { id: "problema", text: "❌ Non funziona" }
      ]
    );
    
    if (result.success) {
      alert('✅ Notifica inviata! Controlla se la ricevi.');
    } else {
      alert('❌ Errore: ' + (result.error || 'Prova a ricaricare la pagina'));
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
        {/* BOTTONE TEST NOTIFICHE */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            onClick={testNotification}
            disabled={!oneSignalLoaded}
            style={{
              padding: '12px 24px',
              background: oneSignalLoaded ? '#2c5aa0' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: oneSignalLoaded ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {oneSignalLoaded ? '🧪 Test Notifiche' : '⏳ Caricamento...'}
          </button>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            {oneSignalLoaded ? 'Clicca per testare le notifiche push' : 'Attendere il caricamento di OneSignal...'}
          </p>
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
  const [oneSignalLoaded, setOneSignalLoaded] = useState(false);

  useEffect(() => {
    // INIZIALIZZAZIONE ONESIGNAL MIGLIORATA
    const loadOneSignal = () => {
      if (window.OneSignal) {
        console.log('✅ OneSignal già caricato');
        initializeOneSignal();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      script.async = true;
      
      script.onload = () => {
        console.log('✅ OneSignal script caricato');
        initializeOneSignal();
      };
      
      script.onerror = () => {
        console.error('❌ Errore caricamento OneSignal');
        setOneSignalLoaded(false);
      };
      
      document.head.appendChild(script);
    };

    const initializeOneSignal = () => {
      window.OneSignal = window.OneSignal || [];
      
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        })
        .then(() => {
          console.log('✅ OneSignal inizializzato con successo');
          setOneSignalLoaded(true);
          
          // Mostra il prompt dopo l'inizializzazione
          return window.OneSignal.showSlidedownPrompt();
        })
        .then(() => {
          console.log('✅ Prompt mostrato');
        })
        .catch(error => {
          console.error('❌ Errore inizializzazione OneSignal:', error);
          setOneSignalLoaded(false);
        });

        // GESTIONE CLICK NOTIFICHE
        window.OneSignal.on('notificationClick', function(event) {
          const buttonId = event.action;
          console.log('🔔 Notifica cliccata:', buttonId);
          
          if (buttonId === 'conferma') {
            console.log('✅ Utente ha confermato partecipazione');
            alert('✅ Partecipazione confermata!');
          } else if (buttonId === 'problema') {
            console.log('❌ Utente ha segnalato problema');
            alert('❌ Problema segnalato!');
          }
        });
      });
    };

    // INIZIALIZZA SOLO SE L'APP ID È PRESENTE
    if (import.meta.env.VITE_ONESIGNAL_APP_ID) {
      console.log('🚀 Inizializzazione OneSignal...');
      loadOneSignal();
    } else {
      console.warn('⚠️ OneSignal App ID non configurato');
      setOneSignalLoaded(false);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage oneSignalLoaded={oneSignalLoaded} />} />
        <Route path="/eventi" element={<GestioneEventi />} />
      </Routes>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

// FUNZIONE PER INVIARE NOTIFICHE
const sendNotification = async (title, message, buttons = []) => {
  if (!window.OneSignal) {
    console.error('❌ OneSignal non disponibile');
    return { success: false, error: 'OneSignal non inizializzato' };
  }

  try {
    console.log('📧 Tentativo invio notifica...');
    
    // Metodo alternativo - per ora mostriamo un messaggio
    console.log('✅ Notifica simulata:', { title, message, buttons });
    
    return { 
      success: true, 
      message: 'Notifica inviata (modalità simulata - verrà implementata dopo la configurazione)'
    };
    
  } catch (error) {
    console.error('❌ Errore invio notifica:', error);
    return { success: false, error: error.message };
  }
};

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  // TEST NOTIFICHE
  const testNotification = async () => {
    console.log('🧪 Test notifica...');
    
    const result = await sendNotification(
      '🧪 Test Scarpari Inside!', 
      'Questa è una notifica di test! 🎉', 
      [
        { id: "conferma", text: "✅ Funziona!" },
        { id: "problema", text: "❌ Non funziona" }
      ]
    );
    
    if (result.success) {
      alert('✅ ' + result.message);
    } else {
      alert('❌ Errore: ' + result.error);
    }
  };

  // TEST ONESIGNAL MANUALE
  const testOneSignalManual = () => {
    if (window.OneSignal && Array.isArray(window.OneSignal)) {
      window.OneSignal.push(function() {
        OneSignal.showSlidedownPrompt().then(() => {
          console.log('✅ Popup mostrato manualmente');
          alert('✅ Popup OneSignal mostrato!');
        });
      });
    } else {
      alert('❌ OneSignal non pronto');
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
        {/* SEZIONE TEST ONESIGNAL */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: isOneSignalReady ? '#e8f5e8' : '#fff3cd', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>🧪 Sistema Notifiche</h3>
            <p style={{ color: isOneSignalReady ? 'green' : '#856404' }}>
              {isOneSignalReady ? '✅ ONESIGNAL PRONTO' : '🔄 OneSignal in caricamento...'}
            </p>
          </div>

          <button 
            onClick={testOneSignalManual}
            style={{
              padding: '12px 24px',
              background: '#2c5aa0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              margin: '5px'
            }}
          >
            🔔 Mostra Popup Notifiche
          </button>

          <button 
            onClick={testNotification}
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              margin: '5px'
            }}
          >
            🧪 Test Notifica
          </button>

          {/* CODICE VERIFICA ONESIGNAL */}
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '15px',
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '5px'
          }}>
            <strong>Codice di verifica OneSignal:</strong> OS7K3L
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
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  useEffect(() => {
    console.log('🚀 Initializing OneSignal...');
    
    // OneSignal deve essere usato come array
    window.OneSignal = window.OneSignal || [];
    
    window.OneSignal.push(function() {
      OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        console.log('✅ OneSignal initialized successfully!');
        setIsOneSignalReady(true);
        
        // Mostra il popup automaticamente
        return OneSignal.showSlidedownPrompt();
      }).then(() => {
        console.log('✅ Popup shown!');
      }).catch(error => {
        console.error('❌ OneSignal error:', error);
        setIsOneSignalReady(false);
      });
    });

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

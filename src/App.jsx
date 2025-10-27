import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  const [oneSignalError, setOneSignalError] = useState('');

  // TEST MANUALE ONESIGNAL
  const testOneSignalManual = () => {
    console.log('🧪 Test manuale OneSignal...');
    
    if (window.OneSignal && Array.isArray(window.OneSignal)) {
      window.OneSignal.push(function() {
        console.log('🔍 Stato OneSignal interno:', OneSignal);
        
        // Verifica se è inizializzato
        if (OneSignal.init) {
          console.log('✅ OneSignal già inizializzato');
          
          // Mostra il popup
          OneSignal.showSlidedownPrompt().then(() => {
            console.log('✅ Popup mostrato!');
            alert('✅ Popup OneSignal mostrato!');
          }).catch(error => {
            console.error('❌ Errore popup:', error);
            alert('❌ Errore popup: ' + error.message);
          });
        } else {
          console.log('❌ OneSignal non inizializzato');
          alert('❌ OneSignal non è inizializzato. Ricarica la pagina.');
        }
      });
    } else {
      console.log('❌ OneSignal non trovato');
      alert('❌ OneSignal non caricato. Ricarica la pagina.');
    }
  };

  // FORZA INIZIALIZZAZIONE ONESIGNAL
  const forceOneSignalInit = () => {
    console.log('🚨 Forzatura inizializzazione OneSignal...');
    
    // Ricarica lo script OneSignal
    const script = document.createElement('script');
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Script OneSignal ricaricato');
      
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(function() {
        OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        }).then(() => {
          console.log('✅ OneSignal inizializzato forzatamente!');
          setIsOneSignalReady(true);
          alert('✅ OneSignal inizializzato! Ora prova il popup.');
        }).catch(error => {
          console.error('❌ Errore inizializzazione:', error);
          alert('❌ Errore: ' + error.message);
        });
      });
    };
    
    // Rimuovi script vecchio se esiste
    const oldScript = document.querySelector('script[src*="onesignal"]');
    if (oldScript) {
      oldScript.remove();
    }
    
    document.head.appendChild(script);
  };

  // DEBUG ONESIGNAL
  const debugOneSignal = () => {
    console.log('=== DEBUG ONESIGNAL COMPLETO ===');
    console.log('OneSignal object:', window.OneSignal);
    console.log('OneSignal come array:', Array.isArray(window.OneSignal));
    console.log('Variabile ambiente:', import.meta.env.VITE_ONESIGNAL_APP_ID);
    
    if (window.OneSignal && Array.isArray(window.OneSignal)) {
      window.OneSignal.push(function() {
        console.log('OneSignal interno:', OneSignal);
        console.log('init function:', typeof OneSignal.init);
        
        OneSignal.getNotificationPermission?.().then(permission => {
          console.log('Permesso notifiche:', permission);
          alert('Permesso notifiche: ' + permission);
        }).catch(err => {
          console.log('Errore permesso:', err);
        });
      });
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
            marginBottom: '20px',
            border: isOneSignalReady ? '2px solid green' : '2px solid orange'
          }}>
            <h3>🧪 Sistema Notifiche</h3>
            <p style={{ 
              color: isOneSignalReady ? 'green' : '#856404',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {isOneSignalReady ? '✅ ONESIGNAL PRONTO' : '🔄 OneSignal in caricamento...'}
            </p>
            {oneSignalError && (
              <p style={{ color: 'red', fontSize: '14px' }}>
                ❌ {oneSignalError}
              </p>
            )}
          </div>

          {/* BOTTONI DI TEST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
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
                width: '300px'
              }}
            >
              🔔 Mostra Popup Notifiche
            </button>

            <button 
              onClick={forceOneSignalInit}
              style={{
                padding: '12px 24px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '300px'
              }}
            >
              🚨 Forza Inizializzazione
            </button>

            <button 
              onClick={debugOneSignal}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '300px'
              }}
            >
              🔍 Debug Console
            </button>
          </div>

          {/* CODICE VERIFICA ONESIGNAL */}
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '20px',
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '5px',
            border: '1px solid #dee2e6'
          }}>
            <strong>Codice di verifica OneSignal:</strong> OS7K3L
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
      </footer>
    </div>
  );
}

function App() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  const [oneSignalError, setOneSignalError] = useState('');

  useEffect(() => {
    console.log('🚀 INIZIO INIZIALIZZAZIONE ONESIGNAL');
    console.log('App ID:', import.meta.env.VITE_ONESIGNAL_APP_ID);

    if (!import.meta.env.VITE_ONESIGNAL_APP_ID) {
      setOneSignalError('VITE_ONESIGNAL_APP_ID non configurata');
      return;
    }

    const initializeOneSignal = () => {
      window.OneSignal = window.OneSignal || [];
      
      window.OneSignal.push(function() {
        console.log('🔍 OneSignal interno pronto per init');
        
        OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        }).then(() => {
          console.log('✅ OneSignal.init() COMPLETATO');
          setIsOneSignalReady(true);
          setOneSignalError('');
          
          // Aspetta e prova il popup automatico
          setTimeout(() => {
            console.log('🎯 Tentativo popup automatico...');
            OneSignal.showSlidedownPrompt().then(() => {
              console.log('✅ Popup automatico mostrato!');
            }).catch(error => {
              console.log('⚠️ Popup automatico non mostrato:', error.message);
            });
          }, 2000);
          
        }).catch(error => {
          console.error('💥 ERRORE OneSignal init:', error);
          setIsOneSignalReady(false);
          setOneSignalError(error.message);
        });
      });
    };

    // Aspetta che la pagina sia pronta
    if (document.readyState === 'complete') {
      initializeOneSignal();
    } else {
      window.addEventListener('load', initializeOneSignal);
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

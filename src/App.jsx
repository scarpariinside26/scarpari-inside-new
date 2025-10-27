import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);

  // INIZIALIZZA ONESIGNAL
  const initializeOneSignal = async () => {
    console.log('🚀 Inizializzazione OneSignal...');
    
    if (typeof window.OneSignal === 'undefined') {
      alert('❌ OneSignal non caricato');
      return;
    }

    try {
      await window.OneSignal.init({
        appId: "35648a40-c681-40dd-8151-2db3867ee0fc",
        allowLocalhostAsSecureOrigin: true,
      });
      
      console.log('✅ OneSignal inizializzata!');
      setIsOneSignalReady(true);
      alert('✅ OneSignal inizializzata! Ora usa "Mostra Popup"');
      
    } catch (error) {
      console.error('❌ Errore inizializzazione:', error);
      alert('❌ Errore: ' + error.message);
    }
  };

  // MOSTRA POPUP NOTIFICHE - METODI MODERNI
  const showNotificationPopup = async () => {
    if (!isOneSignalReady) {
      alert('❌ Prima inizializza OneSignal');
      return;
    }

    try {
      console.log('🎯 Tentativo popup notifiche...');
      
      // METODO 1: Slidedown.promptPush (più comune nelle nuove versioni)
      if (window.OneSignal.Slidedown && typeof window.OneSignal.Slidedown.promptPush === 'function') {
        console.log('🔹 Usando Slidedown.promptPush');
        await window.OneSignal.Slidedown.promptPush();
        alert('✅ Popup mostrato! (Slidedown)');
        return;
      }
      
      // METODO 2: Notifications.requestPermission
      if (window.OneSignal.Notifications && typeof window.OneSignal.Notifications.requestPermission === 'function') {
        console.log('🔹 Usando Notifications.requestPermission');
        await window.OneSignal.Notifications.requestPermission();
        alert('✅ Popup mostrato! (Notifications)');
        return;
      }
      
      // METODO 3: User (se disponibile)
      if (window.OneSignal.User && typeof window.OneSignal.User.addTrigger === 'function') {
        console.log('🔹 OneSignal User API disponibile');
        // Prova a triggerare il popup
        window.OneSignal.User.addTrigger('prompt_clicked', true);
        alert('✅ Trigger inviato! Controlla se appare il popup.');
        return;
      }

      // METODO 4: Debug e scopri metodi disponibili
      console.log('🔍 Metodi OneSignal disponibili:');
      console.log('- OneSignal:', Object.keys(window.OneSignal));
      if (window.OneSignal.Slidedown) console.log('- Slidedown:', Object.keys(window.OneSignal.Slidedown));
      if (window.OneSignal.Notifications) console.log('- Notifications:', Object.keys(window.OneSignal.Notifications));
      if (window.OneSignal.User) console.log('- User:', Object.keys(window.OneSignal.User));
      
      alert('❌ Nessun metodo popup trovato. Controlla console per debug.');
      
    } catch (error) {
      console.error('❌ Errore popup:', error);
      alert('❌ Errore popup: ' + error.message);
    }
  };

  // DEBUG AVANZATO
  const debugOneSignalAdvanced = () => {
    console.log('=== DEBUG AVANZATO ONESIGNAL ===');
    console.log('OneSignal:', window.OneSignal);
    
    if (window.OneSignal) {
      console.log('🔧 Proprietà principali:');
      console.log('- Slidedown:', window.OneSignal.Slidedown);
      console.log('- Notifications:', window.OneSignal.Notifications);
      console.log('- User:', window.OneSignal.User);
      console.log('- Context:', window.OneSignal.context);
      
      console.log('📋 Tutte le proprietà:');
      Object.keys(window.OneSignal).forEach(key => {
        console.log(`- ${key}:`, typeof window.OneSignal[key]);
      });
    }
    
    alert('✅ Debug completato! Controlla la console.');
  };

  // INIZIALIZZAZIONE AUTOMATICA
  useEffect(() => {
    const init = async () => {
      if (window.OneSignal && typeof window.OneSignal.init === 'function') {
        try {
          await window.OneSignal.init({
            appId: "35648a40-c681-40dd-8151-2db3867ee0fc",
            allowLocalhostAsSecureOrigin: true,
          });
          setIsOneSignalReady(true);
          console.log('✅ OneSignal auto-inizializzata');
        } catch (error) {
          console.log('⚠️ OneSignal già inizializzata o errore:', error);
        }
      }
    };
    
    // Aspetta che la pagina sia completamente caricata
    setTimeout(init, 1000);
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
        {/* SEZIONE ONESIGNAL MODERNA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: isOneSignalReady ? '#e8f5e8' : '#fff3cd', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: isOneSignalReady ? '2px solid green' : '2px solid orange'
          }}>
            <h3>🔔 OneSignal SDK Moderno</h3>
            <p style={{ 
              color: isOneSignalReady ? 'green' : '#856404',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {isOneSignalReady ? '✅ INIZIALIZZATA' : '🔄 DA INIZIALIZZARE'}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Versione: Classe/Funzione - SDK V2
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={initializeOneSignal}
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
              🔧 Inizializza OneSignal
            </button>

            <button 
              onClick={showNotificationPopup}
              disabled={!isOneSignalReady}
              style={{
                padding: '12px 24px',
                background: isOneSignalReady ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isOneSignalReady ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '300px'
              }}
            >
              🔔 Mostra Popup Notifiche
            </button>

            <button 
              onClick={debugOneSignalAdvanced}
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
              🔍 Debug Avanzato
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

import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);

  // INIZIALIZZA ONESIGNAL - METODO CORRETTO
  const initializeOneSignal = async () => {
    console.log('🚀 Inizializzazione OneSignal...');
    
    // Controlla se OneSignal è caricato
    if (typeof window.OneSignal === 'undefined') {
      console.error('❌ OneSignal non trovato');
      alert('❌ OneSignal non caricato. Controlla lo script nell\'HTML.');
      return;
    }

    try {
      // Inizializzazione corretta
      await window.OneSignal.init({
        appId: "35648a40-c681-40dd-8151-2db3867ee0fc",
        safari_web_id: "",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
        promptOptions: {
          slidedown: {
            enabled: true,
            autoPrompt: false,
            timeDelay: 3,
            pageViews: 1,
          }
        }
      });
      
      console.log('✅ OneSignal inizializzata!');
      setIsOneSignalReady(true);
      
      // Controlla lo stato della sottoscrizione
      checkSubscriptionStatus();
      
      alert('✅ OneSignal inizializzata! Ora puoi mostrare il popup.');
      
    } catch (error) {
      console.error('❌ Errore inizializzazione:', error);
      alert('❌ Errore inizializzazione: ' + error.message);
    }
  };

  // CONTROLLA STATO SOTTOSCRIZIONE
  const checkSubscriptionStatus = async () => {
    if (!window.OneSignal) return;
    
    try {
      const isSubscribed = await window.OneSignal.User.PushSubscription.optIn();
      const permission = await window.OneSignal.User.PushSubscription.permission;
      
      setUserSubscription({
        isSubscribed,
        permission,
        id: await window.OneSignal.User.PushSubscription.id
      });
      
      console.log('📊 Stato sottoscrizione:', { isSubscribed, permission });
    } catch (error) {
      console.error('Errore controllo sottoscrizione:', error);
    }
  };

  // MOSTRA POPUP NOTIFICHE - METODO CORRETTO 2024
  const showNotificationPopup = async () => {
    if (!isOneSignalReady) {
      alert('❌ Prima inizializza OneSignal');
      return;
    }

    try {
      console.log('🎯 Tentativo popup notifiche...');
      
      // METODO 1: Slidedown (più efficace)
      if (window.OneSignal.Slidedown) {
        console.log('🔹 Usando Slidedown');
        await window.OneSignal.Slidedown.pushPrompt();
        return;
      }
      
      // METODO 2: Permessi nativi del browser
      const permission = await Notification.requestPermission();
      console.log('🔹 Permesso notifiche:', permission);
      
      if (permission === 'granted') {
        alert('✅ Notifiche abilitate!');
        checkSubscriptionStatus();
      } else {
        alert('❌ Notifiche non abilitate. Controlla le impostazioni del browser.');
      }
      
    } catch (error) {
      console.error('❌ Errore popup:', error);
      alert('❌ Errore popup: ' + error.message);
    }
  };

  // REGISTRA AZIONE UTENTE PER TRIGGER AUTOMATICO
  const registerUserAction = () => {
    if (!window.OneSignal) return;
    
    try {
      // Questo può triggerare lo slidedown automatico
      window.OneSignal.User.addTrigger('prompt_interaction', 'clicked');
      console.log('✅ Azione utente registrata');
    } catch (error) {
      console.log('⚠️ Trigger non disponibile');
    }
  };

  // INIZIALIZZAZIONE AUTOMATICA AL CARICAMENTO
  useEffect(() => {
    const initOneSignal = async () => {
      // Aspetta che OneSignal sia completamente caricato
      if (typeof window.OneSignal === 'undefined') {
        console.log('⏳ OneSignal non ancora caricato, riprovo...');
        setTimeout(initOneSignal, 1000);
        return;
      }

      try {
        await window.OneSignal.init({
          appId: "35648a40-c681-40dd-8151-2db3867ee0fc",
          allowLocalhostAsSecureOrigin: true,
          promptOptions: {
            slidedown: {
              enabled: true,
              autoPrompt: false, // Disabilita auto-popup, lo controlliamo noi
            }
          }
        });
        
        setIsOneSignalReady(true);
        checkSubscriptionStatus();
        console.log('✅ OneSignal auto-inizializzata');
        
      } catch (error) {
        console.log('⚠️ OneSignal già inizializzata:', error.message);
      }
    };

    // Prova dopo 2 secondi per dare tempo allo script di caricare
    setTimeout(initOneSignal, 2000);
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
        {/* SEZIONE ONESIGNAL MIGLIORATA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: isOneSignalReady ? '#e8f5e8' : '#fff3cd', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: isOneSignalReady ? '2px solid green' : '2px solid orange'
          }}>
            <h3>🔔 Sistema Notifiche OneSignal</h3>
            <p style={{ 
              color: isOneSignalReady ? 'green' : '#856404',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {isOneSignalReady ? '✅ SDK PRONTO' : '🔄 SDK IN CARICAMENTO'}
            </p>
            
            {userSubscription && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <p>📊 Stato: <strong>{userSubscription.isSubscribed ? 'ISCRITTO' : 'NON ISCRITTO'}</strong></p>
                <p>🔐 Permesso: <strong>{userSubscription.permission}</strong></p>
              </div>
            )}
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
              🔔 Richiedi Notifiche
            </button>

            <button 
              onClick={registerUserAction}
              style={{
                padding: '10px 20px',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '300px'
              }}
            >
              🎯 Registra Azione Utente
            </button>
          </div>
        </div>

        {/* MENU PRINCIPALE - invariato */}
        <div className="menu-grid">
          <Link to="/eventi" className="menu-btn" onClick={registerUserAction}>
            <span className="icon">🗓️</span>
            <span className="text">EVENTI</span>
            <span className="desc">Gestione eventi e generazione squadre</span>
          </Link>

          <Link to="/eventi" className="menu-btn" onClick={registerUserAction}>
            <span className="icon">👥</span>
            <span className="text">GENERA SQUADRE</span>
            <span className="desc">Crea squadre bilanciate per le partite</span>
          </Link>

          {/* ... altri menu items ... */}
        </div>
      </main>

      <footer className="footer">
        <p>- proudly made with rabbia in Veneto -</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          OneSignal App ID: 35648a40-c681-40dd-8151-2db3867ee0fc
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

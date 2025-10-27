import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');

  // RILEVA BROWSER
  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Opera')) return 'Opera';
      return 'Unknown';
    };
    
    setBrowserInfo(detectBrowser());
  }, []);

  // INIZIALIZZA ONESIGNAL - OTTIMIZZATA
  const initializeOneSignal = () => {
    console.log('🚀 Inizializzazione OneSignal per:', browserInfo);
    setDebugInfo(`Inizializzazione per ${browserInfo}...`);

    if (typeof window.OneSignal === 'undefined') {
      const errorMsg = '❌ OneSignal non trovato. Ricarica la pagina.';
      setDebugInfo(errorMsg);
      alert(errorMsg);
      return;
    }

    // Configurazione specifica per Chrome
    const config = {
      appId: "35648a40-c681-40dd-8151-2db3867ee0fc",
      allowLocalhostAsSecureOrigin: true,
      promptOptions: {
        slidedown: {
          enabled: true,
          autoPrompt: false,
          timeDelay: 1,
          pageViews: 1,
        }
      }
    };

    window.OneSignal.init(config).then(() => {
      console.log('✅ OneSignal inizializzata per', browserInfo);
      setDebugInfo(`✅ Pronto per ${browserInfo}`);
      setIsOneSignalReady(true);
      
      // Per Chrome: controlla subito lo stato dei permessi
      if (browserInfo === 'Chrome') {
        checkNotificationPermission();
      }
    }).catch(error => {
      console.error('❌ Errore:', error);
      setDebugInfo('❌ Errore: ' + error.message);
    });
  };

  // CONTROLLA PERMESSI NOTIFICHE
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      console.log('🔔 Permesso attuale:', permission);
      setDebugInfo(prev => prev + ` | Permesso: ${permission}`);
      
      if (permission === 'denied') {
        alert('🔕 Notifiche bloccate. Sbloccale nelle impostazioni Chrome.');
      }
      return permission;
    }
    return 'not-supported';
  };

  // POPUP OTTIMIZZATO PER CHROME
  const showNotificationPopup = async () => {
    if (!isOneSignalReady) {
      alert('❌ Prima inizializza OneSignal');
      return;
    }

    console.log('🎯 Avvio popup per:', browserInfo);
    setDebugInfo('Avvio popup...');

    const currentPermission = checkNotificationPermission();
    
    // Se già bloccato, mostra alert
    if (currentPermission === 'denied') {
      alert('🚫 Notifiche bloccate! Vai in Impostazioni Chrome → Site Settings → Notifications per sbloccare.');
      return;
    }

    try {
      // PRIMO METODO: Slidedown (migliore per Chrome)
      if (typeof window.OneSignal.showSlidedownPrompt === 'function') {
        console.log('🔹 Tentativo Slidedown su Chrome');
        
        const result = await window.OneSignal.showSlidedownPrompt({
          force: true
        });
        
        console.log('✅ Risultato Slidedown:', result);
        setDebugInfo('✅ Popup slidedown mostrato');
        return;
      }

      // SECONDO METODO: Notifications API di OneSignal
      if (window.OneSignal.Notifications) {
        console.log('🔹 Tentativo Notifications API');
        
        const permission = await window.OneSignal.Notifications.requestPermission();
        console.log('🔔 Risultato permesso:', permission);
        setDebugInfo(`Permesso: ${permission}`);
        
        if (permission === 'granted') {
          alert('🎉 Notifiche abilitate! Ora riceverai aggiornamenti sugli eventi.');
        } else if (permission === 'default') {
          setDebugInfo('⚠️ Popup chiuso senza decidere');
          alert('Hai chiuso il popup. Clicca di nuovo per abilitare le notifiche.');
        }
        return;
      }

      // TERZO METODO: API nativa come fallback
      if ('Notification' in window && Notification.permission === 'default') {
        console.log('🔹 Tentativo API nativa');
        
        const permission = await Notification.requestPermission();
        console.log('🔔 Permesso API nativa:', permission);
        
        if (permission === 'granted' && window.OneSignal) {
          // Registra con OneSignal dopo il permesso
          window.OneSignal.registerForPushNotifications();
          alert('🎉 Notifiche abilitate!');
        }
        setDebugInfo(`API nativa: ${permission}`);
        return;
      }

      setDebugInfo('❌ Nessun metodo disponibile');
      alert('❌ Impossibile mostrare il popup. Prova con un altro browser.');

    } catch (error) {
      console.error('❌ Errore popup:', error);
      setDebugInfo('❌ Errore: ' + error.message);
      
      // Fallback estremo
      if (confirm('Popup fallito. Vuoi provare con il metodo nativo del browser?')) {
        Notification.requestPermission();
      }
    }
  };

  // DEBUG
  const debugOneSignal = () => {
    console.log('=== DEBUG BROWSER ===');
    console.log('Browser:', browserInfo);
    console.log('UserAgent:', navigator.userAgent);
    console.log('Notification API:', 'Notification' in window);
    console.log('Notification.permission:', Notification.permission);
    
    if (window.OneSignal) {
      console.log('OneSignal caricato:', true);
      console.log('Metodi:', Object.keys(window.OneSignal).filter(k => typeof window.OneSignal[k] === 'function'));
    }
    
    setDebugInfo(`Browser: ${browserInfo} | Permesso: ${Notification.permission}`);
  };

  // AUTO-INIT
  useEffect(() => {
    const init = () => {
      if (typeof window.OneSignal !== 'undefined' && !window.OneSignal.initialized) {
        initializeOneSignal();
      }
    };
    
    setTimeout(init, 2000);
  }, [browserInfo]);

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
        {/* SEZIONE ONESIGNAL CON INFO BROWSER */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: browserInfo === 'Chrome' ? '#fff3e0' : 
                       browserInfo === 'Opera' ? '#e8f5e8' : '#f0f0f0',
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: isOneSignalReady ? '2px solid green' : '2px solid orange'
          }}>
            <h3>🔔 Notifiche - {browserInfo}</h3>
            <p style={{ 
              color: isOneSignalReady ? 'green' : '#856404',
              fontWeight: 'bold',
              fontSize: '16px',
              marginBottom: '10px'
            }}>
              {isOneSignalReady ? '✅ PRONTO' : '🔄 INIZIALIZZAZIONE'}
            </p>
            <p style={{ fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>
              {debugInfo || `Browser: ${browserInfo} | Clicca Debug per info`}
            </p>
            {browserInfo === 'Chrome' && (
              <p style={{ fontSize: '12px', color: '#e65100', marginTop: '8px' }}>
                ⚠️ Chrome richiede click utente e HTTPS
              </p>
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
              {browserInfo === 'Chrome' ? '🔔 Popup Chrome' : '🔔 Richiedi Notifiche'}
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
              🔍 Debug {browserInfo}
            </button>
          </div>
        </div>

        {/* RESTANTE CODICE INVARIATO */}
        <div className="menu-grid">
          <Link to="/eventi" className="menu-btn">
            <span className="icon">🗓️</span>
            <span className="text">EVENTI</span>
            <span className="desc">Gestione eventi e generazione squadre</span>
          </Link>
          {/* ... altri menu items ... */}
        </div>
      </main>

      <footer className="footer">
        <p>- proudly made with rabbia in Veneto -</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Browser: {browserInfo} | OneSignal: {isOneSignalReady ? 'Pronto' : 'In attesa'}
        </p>
      </footer>
    </div>
  );
}

// App component rimane invariato
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

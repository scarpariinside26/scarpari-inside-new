import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage() {
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');

  // RILEVA BROWSER E STATO NOTIFICHE
  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Opera')) return 'Opera';
      return 'Unknown';
    };
    
    const browser = detectBrowser();
    setBrowserInfo(browser);
    
    // Controlla stato notifiche
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  // INIZIALIZZA ONESIGNAL - CON CONTROLLO SE GIA' INIZIALIZZATA
  const initializeOneSignal = () => {
    console.log('🚀 Inizializzazione OneSignal per:', browserInfo);
    setDebugInfo(`Inizializzazione per ${browserInfo}...`);

    if (typeof window.OneSignal === 'undefined') {
      const errorMsg = '❌ OneSignal non trovato. Ricarica la pagina.';
      setDebugInfo(errorMsg);
      alert(errorMsg);
      return;
    }

    // Se già inizializzata, non reinizializzare
    if (window.OneSignal.initialized) {
      console.log('✅ OneSignal già inizializzata');
      setDebugInfo('✅ Già inizializzata');
      setIsOneSignalReady(true);
      return;
    }

    // Configurazione per Chrome e altri browser
    const config = {
      appId: "35648a40-c681-40dd-8151-2db3867ee0fc",
      allowLocalhostAsSecureOrigin: true,
      promptOptions: {
        slidedown: {
          enabled: true,
          autoPrompt: false,
        }
      }
    };

    window.OneSignal.init(config).then(() => {
      console.log('✅ OneSignal inizializzata per', browserInfo);
      setDebugInfo(`✅ Pronto per ${browserInfo}`);
      setIsOneSignalReady(true);
    }).catch(error => {
      // Se è già inizializzata, considera comunque pronto
      if (error.message.includes('already initialized')) {
        console.log('✅ OneSignal già inizializzata');
        setDebugInfo('✅ Già inizializzata');
        setIsOneSignalReady(true);
      } else {
        console.error('❌ Errore:', error);
        setDebugInfo('❌ Errore: ' + error.message);
      }
    });
  };

  // CONTROLLA PERMESSI NOTIFICHE
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setNotificationStatus(permission);
      console.log('🔔 Permesso attuale:', permission);
      return permission;
    }
    return 'not-supported';
  };

  // ISTRUZIONI DETTAGLIATE PER SBLOCCO CHROME
  const showChromeUnblockInstructions = () => {
    const instructions = `
🎯 ISTRUZIONI SBLOCCO NOTIFICHE CHROME:

1. 🔒 CERCA l'icona nella barra degli indirizzi:
   - Se vedi 🚫 = Bloccate
   - Se vedi 🔒 = Impostazioni

2. 📍 CLICCA sull'icona (🔒 o 🚫)

3. ⚙️ CERCA "Notifiche" nella lista

4. ✅ CAMBIA da "Blocca" a "Consenti"

5. 🔄 RICARICA la pagina (F5 o Ctrl+R)

6. 🎉 CLICCA di nuovo su "Richiedi Notifiche"

💡 CONSIGLIO: Usa una finestra di navigazione anonima (Ctrl+Shift+N) per testare più facilmente!
    `;
    
    alert(instructions);
    setDebugInfo('📋 Istruzioni sblocco mostrate');
  };

  // POPUP OTTIMIZZATO PER CHROME CON GESTIONE BLOCCCHI
  const showNotificationPopup = async () => {
    if (!isOneSignalReady) {
      alert('❌ Prima inizializza OneSignal');
      return;
    }

    console.log('🎯 Avvio popup per:', browserInfo);
    setDebugInfo('Avvio popup...');

    const currentPermission = checkNotificationPermission();
    console.log('🔔 Permesso corrente:', currentPermission);

    // SE LE NOTIFICHE SONO BLOCCATE
    if (currentPermission === 'denied') {
      setDebugInfo('❌ Notifiche BLOCCATE in Chrome');
      
      const shouldUnblock = confirm(
        '🚫 Chrome ha bloccato le notifiche per questo sito.\n\n' +
        'Per sbloccare:\n' +
        '1. Clicca sull\'icona 🔒 nella barra degli indirizzi\n' +
        '2. Clicca "Impostazioni sito"\n' +
        '3. Imposta "Notifiche" su "Consenti"\n' +
        '4. Ricarica la pagina\n\n' +
        'Vuoi che ti mostri le istruzioni dettagliate?'
      );
      
      if (shouldUnblock) {
        showChromeUnblockInstructions();
      }
      return;
    }

    // SE L'UTENTE NON HA ANCORA DECISO
    if (currentPermission === 'default') {
      try {
        console.log('🔹 Tentativo con OneSignal...');
        
        // PRIMA PROVA: Slidedown di OneSignal
        if (typeof window.OneSignal.showSlidedownPrompt === 'function') {
          await window.OneSignal.showSlidedownPrompt({ force: true });
          setDebugInfo('✅ Popup OneSignal mostrato');
          checkNotificationPermission(); // Aggiorna stato
          return;
        }

        // SECONDA PROVA: Notifications API di OneSignal
        if (window.OneSignal.Notifications && typeof window.OneSignal.Notifications.requestPermission === 'function') {
          const permission = await window.OneSignal.Notifications.requestPermission();
          console.log('🔔 Risultato OneSignal:', permission);
          setDebugInfo(`OneSignal: ${permission}`);
          checkNotificationPermission();
          
          if (permission === true) {
            alert('🎉 Notifiche abilitate con OneSignal!');
          }
          return;
        }

        // TERZA PROVA: API nativa del browser
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          console.log('🔔 Risultato API nativa:', permission);
          setDebugInfo(`API nativa: ${permission}`);
          setNotificationStatus(permission);
          
          if (permission === 'granted') {
            alert('🎉 Notifiche abilitate!');
            // Sincronizza con OneSignal se possibile
            if (window.OneSignal && window.OneSignal.setSubscription) {
              window.OneSignal.setSubscription(true);
            }
          } else if (permission === 'default') {
            setDebugInfo('⚠️ Popup chiuso senza decidere');
          }
          return;
        }

        setDebugInfo('❌ Nessun metodo disponibile');

      } catch (error) {
        console.error('❌ Errore popup:', error);
        setDebugInfo('❌ Errore: ' + error.message);
      }
    } 
    // SE LE NOTIFICHE SONO GIA' ABILITATE
    else if (currentPermission === 'granted') {
      setDebugInfo('✅ Notifiche già abilitate!');
      alert('🔔 Notifiche già abilitate per questo sito!');
    }
  };

  // DEBUG COMPLETO
  const debugOneSignal = () => {
    console.log('=== DEBUG COMPLETO ===');
    console.log('Browser:', browserInfo);
    console.log('UserAgent:', navigator.userAgent);
    console.log('Notification API:', 'Notification' in window);
    console.log('Notification.permission:', Notification.permission);
    console.log('OneSignal caricato:', !!window.OneSignal);
    
    if (window.OneSignal) {
      console.log('OneSignal.initialized:', window.OneSignal.initialized);
      console.log('Metodi disponibili:', Object.keys(window.OneSignal).filter(k => typeof window.OneSignal[k] === 'function'));
    }

    // Messaggio di stato per l'utente
    let statusMessage = '';
    if (Notification.permission === 'denied') {
      statusMessage = '❌ BLOCCATO - Usa "Istruzioni Sblocco"';
    } else if (Notification.permission === 'granted') {
      statusMessage = '✅ ABILITATO';
    } else {
      statusMessage = '🔄 IN ATTESA - Clicca "Richiedi Notifiche"';
    }
    
    setDebugInfo(`${browserInfo}: ${Notification.permission} - ${statusMessage}`);
  };

  // RESETTA STATO NOTIFICHE (per testing)
  const resetNotificationTest = () => {
    if (confirm('Vuoi resettare lo stato delle notifiche per testing?\n\nApri una nuova finestra anonima per testare più facilmente.')) {
      setDebugInfo('🔄 Reset per testing - Usa finestra anonima');
      setNotificationStatus('default');
    }
  };

  // AUTO-INIT AL CARICAMENTO
  useEffect(() => {
    const initOneSignal = () => {
      if (typeof window.OneSignal !== 'undefined') {
        // Se non è già inizializzata, inizializza
        if (!window.OneSignal.initialized) {
          initializeOneSignal();
        } else {
          console.log('✅ OneSignal già inizializzata al caricamento');
          setIsOneSignalReady(true);
          setDebugInfo('✅ Auto-inizializzata');
        }
      } else {
        console.log('⏳ OneSignal non ancora caricato, riprovo...');
        setTimeout(initOneSignal, 1000);
      }
    };

    // Aspetta che lo script sia caricato
    setTimeout(initOneSignal, 1500);
  }, [browserInfo]);

  // Colore del badge in base allo stato
  const getStatusColor = () => {
    if (notificationStatus === 'denied') return '#ff4444';
    if (notificationStatus === 'granted') return '#28a745';
    return '#ffc107';
  };

  // Testo dello stato
  const getStatusText = () => {
    if (notificationStatus === 'denied') return 'BLOCCATE';
    if (notificationStatus === 'granted') return 'ABILITATE';
    return 'DA DECIDERE';
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
        {/* SEZIONE ONESIGNAL CON STATO VISIVO */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: notificationStatus === 'denied' ? '#ffeaea' : 
                       notificationStatus === 'granted' ? '#e8f5e8' : '#fff3cd',
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: `2px solid ${getStatusColor()}`
          }}>
            <h3>🔔 Sistema Notifiche - {browserInfo}</h3>
            <div style={{ 
              display: 'inline-block',
              background: getStatusColor(),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              margin: '10px 0'
            }}>
              {getStatusText()}
            </div>
            <p style={{ 
              color: notificationStatus === 'denied' ? '#d32f2f' : 
                     notificationStatus === 'granted' ? 'green' : '#856404',
              fontWeight: 'bold',
              fontSize: '16px',
              marginBottom: '10px'
            }}>
              {isOneSignalReady ? '✅ SDK PRONTO' : '🔄 SDK IN CARICAMENTO'}
            </p>
            <p style={{ fontSize: '14px', color: '#666', fontFamily: 'monospace', minHeight: '20px' }}>
              {debugInfo || `Stato: ${notificationStatus || 'checking...'}`}
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
              🔧 1. Inizializza OneSignal
            </button>

            <button 
              onClick={showNotificationPopup}
              disabled={!isOneSignalReady || notificationStatus === 'denied'}
              style={{
                padding: '12px 24px',
                background: !isOneSignalReady ? '#6c757d' : 
                           notificationStatus === 'denied' ? '#ff6b6b' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (isOneSignalReady && notificationStatus !== 'denied') ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '300px'
              }}
            >
              {notificationStatus === 'denied' ? '🚫 Notifiche Bloccate' : '🔔 2. Richiedi Notifiche'}
            </button>

            {notificationStatus === 'denied' && (
              <button 
                onClick={showChromeUnblockInstructions}
                style={{
                  padding: '12px 24px',
                  background: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  width: '300px'
                }}
              >
                🔧 Istruzioni Sblocco Chrome
              </button>
            )}

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
              🔍 3. Debug Completo
            </button>

            <button 
              onClick={resetNotificationTest}
              style={{
                padding: '8px 16px',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                width: '300px'
              }}
            >
              🔄 Reset Test (Finestra Anonima)
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
          Browser: {browserInfo} | Notifiche: {notificationStatus} | OneSignal: {isOneSignalReady ? '✅' : '🔄'}
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

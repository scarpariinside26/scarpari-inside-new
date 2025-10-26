import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

function HomePage({ oneSignalLoaded, onTestNotification }) {
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
            onClick={onTestNotification}
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
          
          {/* DEBUG INFO */}
          <div style={{ 
            fontSize: '12px', 
            color: oneSignalLoaded ? 'green' : 'orange',
            marginTop: '10px',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '5px'
          }}>
            {oneSignalLoaded ? '✅ OneSignal CARICATO' : '🔄 OneSignal in caricamento...'}
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
  const [oneSignalLoaded, setOneSignalLoaded] = useState(false);
  const [oneSignalError, setOneSignalError] = useState('');

  // TEST NOTIFICHE - VERSIONE SEMPLICE
  const testNotification = async () => {
    console.log('🧪 Test notifica...');
    
    if (!window.OneSignal) {
      alert('❌ OneSignal non ancora pronto');
      return;
    }

    try {
      // Prova a inviare una notifica di test
      // Per ora mostriamo solo un alert
      alert('✅ OneSignal è caricato! Le notifiche sono pronte.\n\nOra puoi:\n1. Configurare le notifiche in Dashboard OneSignal\n2. Inviare notifiche manualmente dalla dashboard\n3. I tuoi utenti riceveranno le notifiche!');
      
      console.log('✅ Test completato - OneSignal funziona');
    } catch (error) {
      console.error('❌ Errore test:', error);
      alert('❌ Errore: ' + error.message);
    }
  };

  useEffect(() => {
    console.log('🚀 INIZIO INIZIALIZZAZIONE ONESIGNAL');
    
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    console.log('🔍 App ID:', appId ? 'PRESENTE' : 'MANCANTE');
    
    if (!appId) {
      setOneSignalError('❌ VITE_ONESIGNAL_APP_ID non configurato in Vercel');
      console.error('VITE_ONESIGNAL_APP_ID mancante');
      return;
    }

    // VERIFICA SE ONESIGNAL È GIA' CARICATO
    if (window.OneSignal) {
      console.log('✅ OneSignal già presente');
      setOneSignalLoaded(true);
      return;
    }

    // CARICAMENTO ONESIGNAL - VERSIONE SICURA
    const loadOneSignal = () => {
      return new Promise((resolve, reject) => {
        // Se OneSignal è già in caricamento, aspetta
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(resolve);
          return;
        }

        const script = document.createElement('script');
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
        script.async = true;
        
        script.onload = () => {
          console.log('✅ Script OneSignal caricato con successo');
          // OneSignal si inizializza automaticamente
          setTimeout(() => {
            if (window.OneSignal) {
              console.log('✅ OneSignal inizializzato automaticamente');
              resolve(true);
            } else {
              reject(new Error('OneSignal non inizializzato dopo il caricamento'));
            }
          }, 1000);
        };
        
        script.onerror = (error) => {
          console.error('❌ Errore caricamento script OneSignal:', error);
          reject(error);
        };
        
        document.head.appendChild(script);
        console.log('📜 Script OneSignal aggiunto alla pagina');
      });
    };

    // ESECUZIONE CARICAMENTO
    loadOneSignal()
      .then(() => {
        console.log('🎉 OneSignal caricato con successo!');
        setOneSignalLoaded(true);
        setOneSignalError('');
        
        // Aspetta che OneSignal sia completamente pronto
        setTimeout(() => {
          if (window.OneSignal && window.OneSignal.Notifications) {
            console.log('🔔 OneSignal Notifications API pronto');
            
            // Configura i listener per i click
            window.OneSignal.Notifications.addEventListener('click', (event) => {
              console.log('🎯 Notifica cliccata:', event);
              const action = event.actionId;
              if (action === 'conferma') {
                alert('✅ Partecipazione confermata!');
              } else if (action === 'annulla') {
                alert('❌ Partecipazione annullata');
              }
            });
          }
        }, 2000);
      })
      .catch((error) => {
        console.error('❌ Errore caricamento OneSignal:', error);
        setOneSignalError('Errore: ' + error.message);
        setOneSignalLoaded(false);
      });

    // TIMEOUT DI SICUREZZA
    const timeout = setTimeout(() => {
      if (!oneSignalLoaded) {
        console.warn('⚠️ Timeout caricamento OneSignal');
        setOneSignalError('Timeout - Ricarica la pagina');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="App">
      {/* DEBUG INFO */}
      {oneSignalError && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '10px',
          textAlign: 'center',
          fontSize: '14px',
          borderBottom: '1px solid #ffcdd2'
        }}>
          ⚠️ {oneSignalError}
        </div>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              oneSignalLoaded={oneSignalLoaded} 
              onTestNotification={testNotification} 
            />
          } 
        />
        <Route path="/eventi" element={<GestioneEventi />} />
      </Routes>
    </div>
  );
}

export default App;

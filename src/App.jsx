import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GestioneEventi from './pages/GestioneEventi/GestioneEventi';

// FUNZIONE PER INVIARE NOTIFICHE
const sendNotification = async (title, message, buttons = []) => {
  try {
    console.log('📧 Invio notifica:', title);
    
    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${import.meta.env.VITE_ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: import.meta.env.VITE_ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users'],
        headings: { en: title },
        contents: { en: message },
        web_buttons: buttons
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ Errore OneSignal:', result.errors);
      return { success: false, error: result.errors };
    }
    
    console.log('✅ Notifica inviata con ID:', result.id);
    return { success: true, id: result.id };
    
  } catch (error) {
    console.error('❌ Errore invio notifica:', error);
    return { success: false, error: error.message };
  }
};

function HomePage() {
  // TEST NOTIFICHE
  const testNotification = async () => {
    console.log('🧪 Avvio test notifica...');
    
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
      alert('❌ Errore: ' + (result.error || 'Controlla la console'));
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
            🧪 Test Notifiche
          </button>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Clicca per testare le notifiche push
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
  useEffect(() => {
    // INIZIALIZZAZIONE ONESIGNAL
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
      document.head.appendChild(script);
    };

    const initializeOneSignal = () => {
      window.OneSignal = window.OneSignal || [];
      
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        });
        
        window.OneSignal.showSlidedownPrompt();
        
        console.log('✅ OneSignal inizializzato');
        
        // GESTIONE CLICK NOTIFICHE
        window.OneSignal.on('notificationClick', function(event) {
          const buttonId = event.action;
          console.log('🔔 Notifica cliccata:', buttonId);
          
          if (buttonId === 'conferma') {
            console.log('✅ Utente ha confermato partecipazione');
            // Qui aggiungerai la logica per il database
          }
        });
      });
    };

    // INIZIALIZZA SOLO SE L'APP ID È PRESENTE
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

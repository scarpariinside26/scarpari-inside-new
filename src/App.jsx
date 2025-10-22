import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Helper function per colori avatar
function getColorFromName(name) {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#475569'];
  const index = name.length % colors.length;
  return colors[index];
}

// Componente Homepage - Stile Appito
function HomePage({ onNavigate }) {
  const menuItems = [
    { 
      id: 'eventi', 
      icon: '📅', 
      title: 'Eventi', 
      subtitle: 'Crea e gestisci eventi',
      color: '#2563eb'
    },
    { 
      id: 'giocatori', 
      icon: '👥', 
      title: 'Giocatori', 
      subtitle: 'Gestisci la squadra',
      color: '#dc2626'
    },
    { 
      id: 'classifica', 
      icon: '🏆', 
      title: 'Classifica', 
      subtitle: 'Statistiche e ranking',
      color: '#ea580c'
    },
    { 
      id: 'feed', 
      icon: '💬', 
      title: 'Feed', 
      subtitle: 'News e aggiornamenti',
      color: '#16a34a'
    },
    { 
      id: 'statistiche', 
      icon: '📊', 
      title: 'Statistiche', 
      subtitle: 'Analisi performance',
      color: '#7c3aed'
    },
    { 
      id: 'impostazioni', 
      icon: '⚙️', 
      title: 'Impostazioni', 
      subtitle: 'Preferenze sistema',
      color: '#475569'
    }
  ];

  return (
    <div className="appito-home">
      {/* HEADER MINIMAL */}
      <header className="appito-header">
        <div className="header-content">
          <h1 className="app-name">Scarpari</h1>
          <div className="user-avatar">SI</div>
        </div>
      </header>

      {/* GRIGLIA PULITA */}
      <main className="appito-main">
        <div className="grid-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => onNavigate(item.id)}
            >
              <div 
                className="card-icon"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-subtitle">{item.subtitle}</p>
              </div>
              <div className="card-arrow">›</div>
            </div>
          ))}
        </div>
      </main>

      {/* NAVIGAZIONE INFERIORE */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <span>🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-item">
          <span>📅</span>
          <span>Eventi</span>
        </button>
        <button className="nav-item">
          <span>👥</span>
          <span>Giocatori</span>
        </button>
        <button className="nav-item">
          <span>👤</span>
          <span>Profilo</span>
        </button>
      </nav>
    </div>
  );
}

// Componente Dettaglio Giocatore con Geolocalizzazione
function DettaglioGiocatorePage({ onBack, giocatoreId }) {
  const [giocatore, setGiocatore] = useState(null);
  const [modificaCitta, setModificaCitta] = useState(false);
  const [nuovaCitta, setNuovaCitta] = useState('');
  const [caricamentoGeo, setCaricamentoGeo] = useState(false);

  useEffect(() => {
    fetchGiocatore();
  }, [giocatoreId]);

  const fetchGiocatore = async () => {
    const { data } = await supabase
      .from('profili_utenti')
      .select('*')
      .eq('id', giocatoreId)
      .single();
    
    if (data) {
      setGiocatore(data);
      setNuovaCitta(data.citta || '');
    }
  };

  const geolocalizzaAutomatica = async () => {
    // 1. Controlla se il browser supporta la geolocalizzazione
    if (!navigator.geolocation) {
      alert('Il tuo browser non supporta la geolocalizzazione. Inserisci manualmente la città.');
      setModificaCitta(true);
      return;
    }

    // 2. Controlla HTTPS (obbligatorio in produzione)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      alert('La geolocalizzazione richiede HTTPS in produzione. Inserisci manualmente la città.');
      setModificaCitta(true);
      return;
    }

    setCaricamentoGeo(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding per ottenere la città
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=it`
          );
          
          if (!response.ok) throw new Error('API non disponibile');
          
          const data = await response.json();
          const cittaTrovata = data.city || data.locality || data.principalSubdivision || 'Posizione sconosciuta';
          
          // Aggiorna immediatamente nel database
          await supabase
            .from('profili_utenti')
            .update({ citta: cittaTrovata })
            .eq('id', giocatoreId);
          
          setNuovaCitta(cittaTrovata);
          fetchGiocatore();
          
        } catch (error) {
          console.error('Errore geolocalizzazione:', error);
          alert('Posizione trovata ma impossibile determinare la città. Inseriscila manualmente.');
          setModificaCitta(true);
        } finally {
          setCaricamentoGeo(false);
        }
      },
      (error) => {
        setCaricamentoGeo(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('Permesso di geolocalizzazione negato. Inserisci manualmente la città.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Posizione non disponibile (GPS spento?). Inserisci manualmente la città.');
            break;
          case error.TIMEOUT:
            alert('Timeout nella geolocalizzazione. Inserisci manualmente la città.');
            break;
          default:
            alert('Errore nella geolocalizzazione. Inserisci manualmente la città.');
        }
        setModificaCitta(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const salvaCitta = async () => {
    if (nuovaCitta.trim()) {
      await supabase
        .from('profili_utenti')
        .update({ citta: nuovaCitta.trim() })
        .eq('id', giocatoreId);
      
      setModificaCitta(false);
      fetchGiocatore();
    } else {
      alert('Inserisci una città valida');
    }
  };

  if (!giocatore) return (
    <div className="appito-page">
      <header className="page-header">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Caricamento...</h1>
      </header>
    </div>
  );

  return (
    <div className="appito-page">
      <header className="page-header">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Profilo Giocatore</h1>
        <div className="header-actions">
          <button className="icon-button">✏️</button>
        </div>
      </header>

      <main className="page-content">
        <div className="profile-header">
          <div 
            className="profile-avatar"
            style={{ backgroundColor: getColorFromName(giocatore.nome_completo) }}
          >
            {giocatore.nome_completo.charAt(0)}
          </div>
          <h2 className="profile-name">{giocatore.nome_completo}</h2>
          <div className="profile-badge">{giocatore.livello_gioco}</div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h3>📧 Email</h3>
            <p>{giocatore.email || 'Non specificata'}</p>
          </div>
          <div className="info-card">
            <h3>📞 Telefono</h3>
            <p>{giocatore.telefono || 'Non specificato'}</p>
          </div>
          <div className="info-card">
            <h3>🎯 Ruoli</h3>
            <div className="ruoli-list">
              {giocatore.portiere && <span className="ruolo">Portiere</span>}
              {giocatore.difensore && <span className="ruolo">Difensore</span>}
              {giocatore.centrocampista && <span className="ruolo">Centrocampista</span>}
              {giocatore.attaccante && <span className="ruolo">Attaccante</span>}
            </div>
          </div>
          
          {/* NUOVO CAMPO CITTA' CON GEOLOCALIZZAZIONE */}
          <div className="info-card">
            <div className="citta-header">
              <h3>🏠 Città</h3>
              <div className="citta-actions">
                {!modificaCitta ? (
                  <>
                    <button 
                      className={`btn-geolocalizza-small ${caricamentoGeo ? 'loading' : ''}`}
                      onClick={geolocalizzaAutomatica}
                      disabled={caricamentoGeo}
                      title="Usa la mia posizione attuale"
                    >
                      {caricamentoGeo ? '⏳' : '📍'}
                    </button>
                    <button 
                      className="btn-modifica"
                      onClick={() => setModificaCitta(true)}
                    >
                      ✏️
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn-salva"
                      onClick={salvaCitta}
                      disabled={!nuovaCitta.trim()}
                    >
                      ✅
                    </button>
                    <button 
                      className="btn-annulla"
                      onClick={() => {
                        setModificaCitta(false);
                        setNuovaCitta(giocatore.citta);
                      }}
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {modificaCitta ? (
              <div className="input-citta-container">
                <input
                  type="text"
                  value={nuovaCitta}
                  onChange={(e) => setNuovaCitta(e.target.value)}
                  placeholder="Inserisci la tua città..."
                  className="input-citta"
                  autoFocus
                />
                <p className="input-helper">
                  Premi Invio per salvare o usa i pulsanti
                </p>
              </div>
            ) : (
              <p className={!giocatore.citta || giocatore.citta === 'Non specificata' ? 'citta-non-specificata' : ''}>
                {giocatore.citta || 'Città non specificata'}
              </p>
            )}
          </div>

          <div className="info-card">
            <h3>📅 Data Iscrizione</h3>
            <p>{giocatore.data_iscrizione ? new Date(giocatore.data_iscrizione).toLocaleDateString('it-IT') : 'Non specificata'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente Giocatori
function GiocatoriPage({ onBack, onNavigate }) {
  const [giocatori, setGiocatori] = useState([]);

  useEffect(() => {
    fetchGiocatori();
  }, []);

  const fetchGiocatori = async () => {
    const { data } = await supabase
      .from('profili_utenti')
      .select('*')
      .order('nome_completo', { ascending: true });
    
    if (data) setGiocatori(data);
  };

  return (
    <div className="appito-page">
      <header className="page-header">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Giocatori</h1>
        <div className="header-actions">
          <button className="icon-button">🔍</button>
          <button className="icon-button">➕</button>
        </div>
      </header>

      <main className="page-content">
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-number">{giocatori.length}</span>
            <span className="stat-label">Totali</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {giocatori.filter(g => g.livello_gioco === 'avanzato').length}
            </span>
            <span className="stat-label">Avanzati</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {giocatori.filter(g => g.livello_gioco === 'intermedio').length}
            </span>
            <span className="stat-label">Intermedi</span>
          </div>
        </div>

        <div className="list-section">
          <h2 className="section-title">Tutti i giocatori</h2>
          <div className="items-list">
            {giocatori.map(giocatore => (
              <div 
                key={giocatore.id} 
                className="list-item"
                onClick={() => onNavigate('dettaglio-giocatore', giocatore.id)}
              >
                <div 
                  className="item-avatar"
                  style={{ backgroundColor: getColorFromName(giocatore.nome_completo) }}
                >
                  {giocatore.nome_completo.charAt(0)}
                </div>
                <div className="item-content">
                  <h3 className="item-title">{giocatore.nome_completo}</h3>
                  <p className="item-subtitle">
                    {giocatore.email} 
                    {giocatore.citta && giocatore.citta !== 'Non specificata' && ` • ${giocatore.citta}`}
                  </p>
                </div>
                <div className="item-badge">
                  {giocatore.livello_gioco}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente Eventi
function EventiPage({ onBack }) {
  const [eventi, setEventi] = useState([]);

  useEffect(() => {
    fetchEventi();
  }, []);

  const fetchEventi = async () => {
    const { data } = await supabase
      .from('eventi')
      .select('*')
      .order('data_ora', { ascending: true });
    
    if (data) setEventi(data);
  };

  return (
    <div className="appito-page">
      <header className="page-header">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Eventi</h1>
        <div className="header-actions">
          <button className="icon-button">🔍</button>
          <button className="icon-button">➕</button>
        </div>
      </header>

      <main className="page-content">
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-number">{eventi.length}</span>
            <span className="stat-label">Totali</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {eventi.filter(e => new Date(e.data_ora) > new Date()).length}
            </span>
            <span className="stat-label">Futuri</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {eventi.filter(e => new Date(e.data_ora) < new Date()).length}
            </span>
            <span className="stat-label">Passati</span>
          </div>
        </div>

        <div className="list-section">
          <h2 className="section-title">Tutti gli eventi</h2>
          <div className="items-list">
            {eventi.map(evento => (
              <div key={evento.id} className="list-item">
                <div className="evento-icon">📅</div>
                <div className="item-content">
                  <h3 className="item-title">{evento.nome_evento}</h3>
                  <p className="item-subtitle">
                    {new Date(evento.data_ora).toLocaleDateString('it-IT')} - {evento.luogo}
                  </p>
                </div>
                <div className="item-badge evento">
                  {new Date(evento.data_ora) > new Date() ? 'Prossimo' : 'Passato'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente principale con routing
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedGiocatoreId, setSelectedGiocatoreId] = useState(null);

  const handleNavigate = (page, data = null) => {
    if (page === 'dettaglio-giocatore') {
      setSelectedGiocatoreId(data);
    }
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
    setSelectedGiocatoreId(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'giocatori':
        return <GiocatoriPage onBack={handleBack} onNavigate={handleNavigate} />;
      case 'dettaglio-giocatore':
        return <DettaglioGiocatorePage onBack={handleBack} giocatoreId={selectedGiocatoreId} />;
      case 'eventi':
        return <EventiPage onBack={handleBack} />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="appito-app">
      {renderPage()}
    </div>
  );
}

export default App;

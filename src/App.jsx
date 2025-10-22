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

// Componente Dettaglio Giocatore
function DettaglioGiocatorePage({ onBack, giocatoreId }) {
  const [giocatore, setGiocatore] = useState(null);

  useEffect(() => {
    fetchGiocatore();
  }, [giocatoreId]);

  const fetchGiocatore = async () => {
    const { data } = await supabase
      .from('profili_utenti')
      .select('*')
      .eq('id', giocatoreId)
      .single();
    
    if (data) setGiocatore(data);
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
                  <p className="item-subtitle">{giocatore.email}</p>
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

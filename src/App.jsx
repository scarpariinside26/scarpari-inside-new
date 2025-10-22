import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

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

      {/* NAVIGAZIONE INFERIORE (opzionale) */}
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

// Componente Giocatori - Stile Appito
function GiocatoriPage({ onBack }) {
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
              <div key={giocatore.id} className="list-item">
                <div 
                  className="item-avatar"
                  style={{ 
                    backgroundColor: getColorFromName(giocatore.nome_completo)
                  }}
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

// Helper function per colori avatar
function getColorFromName(name) {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#475569'];
  const index = name.length % colors.length;
  return colors[index];
}

// [ALTRI COMPONENTI PAGINE...]

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'giocatori':
        return <GiocatoriPage onBack={() => setCurrentPage('home')} />;
      case 'eventi':
        return <EventiPage onBack={() => setCurrentPage('home')} />;
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

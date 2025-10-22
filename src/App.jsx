import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Helper function per colori avatar
function getColorFromName(name) {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#475569'];
  const index = name.length % colors.length;
  return colors[index];
}

// Dataset Province del Veneto (solo Padova e Venezia)
const provinceVeneto = [
  { sigla: "PD", nome: "Padova", regione: "Veneto" },
  { sigla: "VE", nome: "Venezia", regione: "Veneto" }
];

// Dataset Comuni del Veneto (solo Padova e Venezia COMPLETI)
const comuniVeneto = {
  "PD": [
    "Abano Terme", "Agna", "Albignasego", "Anguillara Veneta", "Arquà Petrarca", "Arre", "Arzergrande", 
    "Bagnoli di Sopra", "Baone", "Barbona", "Battaglia Terme", "Boara Pisani", "Borgoricco", "Bovolenta", 
    "Brugine", "Cadoneghe", "Campodarsego", "Campodoro", "Camposampiero", "Campo San Martino", "Candiana", 
    "Carceri", "Carmignano di Brenta", "Cartura", "Casale di Scodosia", "Casalserugo", "Castelbaldo", 
    "Cervarese Santa Croce", "Cinto Euganeo", "Cittadella", "Codevigo", "Conselve", "Correzzola", 
    "Curtarolo", "Due Carrare", "Este", "Fontaniva", "Galliera Veneta", "Galzignano Terme", "Gazzo", 
    "Grantorto", "Granze", "Legnaro", "Limena", "Loreggia", "Lozzo Atestino", "Maserà di Padova", 
    "Masi", "Massanzago", "Megliadino San Fidenzio", "Megliadino San Vitale", "Merlara", "Mestrino", 
    "Monselice", "Montagnana", "Montegrotto Terme", "Noventa Padovana", "Ospedaletto Euganeo", "Padova", 
    "Pernumia", "Piacenza d'Adige", "Piazzola sul Brenta", "Piombino Dese", "Piove di Sacco", "Polverara", 
    "Ponso", "Ponte San Nicolò", "Pontelongo", "Pozzonovo", "Rovolon", "Rubano", "Saccolongo", 
    "Saletto", "San Giorgio delle Pertiche", "San Giorgio in Bosco", "San Martino di Lupari", 
    "San Pietro in Gu", "San Pietro Viminario", "Santa Giustina in Colle", "Santa Margherita d'Adige", 
    "Sant'Angelo di Piove di Sacco", "Sant'Elena", "Sant'Urbano", "Saonara", "Selvazzano Dentro", 
    "Solesino", "Stanghella", "Teolo", "Terrassa Padovana", "Tombolo", "Torreglia", "Trebaseleghe", 
    "Tribano", "Urbana", "Veggiano", "Vescovana", "Vighizzolo d'Este", "Vigodarzere", "Vigonza", 
    "Villa del Conte", "Villa Estense", "Villafranca Padovana", "Villanova di Camposampiero", "Vo"
  ],
  
  "VE": [
    "Annone Veneto", "Campagna Lupia", "Campolongo Maggiore", "Camponogara", "Caorle", "Cavallino-Treporti", 
    "Cavarzere", "Ceggia", "Chioggia", "Cinto Caomaggiore", "Cona", "Concordia Sagittaria", "Dolo", 
    "Eraclea", "Fiesso d'Artico", "Fossalta di Piave", "Fossalta di Portogruaro", "Fossò", "Gruaro", 
    "Jesolo", "Marcon", "Martellago", "Meolo", "Mira", "Mirano", "Musile di Piave", "Noale", "Noventa di Piave", 
    "Pianiga", "Portogruaro", "Pramaggiore", "Quarto d'Altino", "Salzano", "San Donà di Piave", 
    "San Michele al Tagliamento", "San Stino di Livenza", "Santa Maria di Sala", "Scorzè", "Spinea", 
    "Stra", "Teglio Veneto", "Torre di Mosto", "Venezia", "Vigonovo"
  ]
};

// Componente Homepage - Stile Appito
function HomePage({ onNavigate }) {
  const menuItems = [
    { id: 'eventi', icon: '📅', title: 'Eventi', subtitle: 'Crea e gestisci eventi', color: '#2563eb' },
    { id: 'giocatori', icon: '👥', title: 'Giocatori', subtitle: 'Gestisci la squadra', color: '#dc2626' },
    { id: 'classifica', icon: '🏆', title: 'Classifica', subtitle: 'Statistiche e ranking', color: '#ea580c' },
    { id: 'feed', icon: '💬', title: 'Feed', subtitle: 'News e aggiornamenti', color: '#16a34a' },
    { id: 'statistiche', icon: '📊', title: 'Statistiche', subtitle: 'Analisi performance', color: '#7c3aed' },
    { id: 'impostazioni', icon: '⚙️', title: 'Impostazioni', subtitle: 'Preferenze sistema', color: '#475569' }
  ];

  return (
    <div className="appito-home">
      <header className="appito-header">
        <div className="header-content">
          <h1 className="app-name">Scarpari</h1>
          <div className="user-avatar">SI</div>
        </div>
      </header>

      <main className="appito-main">
        <div className="grid-menu">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-card" onClick={() => onNavigate(item.id)}>
              <div className="card-icon" style={{ backgroundColor: item.color }}>{item.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-subtitle">{item.subtitle}</p>
              </div>
              <div className="card-arrow">›</div>
            </div>
          ))}
        </div>
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active"><span>🏠</span><span>Home</span></button>
        <button className="nav-item"><span>📅</span><span>Eventi</span></button>
        <button className="nav-item"><span>👥</span><span>Giocatori</span></button>
        <button className="nav-item"><span>👤</span><span>Profilo</span></button>
      </nav>
    </div>
  );
}

function DettaglioGiocatorePage({ onBack, giocatoreId }) {
  const [giocatore, setGiocatore] = useState(null);
  const [modificaPosizione, setModificaPosizione] = useState(false);
  const [provinciaSelezionata, setProvinciaSelezionata] = useState('');
  const [comuneSelezionato, setComuneSelezionato] = useState('');
  const [ricercaComune, setRicercaComune] = useState('');
  const [dropdownAperto, setDropdownAperto] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside per chiudere il dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAperto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtra comuni in base alla provincia e ricerca
  const comuniFiltrati = provinciaSelezionata 
    ? comuniVeneto[provinciaSelezionata].filter(comune =>
        comune.toLowerCase().includes(ricercaComune.toLowerCase())
      ).slice(0, 10)
    : [];

  const selezionaComune = (comune) => {
    setComuneSelezionato(comune);
    setDropdownAperto(false);
    setRicercaComune('');
  };

  // Nel JSX - modifica la parte del dropdown comuni:
  {provinciaSelezionata && (
    <div className="input-group">
      <label>Comune</label>
      <input
        type="text"
        value={ricercaComune}
        onChange={(e) => {
          setRicercaComune(e.target.value);
          setDropdownAperto(true);
        }}
        onFocus={() => setDropdownAperto(true)}
        placeholder="Cerca comune..."
        className="input-ricerca-comune"
      />
      
      {dropdownAperto && comuniFiltrati.length > 0 && (
        <div className="dropdown-comuni" ref={dropdownRef}>
          {comuniFiltrati.map(comune => (
            <div
              key={comune}
              className={`dropdown-item ${comune === comuneSelezionato ? 'selected' : ''}`}
              onClick={() => selezionaComune(comune)}
            >
              {comune}
            </div>
          ))}
        </div>
      )}
      
      {comuneSelezionato && (
        <div className="comune-selezionato">
          Selezionato: <strong>{comuneSelezionato}</strong>
        </div>
      )}
    </div>
  )}
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
          <div className="stat-card"><span className="stat-number">{giocatori.length}</span><span className="stat-label">Totali</span></div>
          <div className="stat-card"><span className="stat-number">{giocatori.filter(g => g.livello_gioco === 'avanzato').length}</span><span className="stat-label">Avanzati</span></div>
          <div className="stat-card"><span className="stat-number">{giocatori.filter(g => g.livello_gioco === 'intermedio').length}</span><span className="stat-label">Intermedi</span></div>
        </div>

        <div className="list-section">
          <h2 className="section-title">Tutti i giocatori</h2>
          <div className="items-list">
            {giocatori.map(giocatore => (
              <div key={giocatore.id} className="list-item" onClick={() => onNavigate('dettaglio-giocatore', giocatore.id)}>
                <div className="item-avatar" style={{ backgroundColor: getColorFromName(giocatore.nome_completo) }}>
                  {giocatore.nome_completo.charAt(0)}
                </div>
                <div className="item-content">
                  <h3 className="item-title">{giocatore.nome_completo}</h3>
                  <p className="item-subtitle">
                    {giocatore.email} 
                    {giocatore.comune && ` • ${giocatore.comune} (${giocatore.provincia})`}
                  </p>
                </div>
                <div className="item-badge">{giocatore.livello_gioco}</div>
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
          <div className="stat-card"><span className="stat-number">{eventi.length}</span><span className="stat-label">Totali</span></div>
          <div className="stat-card"><span className="stat-number">{eventi.filter(e => new Date(e.data_ora) > new Date()).length}</span><span className="stat-label">Futuri</span></div>
          <div className="stat-card"><span className="stat-number">{eventi.filter(e => new Date(e.data_ora) < new Date()).length}</span><span className="stat-label">Passati</span></div>
        </div>

        <div className="list-section">
          <h2 className="section-title">Tutti gli eventi</h2>
          <div className="items-list">
            {eventi.map(evento => (
              <div key={evento.id} className="list-item">
                <div className="evento-icon">📅</div>
                <div className="item-content">
                  <h3 className="item-title">{evento.nome_evento}</h3>
                  <p className="item-subtitle">{new Date(evento.data_ora).toLocaleDateString('it-IT')} - {evento.luogo}</p>
                </div>
                <div className="item-badge evento">{new Date(evento.data_ora) > new Date() ? 'Prossimo' : 'Passato'}</div>
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
      case 'giocatori': return <GiocatoriPage onBack={handleBack} onNavigate={handleNavigate} />;
      case 'dettaglio-giocatore': return <DettaglioGiocatorePage onBack={handleBack} giocatoreId={selectedGiocatoreId} />;
      case 'eventi': return <EventiPage onBack={handleBack} />;
      case 'home': default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <div className="appito-app">{renderPage()}</div>;
}

export default App;

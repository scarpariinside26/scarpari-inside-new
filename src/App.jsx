import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [prossimoEvento, setProssimoEvento] = useState(null);
  const [giocatori, setGiocatori] = useState([]);
  const [posts, setPosts] = useState([]);
  const [nuovoPost, setNuovoPost] = useState('');

  // Fetch prossimo evento
  useEffect(() => {
    fetchProssimoEvento();
    fetchGiocatori();
    fetchPosts();
  }, []);

  const fetchProssimoEvento = async () => {
    const { data } = await supabase
      .from('eventi')
      .select('*')
      .gte('data_ora', new Date().toISOString())
      .order('data_ora', { ascending: true })
      .limit(1);
    
    if (data && data.length > 0) {
      setProssimoEvento(data[0]);
    }
  };

  const fetchGiocatori = async () => {
    const { data } = await supabase
      .from('profili_utenti')
      .select('*')
      .order('nome_completo', { ascending: true });
    
    if (data) setGiocatori(data);
  };

  const fetchPosts = async () => {
    // Simulazione posts
    setPosts([
      {
        id: 1,
        autore: 'Admin',
        contenuto: 'Nuovo torneo in arrivo! Preparatevi! 🏆',
        timestamp: new Date(),
        likes: 12,
        commenti: 3
      },
      {
        id: 2, 
        autore: 'Coach',
        contenuto: 'Ottima sessione di allenamento oggi! 💪',
        timestamp: new Date(Date.now() - 3600000),
        likes: 8,
        commenti: 1
      }
    ]);
  };

  const creaPost = () => {
    if (nuovoPost.trim()) {
      const post = {
        id: posts.length + 1,
        autore: 'Tu',
        contenuto: nuovoPost,
        timestamp: new Date(),
        likes: 0,
        commenti: 0
      };
      setPosts([post, ...posts]);
      setNuovoPost('');
    }
  };

  return (
    <div className="app">
      {/* HEADER CON GLASS EFFECT */}
      <header className="dashboard-header">
        <div className="logo-container">
          <img 
            src="/Scarpari Inside simplelogo_2023.png" 
            alt="Scarpari Inside" 
            className="main-logo"
          />
        </div>
      </header>

      <main className="dashboard-main">
        {/* SEZIONE PROSSIMO EVENTO */}
        <section className="sezione">
          <h2>🎯 Prossimo Evento</h2>
          <div className="card glass">
            {prossimoEvento ? (
              <div className="evento-card">
                <h3>{prossimoEvento.nome_evento}</h3>
                <p>📅 {new Date(prossimoEvento.data_ora).toLocaleDateString('it-IT')}</p>
                <p>⏰ {new Date(prossimoEvento.data_ora).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>📍 {prossimoEvento.luogo}</p>
                <button className="btn-primario">Partecipa</button>
              </div>
            ) : (
              <p>Nessun evento in programma</p>
            )}
          </div>
        </section>

        {/* SEZIONE FEED SOCIAL */}
        <section className="sezione">
          <h2>💬 Feed</h2>
          
          {/* CREA POST */}
          <div className="card glass crea-post">
            <textarea 
              value={nuovoPost}
              onChange={(e) => setNuovoPost(e.target.value)}
              placeholder="Condividi qualcosa con la squadra..."
              rows="3"
            />
            <button onClick={creaPost} className="btn-primario">Pubblica</button>
          </div>

          {/* LISTA POSTS */}
          {posts.map(post => (
            <div key={post.id} className="card glass post">
              <div className="post-header">
                <strong>{post.autore}</strong>
                <span className="timestamp">
                  {new Date(post.timestamp).toLocaleTimeString('it-IT')}
                </span>
              </div>
              <p className="post-contenuto">{post.contenuto}</p>
              <div className="post-azioni">
                <button>👍 {post.likes}</button>
                <button>💬 {post.commenti}</button>
                <button>↗️ Condividi</button>
              </div>
            </div>
          ))}
        </section>

        {/* SEZIONE GIOCATORI */}
        <section className="sezione">
          <h2>👥 Giocatori ({giocatori.length})</h2>
          <div className="card glass">
            <div className="giocatori-grid">
              {giocatori.slice(0, 6).map(giocatore => (
                <div key={giocatore.id} className="giocatore-card">
                  <div className="avatar">{giocatore.nome_completo.charAt(0)}</div>
                  <div className="giocatore-info">
                    <strong>{giocatore.nome_completo}</strong>
                    <span className="livello">{giocatore.livello_gioco}</span>
                  </div>
                </div>
              ))}
            </div>
            {giocatori.length > 6 && (
              <button className="btn-secondario">Vedi tutti ({giocatori.length})</button>
            )}
          </div>
        </section>

        {/* SEZIONE CLASSIFICA */}
        <section className="sezione">
          <h2>🏆 Classifica</h2>
          <div className="card glass">
            <p>Classifica in arrivo...</p>
          </div>
        </section>

        {/* MENU RAPIDO */}
        <section className="sezione">
          <h2>⚡ Menu Rapido</h2>
          <div className="grid-menu">
            <button className="card glass menu-btn">
              📅 Crea Evento
            </button>
            <button className="card glass menu-btn">
              👥 Gestisci Giocatori
            </button>
            <button className="card glass menu-btn">
              ⚙️ Impostazioni
            </button>
            <button className="card glass menu-btn">
              📊 Statistiche
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

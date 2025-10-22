// pages/profilo.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Profilo() {
  const [ruoli, setRuoli] = useState({
    portiere: false,
    difensore: false,
    centrocampista: false,
    attaccante: false
  });
  const [messaggio, setMessaggio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // ID giocatore - PER ORA HARDCODATO, POI CON AUTH
  const giocatoreId = 1;

  // Carica i ruoli dal database
  const caricaRuoli = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ruoli?giocatore_id=${giocatoreId}`);
      
      if (response.ok) {
        const datiRuoli = await response.json();
        setRuoli({
          portiere: datiRuoli.portiere || false,
          difensore: datiRuoli.difensore || false,
          centrocampista: datiRuoli.centrocampista || false,
          attaccante: datiRuoli.attaccante || false
        });
      } else {
        console.error('Errore nel caricamento ruoli');
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salva i ruoli nel database
  const salvaRuoli = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ruoli/${giocatoreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruoli),
      });

      if (response.ok) {
        setMessaggio('✅ Ruoli aggiornati con successo!');
        setTimeout(() => setMessaggio(''), 3000);
      } else {
        setMessaggio('❌ Errore nel salvataggio');
      }
    } catch (error) {
      console.error('Errore:', error);
      setMessaggio('❌ Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  // Gestisce il cambio di stato dei checkbox
  const handleRuoloChange = (ruolo) => {
    setRuoli(prev => ({
      ...prev,
      [ruolo]: !prev[ruolo]
    }));
  };

  // Carica i ruoli all'avvio
  useEffect(() => {
    caricaRuoli();
  }, []);

  return (
    <>
      <Head>
        <title>Scarpari Inside - Il Mio Profilo</title>
        <meta name="description" content="Gestisci i tuoi ruoli di gioco" />
      </Head>

      <div className="container">
        {/* Header */}
        <header className="header">
          <nav className="nav">
            <Link href="/">
              <a className="logo">Scarpari Inside</a>
            </Link>
            <div className="nav-links">
              <Link href="/">
                <a>Home</a>
              </Link>
              <Link href="/classifica">
                <a>Classifica</a>
              </Link>
              <Link href="/profilo">
                <a className="active">Profilo</a>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="page-header">
            <h1>Il Mio Profilo</h1>
            <p>Gestisci le tue preferenze di gioco</p>
          </div>

          {/* Sezione Ruoli */}
          <div className="ruoli-container">
            <div className="ruoli-header">
              <h2>🔄 I Miei Ruoli Preferiti</h2>
              <p>Seleziona i ruoli in cui ti senti a tuo agio durante le partite</p>
            </div>

            {isLoading ? (
              <div className="loading">Caricamento ruoli...</div>
            ) : (
              <>
                <div className="ruoli-grid">
                  {/* Portiere */}
                  <div className="ruolo-item">
                    <input 
                      type="checkbox" 
                      id="portiere" 
                      className="ruolo-checkbox"
                      checked={ruoli.portiere}
                      onChange={() => handleRuoloChange('portiere')}
                    />
                    <label htmlFor="portiere" className="ruolo-label">
                      <span className="ruolo-emoji">🧤</span>
                      <span className="ruolo-text">Portiere</span>
                    </label>
                  </div>

                  {/* Difensore */}
                  <div className="ruolo-item">
                    <input 
                      type="checkbox" 
                      id="difensore" 
                      className="ruolo-checkbox"
                      checked={ruoli.difensore}
                      onChange={() => handleRuoloChange('difensore')}
                    />
                    <label htmlFor="difensore" className="ruolo-label">
                      <span className="ruolo-emoji">🛡️</span>
                      <span className="ruolo-text">Difensore</span>
                    </label>
                  </div>

                  {/* Centrocampista */}
                  <div className="ruolo-item">
                    <input 
                      type="checkbox" 
                      id="centrocampista" 
                      className="ruolo-checkbox"
                      checked={ruoli.centrocampista}
                      onChange={() => handleRuoloChange('centrocampista')}
                    />
                    <label htmlFor="centrocampista" className="ruolo-label">
                      <span className="ruolo-emoji">⚙️</span>
                      <span className="ruolo-text">Centrocampista</span>
                    </label>
                  </div>

                  {/* Attaccante */}
                  <div className="ruolo-item">
                    <input 
                      type="checkbox" 
                      id="attaccante" 
                      className="ruolo-checkbox"
                      checked={ruoli.attaccante}
                      onChange={() => handleRuoloChange('attaccante')}
                    />
                    <label htmlFor="attaccante" className="ruolo-label">
                      <span className="ruolo-emoji">⚽</span>
                      <span className="ruolo-text">Attaccante</span>
                    </label>
                  </div>
                </div>

                {/* Info */}
                <div className="ruoli-info">
                  <p>
                    <strong>Suggerimento:</strong> Seleziona tutti i ruoli in cui ti senti 
                    comfortable per facilitare la creazione di squadre bilanciate!
                  </p>
                </div>

                {/* Pulsante Salva */}
                <div className="ruoli-actions">
                  <button 
                    onClick={salvaRuoli}
                    disabled={isLoading}
                    className="btn-salva"
                  >
                    {isLoading ? '⏳ Salvataggio...' : '💾 Salva Modifiche'}
                  </button>
                  
                  {messaggio && (
                    <div className={`messaggio ${messaggio.includes('✅') ? 'success' : 'error'}`}>
                      {messaggio}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sezione Statistiche (Futuro) */}
          <div className="stats-container">
            <h3>📊 Le Mie Statistiche (Prossimamente)</h3>
            <div className="stats-placeholder">
              <p>Qui vedrai le tue statistiche di gioco, presenze e valutazioni!</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>Scarpari Inside © 2024 - Tutti i retroscena del calcio</p>
        </footer>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #f8f9fa;
        }

        /* Header */
        .header {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #e63946;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: #e63946;
        }

        /* Main Content */
        .main-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 2.5rem;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
        }

        /* Ruoli Container */
        .ruoli-container {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .ruoli-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .ruoli-header h2 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        .ruoli-header p {
          color: #666;
        }

        /* Ruoli Grid */
        .ruoli-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .ruolo-item {
          position: relative;
        }

        .ruolo-checkbox {
          display: none;
        }

        .ruolo-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          border: 3px solid #e9ecef;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
          min-height: 120px;
        }

        .ruolo-checkbox:checked + .ruolo-label {
          border-color: #4CAF50;
          background: #f0fff0;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
        }

        .ruolo-emoji {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .ruolo-text {
          font-weight: 600;
          color: #333;
          font-size: 1.1rem;
        }

        /* Info e Actions */
        .ruoli-info {
          background: #e7f3ff;
          padding: 1rem;
          border-radius: 8px;
          margin: 1.5rem 0;
          border-left: 4px solid #2196F3;
        }

        .ruoli-info p {
          margin: 0;
          color: #1565c0;
        }

        .ruoli-actions {
          text-align: center;
        }

        .btn-salva {
          background: #4CAF50;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .btn-salva:hover:not(:disabled) {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        }

        .btn-salva:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
        }

        /* Messaggi */
        .messaggio {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 500;
        }

        .messaggio.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .messaggio.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
          font-style: italic;
        }

        /* Stats Section */
        .stats-container {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .stats-container h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .stats-placeholder {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          color: #666;
          border: 2px dashed #dee2e6;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 2rem;
          color: #666;
          border-top: 1px solid #e9ecef;
          margin-top: 3rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }

          .ruoli-grid {
            grid-template-columns: 1fr;
          }

          .nav {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-links {
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}

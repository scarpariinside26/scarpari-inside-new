import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Eventi.css';

function Eventi() {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('lista'); // 'lista' o 'crea'

  useEffect(() => {
    caricaEventi();
  }, []);

  const caricaEventi = async () => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .select('*')
        .order('data_ora_evento', { ascending: true });
      
      if (error) throw error;
      setEventi(data || []);
    } catch (error) {
      console.error('Errore caricamento eventi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Componente temporaneo per creare eventi
  const CreaEvento = () => (
    <div className="crea-evento-semplice">
      <h2>Crea Nuovo Evento</h2>
      <p>Form avanzato per creare eventi sportivi e community</p>
      <button onClick={() => setView('lista')} className="btn-secondary">
        ← Torna alla Lista
      </button>
    </div>
  );

  if (loading) {
    return <div className="loading">Caricamento eventi...</div>;
  }

  return (
    <div className="eventi-container">
      <header className="eventi-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        <h1>🗓️ Gestione Eventi</h1>
        {view === 'lista' && (
          <button 
            className="btn-primary" 
            onClick={() => setView('crea')}
          >
            + Crea Evento
          </button>
        )}
      </header>

      <main className="eventi-main">
        {view === 'lista' && (
          <div className="lista-eventi">
            <h2>Lista Eventi</h2>
            {eventi.length === 0 ? (
              <div className="nessun-evento">
                <p>Nessun evento trovato</p>
                <button 
                  className="btn-primary"
                  onClick={() => setView('crea')}
                >
                  Crea il primo evento
                </button>
              </div>
            ) : (
              <div className="eventi-grid">
                {eventi.map(evento => (
                  <div key={evento.id} className="evento-card">
                    <h3>{evento.titolo || evento.home_evento}</h3>
                    <p>📅 {new Date(evento.data_ora_evento).toLocaleDateString()}</p>
                    <p>📍 {evento.luogo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'crea' && <CreaEvento />}
      </main>
    </div>
  );
}

export default Eventi;

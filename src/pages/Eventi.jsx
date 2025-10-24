import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Eventi.css';

function Eventi() {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreaEvento, setShowCreaEvento] = useState(false);

  useEffect(() => {
    caricaEventi();
  }, []);

  const caricaEventi = async () => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .select('*')
        .order('data_ora', { ascending: true });
      
      if (error) throw error;
      setEventi(data || []);
    } catch (error) {
      console.error('Errore caricamento eventi:', error);
    } finally {
      setLoading(false);
    }
  };

  const formattaData = (dataOra) => {
    return new Date(dataOra).toLocaleString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Caricamento eventi...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        <h1>🗓️ Gestione Eventi</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowCreaEvento(!showCreaEvento)}
        >
          + Crea Nuovo Evento
        </button>
      </header>

      {/* Form Crea Evento */}
      {showCreaEvento && (
        <div className="crea-evento-form">
          <h3>Crea Nuovo Evento</h3>
          <form>
            <input type="text" placeholder="Nome evento" />
            <input type="datetime-local" placeholder="Data e ora" />
            <input type="text" placeholder="Luogo" />
            <input type="number" placeholder="Max partecipanti" />
            <button type="submit">Crea Evento</button>
          </form>
        </div>
      )}

      {/* Lista Eventi */}
      <div className="eventi-grid">
        {eventi.length === 0 ? (
          <div className="nessun-evento">
            <p>Nessun evento programmato</p>
            <button className="btn-primary">Crea il primo evento!</button>
          </div>
        ) : (
          eventi.map(evento => (
            <div key={evento.id} className="evento-card">
              <div className="evento-header">
                <h3>{evento.home_evento}</h3>
                <span className={`stato ${evento.stato}`}>{evento.stato}</span>
              </div>
              
              <div className="evento-info">
                <p>📅 {formattaData(evento.data_ora)}</p>
                <p>📍 {evento.luogo}</p>
                <p>👥 Max {evento.max_partecipanti} partecipanti</p>
              </div>

              <div className="evento-actions">
                <button className="btn-secondary">Iscriviti</button>
                <button className="btn-outline">Dettagli</button>
                <button className="btn-outline">Modifica</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Eventi;

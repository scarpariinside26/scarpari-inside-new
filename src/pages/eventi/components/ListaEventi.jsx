import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function ListaEventi({ onEventoCliccato }) {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    caricaEventi();
  }, []);

  const caricaEventi = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🎯 Caricamento eventi da Supabase...');
      
      const { data, error } = await supabase
        .from('eventi')
        .select('*')
        .order('data_ora', { ascending: true });

      if (error) {
        console.error('❌ Errore Supabase:', error);
        throw error;
      }

      console.log('✅ Eventi caricati:', data);
      setEventi(data || []);

    } catch (error) {
      console.error('❌ Errore caricamento eventi:', error);
      setError(`Errore nel caricamento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formattaData = (dataOra) => {
    return new Date(dataOra).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatoBadge = (evento) => {
    const now = new Date();
    const dataEvento = new Date(evento.data_ora);
    
    if (evento.stato === 'cancellato') return '❌ Cancellato';
    if (dataEvento < now) return '✅ Completato';
    return '🟢 Attivo';
  };

  if (loading) {
    return (
      <div className="loading">
        <h3>🔄 Caricamento eventi...</h3>
        <p>Sto recuperando gli eventi dal database</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>❌ Errore</h3>
        <p>{error}</p>
        <button onClick={caricaEventi} className="btn-primary">
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="lista-eventi-container">
      <div className="lista-eventi-header">
        <h2>📋 Lista Eventi</h2>
        <p>Gestisci tutti gli eventi creati</p>
        
        <div className="controlli-rapidi">
          <button onClick={caricaEventi} className="btn-secondary">
            🔄 Aggiorna
          </button>
          <span className="stat">
            {eventi.length} eventi totali
          </span>
        </div>
      </div>

      <div className="eventi-grid">
        {eventi.length === 0 ? (
          <div className="empty-state">
            <h3>📭 Nessun evento trovato</h3>
            <p>Non sono stati creati eventi ancora</p>
            <p className="debug-info">
              Controlla la console per dettagli tecnici
            </p>
          </div>
        ) : (
          eventi.map(evento => (
            <div 
              key={evento.id} 
              className="evento-card"
              onClick={() => onEventoCliccato(evento)}
            >
              <div className="evento-header">
                <h3>{evento.nome_evento}</h3>
                <span className={`stato ${evento.stato}`}>
                  {getStatoBadge(evento)}
                </span>
              </div>
              
              <div className="evento-info">
                <p>📅 {formattaData(evento.data_ora)}</p>
                <p>📍 {evento.luogo}</p>
                <p>👥 Max {evento.max_partecipanti} partecipanti</p>
                {evento.descrizione && (
                  <p className="descrizione">📝 {evento.descrizione}</p>
                )}
              </div>

              <div className="evento-footer">
                <span className="tipo-evento">
                  {evento.tipo_evento === 'sportivo' ? '⚽' : '🎉'} 
                  {evento.tipo_evento}
                </span>
                <span className="visibilita">
                  {evento.visibilita === 'privato' ? '🔒 Privato' : '🌍 Pubblico'}
                </span>
              </div>

              {/* DEBUG INFO - Rimuovi dopo il test */}
              <div className="debug-info" style={{fontSize: '0.7rem', opacity: 0.6, marginTop: '0.5rem'}}>
                ID: {evento.id} | Creato: {new Date(evento.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListaEventi;

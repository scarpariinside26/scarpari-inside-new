import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';  // ✅ CORRETTO

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
      
      console.log('🔍 [DEBUG] Inizio caricamento eventi...');
      console.log('🔍 [DEBUG] Supabase client:', supabase);

      // TEST 1: Verifica la connessione
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log('🔍 [DEBUG] Auth session:', authData, authError);

      // TEST 2: Prova a contare gli eventi
      const { count, error: countError } = await supabase
        .from('eventi')
        .select('*', { count: 'exact', head: true });
      
      console.log('🔍 [DEBUG] Conteggio eventi:', count, countError);

      // TEST 3: Carica gli eventi con più dettagli
      const { data, error } = await supabase
        .from('eventi')
        .select('*')
        .order('data_ora', { ascending: true });

      console.log('🔍 [DEBUG] Risultato query completa:', { data, error });
      console.log('🔍 [DEBUG] Tipo di data:', typeof data);
      console.log('🔍 [DEBUG] È array?', Array.isArray(data));

      if (error) {
        console.error('❌ [DEBUG] Errore Supabase:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ [DEBUG] Data è null/undefined');
        setEventi([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [DEBUG] Data non è un array:', data);
        setEventi([]);
        return;
      }

      console.log('✅ [DEBUG] Eventi caricati con successo:', data.length);
      setEventi(data);

    } catch (error) {
      console.error('❌ [DEBUG] Errore nel caricamento:', error);
      setError(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // RICARICA MANUALE
  const forzaRicarica = async () => {
    console.log('🔄 [DEBUG] Forzando ricarica...');
    await caricaEventi();
  };

  if (loading) {
    return (
      <div className="loading">
        <h3>🔄 Caricamento eventi...</h3>
        <p>Controlla la console del browser (F12) per i dettagli</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>❌ Errore</h3>
        <p>{error}</p>
        <button onClick={forzaRicarica} className="btn-primary">
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="lista-eventi-container">
      <div className="lista-eventi-header">
        <h2>📋 Lista Eventi</h2>
        <p>Eventi trovati: <strong>{eventi.length}</strong></p>
        
        <div className="controlli-rapidi">
          <button onClick={forzaRicarica} className="btn-secondary">
            🔄 Ricarica Manuale
          </button>
          <button onClick={() => console.log('Eventi attuali:', eventi)} className="btn-secondary">
            📊 Debug Console
          </button>
        </div>
      </div>

      <div className="eventi-grid">
        {eventi.length === 0 ? (
          <div className="empty-state">
            <h3>📭 Nessun evento nel database</h3>
            <p>Il database non contiene eventi oppure c'è un problema di connessione</p>
            <div className="debug-actions">
              <button onClick={forzaRicarica} className="btn-primary">
                🔄 Ricarica
              </button>
              <button onClick={() => window.open('https://supabase.com/dashboard/project/_/editor', '_blank')} className="btn-secondary">
                🔍 Vai a Supabase
              </button>
            </div>
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
                <span className="stato attivo">
                  🟢 Attivo
                </span>
              </div>
              
              <div className="evento-info">
                <p>📅 {new Date(evento.data_ora).toLocaleDateString('it-IT')}</p>
                <p>📍 {evento.luogo}</p>
                <p>👥 Max {evento.max_partecipanti} partecipanti</p>
                {evento.descrizione && (
                  <p className="descrizione">📝 {evento.descrizione}</p>
                )}
              </div>

              <div className="evento-footer">
                <span className="tipo-evento">
                  {evento.tipo_evento === 'sportivo' ? '⚽ Sportivo' : '🎉 Sociale'}
                </span>
                <span className="visibilita">
                  {evento.visibilita === 'privato' ? '🔒 Privato' : '🌍 Pubblico'}
                </span>
              </div>

              {/* DEBUG INFO */}
              <div style={{fontSize: '0.7rem', opacity: 0.6, marginTop: '0.5rem', borderTop: '1px dashed #666', paddingTop: '0.5rem'}}>
                ID: {evento.id}<br/>
                Data DB: {evento.data_ora}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListaEventi;

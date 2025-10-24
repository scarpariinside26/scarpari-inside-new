import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Eventi.css';

// Import componenti
import CreaEvento from './components/CreaEvento';
import ListaEventi from './components/ListaEventi';
import DettaglioEvento from './components/DettaglioEvento';

function Eventi() {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('lista'); // 'lista', 'dettaglio', 'crea'
  const [eventoSelezionato, setEventoSelezionato] = useState(null);
  const { eventoId } = useParams(); // Per URL diretti /eventi/:id

  useEffect(() => {
    caricaEventi();
    
    // Se c'è un ID nell'URL, carica direttamente quel evento
    if (eventoId) {
      caricaEventoDettaglio(eventoId);
    }
  }, [eventoId]);

  const caricaEventi = async () => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .select(`
          *,
          organizzatore:nome,
          iscrizioni_eventi(stato),
          file_eventi(count)
        `)
        .order('data_ora_evento', { ascending: true });
      
      if (error) throw error;
      setEventi(data || []);
    } catch (error) {
      console.error('Errore caricamento eventi:', error);
    } finally {
      setLoading(false);
    }
  };

  const caricaEventoDettaglio = async (id) => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .select(`
          *,
          organizzatore:nome,
          iscrizioni_eventi(*),
          file_eventi(*),
          sondaggi_eventi(*),
          chat_evento(*),
          squadre_eventi(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setEventoSelezionato(data);
      setView('dettaglio');
    } catch (error) {
      console.error('Errore caricamento dettaglio:', error);
    }
  };

  const handleCreaEvento = () => {
    setView('crea');
    setEventoSelezionato(null);
  };

  const handleTornaLista = () => {
    setView('lista');
    setEventoSelezionato(null);
    caricaEventi(); // Ricarica lista
  };

  const handleEventoCliccato = (evento) => {
    setEventoSelezionato(evento);
    setView('dettaglio');
  };

  if (loading) {
    return (
      <div className="eventi-container">
        <div className="loading">Caricamento eventi...</div>
      </div>
    );
  }

  return (
    <div className="eventi-container">
      {/* HEADER */}
      <header className="eventi-header">
        <Link to="/" className="back-btn">← Torna alla Home</Link>
        
        <div className="header-actions">
          <h1>🗓️ Gestione Eventi</h1>
          {view === 'lista' && (
            <button className="btn-primary" onClick={handleCreaEvento}>
              + Crea Nuovo Evento
            </button>
          )}
          {view !== 'lista' && (
            <button className="btn-secondary" onClick={handleTornaLista}>
              ← Torna alla Lista
            </button>
          )}
        </div>
      </header>

      {/* CONTENUTO PRINCIPALE */}
      <main className="eventi-main">
        {view === 'lista' && (
          <ListaEventi 
            eventi={eventi}
            onEventoCliccato={handleEventoCliccato}
          />
        )}

        {view === 'crea' && (
          <CreaEvento 
            onSuccess={handleTornaLista}
            onCancel={handleTornaLista}
          />
        )}

        {view === 'dettaglio' && eventoSelezionato && (
          <DettaglioEvento 
            evento={eventoSelezionato}
            onBack={handleTornaLista}
            onUpdate={caricaEventi}
          />
        )}
      </main>
    </div>
  );
}

export default Eventi;

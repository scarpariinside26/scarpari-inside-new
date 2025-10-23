import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './GeneratoreSquadre.css';

export default function GeneratoreSquadre({ onBack }) {
  const [giocatori, setGiocatori] = useState([]);
  const [squadre, setSquadre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numeroSquadre, setNumeroSquadre] = useState(2);
  const [calcoloInCorso, setCalcoloInCorso] = useState(false);

  // Carica i giocatori con le classifiche
  useEffect(() => {
    caricaGiocatori();
  }, []);

  const caricaGiocatori = async () => {
    try {
      const { data, error } = await supabase
        .from('classifiche')
        .select(`
          *,
          profili_utenti!inner(
            nome_completo,
            email
          )
        `)
        .order('punteggio_calcolato', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const giocatoriFormattati = data.map(item => ({
          id: item.giocatore_id,
          nome_completo: item.profili_utenti.nome_completo,
          media_voto: item.media_voto,
          punteggio_calcolato: item.punteggio_calcolato,
          portiere: item.portiere,
          difensore: item.difensore,
          centrocampista: item.centrocampista,
          attaccante: item.attaccante,
          jolly: item.jolly,
          partite_giocate: item.partite_giocate
        }));
        
        setGiocatori(giocatoriFormattati);
      }
    } catch (error) {
      console.error('Errore nel caricamento giocatori:', error);
    } finally {
      setLoading(false);
    }
  };

  // Algoritmo per creare squadre bilanciate
  const creaSquadre = () => {
    setCalcoloInCorso(true);
    
    // Simuliamo un piccolo delay per mostrare il loading
    setTimeout(() => {
      const squadreGenerate = algoritmoSquadreBilanciate(giocatori, numeroSquadre);
      setSquadre(squadreGenerate);
      setCalcoloInCorso(false);
    }, 500);
  };

  const algoritmoSquadreBilanciate = (giocatoriDisponibili, numSquadre) => {
    const giocatoriOrdinati = [...giocatoriDisponibili].sort((a, b) => 
      b.punteggio_calcolato - a.punteggio_calcolato
    );

    const squadre = Array.from({ length: numSquadre }, (_, index) => ({
      id: index + 1,
      nome: `Squadra ${index + 1}`,
      giocatori: [],
      punteggioTotale: 0,
      ruoli: { portiere: 0, difensore: 0, centrocampista: 0, attaccante: 0, jolly: 0 }
    }));

    // Fase 1: Distribuisci JOLLY (più versatili)
    const jolly = giocatoriOrdinati.filter(g => g.jolly);
    jolly.forEach((jolly, index) => {
      const squadraIndex = index % numSquadre;
      aggiungiGiocatoreSquadra(squadre[squadraIndex], jolly);
    });

    // Fase 2: Distribuisci PORTIERI (ruoli rari)
    const portieri = giocatoriOrdinati.filter(g => g.portiere && !g.jolly);
    portieri.forEach((portiere, index) => {
      if (index < numSquadre) {
        aggiungiGiocatoreSquadra(squadre[index], portiere);
      }
    });

    // Fase 3: Distribuisci altri giocatori bilanciando punteggi
    const altriGiocatori = giocatoriOrdinati.filter(g => 
      !g.jolly && !g.portiere && !squadre.some(s => 
        s.giocatori.some(gioc => gioc.id === g.id)
      )
    );

    altriGiocatori.forEach(giocatore => {
      // Trova squadra con punteggio più basso
      const squadraIndex = squadre.reduce((migliore, squadra, index) => 
        squadra.punteggioTotale < squadre[migliore].punteggioTotale ? index : migliore
      , 0);
      
      aggiungiGiocatoreSquadra(squadre[squadraIndex], giocatore);
    });

    return squadre;
  };

  const aggiungiGiocatoreSquadra = (squadra, giocatore) => {
    squadra.giocatori.push(giocatore);
    squadra.punteggioTotale += giocatore.punteggio_calcolato;
    
    if (giocatore.jolly) {
      squadra.ruoli.jolly++;
    } else {
      if (giocatore.portiere) squadra.ruoli.portiere++;
      if (giocatore.difensore) squadra.ruoli.difensore++;
      if (giocatore.centrocampista) squadra.ruoli.centrocampista++;
      if (giocatore.attaccante) squadra.ruoli.attaccante++;
    }
  };

  const getEmojiRuolo = (giocatore) => {
    if (giocatore.jolly) return '🃏';
    if (giocatore.portiere) return '🧤';
    if (giocatore.difensore) return '🛡️';
    if (giocatore.centrocampista) return '⚙️';
    if (giocatore.attaccante) return '⚽';
    return '🎯';
  };

  if (loading) {
    return (
      <div className="generatore-squadre">
        <header className="page-header">
          <button onClick={onBack} className="back-button">←</button>
          <h1>Generatore Squadre</h1>
        </header>
        <div className="loading">Caricamento giocatori...</div>
      </div>
    );
  }

  return (
    <div className="generatore-squadre">
      <header className="page-header">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Generatore Squadre</h1>
      </header>

      <main className="page-content">
        {/* PANNELLO CONTROLLI */}
        <div className="controlli-squadre">
          <div className="controllo-gruppo">
            <label>Numero squadre:</label>
            <select 
              value={numeroSquadre} 
              onChange={(e) => setNumeroSquadre(Number(e.target.value))}
              className="select-squadre"
            >
              <option value={2}>2 squadre</option>
              <option value={3}>3 squadre</option>
              <option value={4}>4 squadre</option>
            </select>
          </div>

          <button 
            onClick={creaSquadre}
            disabled={calcoloInCorso || giocatori.length === 0}
            className="btn-genera"
          >
            {calcoloInCorso ? '🎲 Generazione in corso...' : '🎲 Genera Squadre'}
          </button>

          <div className="info-giocatori">
            <span>{giocatori.length} giocatori disponibili</span>
          </div>
        </div>

        {/* VISUALIZZAZIONE SQUADRE */}
        {squadre.length > 0 && (
          <div className="squadre-container">
            <h2>🏃 Squadre Generate</h2>
            <div className="squadre-grid">
              {squadre.map(squadra => (
                <div key={squadra.id} className="squadra-card">
                  <div className="squadra-header">
                    <h3>{squadra.nome} ⚽</h3>
                    <div className="squadra-stats">
                      <span className="punteggio">Punteggio: {squadra.punteggioTotale.toFixed(2)}</span>
                      <span className="giocatori">{squadra.giocatori.length} giocatori</span>
                    </div>
                  </div>

                  <div className="ruoli-squadra">
                    🧤{squadra.ruoli.portiere} 🛡️{squadra.ruoli.difensore} 
                    ⚙️{squadra.ruoli.centrocampista} ⚽{squadra.ruoli.attaccante}
                    {squadra.ruoli.jolly > 0 && ` 🃏${squadra.ruoli.jolly}`}
                  </div>

                  <div className="lista-giocatori">
                    {squadra.giocatori.map(giocatore => (
                      <div key={giocatore.id} className="giocatore-squadra">
                        <span className="emoji-ruolo">{getEmojiRuolo(giocatore)}</span>
                        <span className="nome-giocatore">{giocatore.nome_completo}</span>
                        <span className="voto-giocatore">{giocatore.punteggio_calcolato.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTA GIOCATORI DISPONIBILI */}
        <div className="giocatori-disponibili">
          <h2>👥 Giocatori Disponibili</h2>
          <div className="lista-giocatori-completa">
            {giocatori.map(giocatore => (
              <div key={giocatore.id} className="giocatore-item">
                <span className="emoji-ruolo">{getEmojiRuolo(giocatore)}</span>
                <span className="nome-giocatore">{giocatore.nome_completo}</span>
                <span className="voto-giocatore">{giocatore.punteggio_calcolato.toFixed(2)}</span>
                <span className="partite-giocate">{giocatore.partite_giocate} partite</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

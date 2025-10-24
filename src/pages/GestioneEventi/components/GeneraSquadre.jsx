import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

function GeneraSquadre() {
  const [giocatori, setGiocatori] = useState([]);
  const [squadreGenerate, setSquadreGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bilanciaLivello, setBilanciaLivello] = useState(true);
  const [caricamentoGiocatori, setCaricamentoGiocatori] = useState(true);

  // Carica giocatori DAL TUO DATABASE con JOIN
  useEffect(() => {
    caricaGiocatoriDatabase();
  }, []);

  const caricaGiocatoriDatabase = async () => {
    try {
      setCaricamentoGiocatori(true);
      
      // QUERY CON JOIN tra classifiche e profili_utenti
      const { data: giocatoriDB, error } = await supabase
        .from('classifiche')
        .select(`
          *,
          profili_utenti:giocatore_id (
            id,
            nome,
            cognome,
            username,
            email
          )
        `)
        .order('punteggio_calcolato', { ascending: false });

      if (error) {
        console.error('Errore query:', error);
        throw error;
      }

      console.log('Dati caricati:', giocatoriDB);

      if (!giocatoriDB || giocatoriDB.length === 0) {
        console.log('Nessun giocatore nel database, uso dati esempio');
        const giocatoriEsempio = [
          { id: 1, nome: 'Marco Rossi', livello: 80, selezionato: false },
          { id: 2, nome: 'Luca Bianchi', livello: 75, selezionato: false },
          { id: 3, nome: 'Giovanni Verdi', livello: 90, selezionato: false },
          { id: 4, nome: 'Andrea Neri', livello: 70, selezionato: false },
        ];
        setGiocatori(giocatoriEsempio);
        return;
      }

      // Mappa i giocatori con i dati corretti
      const giocatoriMappati = giocatoriDB.map(giocatore => {
        // Calcola il livello basato sul punteggio_calcolato
        const livelloBase = giocatore.punteggio_calcolato || giocatore.media_voto || 6.0;
        const livello = Math.round((livelloBase - 4) * 20); // Converti 4-10 in 0-120
        
        // Ottieni il nome dal profilo utente
        const nomeCompleto = giocatore.profili_utenti 
          ? `${giocatore.profili_utenti.nome || ''} ${giocatore.profili_utenti.cognome || ''}`.trim()
          : giocatore.profili_utenti?.username 
          || `Giocatore ${giocatore.id}`;

        return {
          id: giocatore.id,
          nome: nomeCompleto || `Giocatore ${giocatore.id}`,
          livello: Math.max(40, Math.min(100, livello)), // Limita tra 40 e 100
          selezionato: false,
          // Dettagli aggiuntivi per debug
          punteggio_calcolato: giocatore.punteggio_calcolato,
          media_voto: giocatore.media_voto,
          partite_giocate: giocatore.partite_giocate,
          gol_segnati: giocatore.gol_segnati,
          ruolo: {
            portiere: giocatore.portiere,
            difensore: giocatore.difensore,
            centrocampista: giocatore.centrocampista,
            attaccante: giocatore.attaccante,
            jolly: giocatore.jolly
          }
        };
      });

      console.log('Giocatori mappati:', giocatoriMappati);
      setGiocatori(giocatoriMappati);

    } catch (error) {
      console.error('Errore caricamento giocatori:', error);
      // Fallback a dati di esempio
      const giocatoriEsempio = [
        { id: 1, nome: 'Marco Rossi', livello: 80, selezionato: false },
        { id: 2, nome: 'Luca Bianchi', livello: 75, selezionato: false },
        { id: 3, nome: 'Giovanni Verdi', livello: 90, selezionato: false },
        { id: 4, nome: 'Andrea Neri', livello: 70, selezionato: false },
      ];
      setGiocatori(giocatoriEsempio);
    } finally {
      setCaricamentoGiocatori(false);
    }
  };

  const toggleSelezioneGiocatore = (giocatoreId) => {
    setGiocatori(prev => prev.map(g => 
      g.id === giocatoreId ? { ...g, selezionato: !g.selezionato } : g
    ));
  };

  const selezionaTutti = () => {
    setGiocatori(prev => prev.map(g => ({ ...g, selezionato: true })));
  };

  const deselezionaTutti = () => {
    setGiocatori(prev => prev.map(g => ({ ...g, selezionato: false })));
  };

  const selezionaNumero = (numero) => {
    const giocatoriRandom = [...giocatori]
      .sort(() => Math.random() - 0.5)
      .slice(0, numero)
      .map(g => g.id);
    
    setGiocatori(prev => prev.map(g => 
      giocatoriRandom.includes(g.id) ? { ...g, selezionato: true } : { ...g, selezionato: false }
    ));
  };

  const generaSquadre = () => {
    setLoading(true);
    
    setTimeout(() => {
      const giocatoriSelez = giocatori.filter(g => g.selezionato);
      
      if (giocatoriSelez.length < 2) {
        alert('Seleziona almeno 2 giocatori!');
        setLoading(false);
        return;
      }

      if (giocatoriSelez.length % 2 !== 0) {
        alert('Seleziona un numero pari di giocatori per squadre bilanciate!');
        setLoading(false);
        return;
      }

      let giocatoriDaDividere = [...giocatoriSelez];
      
      if (bilanciaLivello) {
        // Bilanciamento per livello (punteggio_calcolato)
        giocatoriDaDividere.sort((a, b) => b.livello - a.livello);
        
        const squadraA = [];
        const squadraB = [];
        
        // Distribuzione a serpentina
        for (let i = 0; i < giocatoriDaDividere.length; i++) {
          if (i % 2 === 0) {
            squadraA.push(giocatoriDaDividere[i]);
          } else {
            squadraB.push(giocatoriDaDividere[i]);
          }
        }
        
        setSquadreGenerate({
          squadraA,
          squadraB,
          bilanciamento: calcolaBilanciamento(squadraA, squadraB)
        });
      } else {
        // Divisione casuale
        giocatoriDaDividere = giocatoriDaDividere.sort(() => Math.random() - 0.5);
        const meta = giocatoriDaDividere.length / 2;
        
        setSquadreGenerate({
          squadraA: giocatoriDaDividere.slice(0, meta),
          squadraB: giocatoriDaDividere.slice(meta),
          bilanciamento: calcolaBilanciamento(giocatoriDaDividere.slice(0, meta), giocatoriDaDividere.slice(meta))
        });
      }
      
      setLoading(false);
    }, 500);
  };

  const calcolaBilanciamento = (squadraA, squadraB) => {
    const totaleA = squadraA.reduce((sum, g) => sum + g.livello, 0);
    const totaleB = squadraB.reduce((sum, g) => sum + g.livello, 0);
    const differenza = Math.abs(totaleA - totaleB);
    const percentualeBilanciamento = 100 - (differenza / Math.max(totaleA, totaleB) * 100);
    
    let valutazione = '🎯 Ottimo';
    if (differenza > 20) valutazione = '⚠️ Accettabile';
    if (differenza > 35) valutazione = '📉 Da migliorare';
    
    return {
      totaleA,
      totaleB,
      differenza,
      percentualeBilanciamento: Math.round(percentualeBilanciamento),
      valutazione
    };
  };

  const rigeneraSquadre = () => {
    generaSquadre();
  };

  const copiaRisultati = () => {
    if (!squadreGenerate) return;
    
    const testo = `
🟥 SQUADRA A (${squadreGenerate.bilanciamento.totaleA} pts):
${squadreGenerate.squadraA.map((g, i) => `${i + 1}. ${g.nome} - Lvl ${g.livello}`).join('\n')}

🟦 SQUADRA B (${squadreGenerate.bilanciamento.totaleB} pts):
${squadreGenerate.squadraB.map((g, i) => `${i + 1}. ${g.nome} - Lvl ${g.livello}`).join('\n')}

Bilanciamento: ${squadreGenerate.bilanciamento.percentualeBilanciamento}% 
${squadreGenerate.bilanciamento.valutazione}
Differenza: ${squadreGenerate.bilanciamento.differenza} punti
    `.trim();

    navigator.clipboard.writeText(testo);
    alert('📋 Risultati copiati negli appunti!');
  };

  const giocatoriSelezionatiCount = giocatori.filter(g => g.selezionato).length;
  const livelloMedio = giocatori.length > 0 
    ? Math.round(giocatori.reduce((sum, g) => sum + g.livello, 0) / giocatori.length)
    : 0;

  if (caricamentoGiocatori) {
    return (
      <div className="genera-squadre-container">
        <div className="loading">
          <h3>🔄 Caricamento giocatori dal database...</h3>
          <p>Sto leggendo la classifica con i punteggi reali</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genera-squadre-container">
      <div className="genera-squadre-header">
        <h2>👥 Genera Squadre</h2>
        <p>Basato sui punteggi reali della classifica 2024</p>
      </div>

      {/* CONTROLLI RAPIDI */}
      <div className="controlli-rapidi">
        <div className="stats-rapide">
          <span className="stat">Giocatori: {giocatori.length}</span>
          <span className="stat">Selezionati: {giocatoriSelezionatiCount}</span>
          <span className="stat">Livello medio: {livelloMedio}</span>
        </div>
        
        <div className="azioni-rapide">
          <button onClick={selezionaTutti} className="btn-secondary">
            Seleziona Tutti
          </button>
          <button onClick={deselezionaTutti} className="btn-secondary">
            Deseleziona Tutti
          </button>
          <button onClick={() => selezionaNumero(8)} className="btn-secondary">
            Seleziona 8
          </button>
          <button onClick={() => selezionaNumero(10)} className="btn-secondary">
            Seleziona 10
          </button>
        </div>
      </div>

      {/* OPZIONI GENERAZIONE */}
      <div className="opzioni-generazione">
        <label className="checkbox-option large">
          <input
            type="checkbox"
            checked={bilanciaLivello}
            onChange={(e) => setBilanciaLivello(e.target.checked)}
          />
          <span>⚖️ Bilanciamento per Punteggio Reale</span>
        </label>
        <small>Usa i punteggi calcolati dalla classifica per squadre equilibrate</small>
      </div>

      {/* LISTA GIOCATORI */}
      <div className="lista-giocatori">
        <h3>Giocatori dalla Classifica 2024 ({giocatoriSelezionatiCount} selezionati)</h3>
        
        <div className="giocatori-grid">
          {giocatori.map(giocatore => (
            <div 
              key={giocatore.id} 
              className={`giocatore-card ${giocatore.selezionato ? 'selezionato' : ''}`}
              onClick={() => toggleSelezioneGiocatore(giocatore.id)}
            >
              <div className="giocatore-info">
                <h4>{giocatore.nome}</h4>
                <div className="livello-dettagli">
                  <span className="livello">Livello: {giocatore.livello}</span>
                  {giocatore.punteggio_calcolato && (
                    <span className="punteggio">Punteggio: {giocatore.punteggio_calcolato}</span>
                  )}
                  {giocatore.partite_giocate > 0 && (
                    <span className="partite">Partite: {giocatore.partite_giocate}</span>
                  )}
                </div>
              </div>
              <div className="checkbox-visuale">
                {giocatore.selezionato && '✓'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTONE GENERA */}
      <div className="genera-actions">
        <button 
          onClick={generaSquadre}
          disabled={loading || giocatoriSelezionatiCount < 2}
          className="btn-primary large"
        >
          {loading ? '🎲 Generando Squadre...' : `🎯 Genera Squadre (${giocatoriSelezionatiCount} giocatori)`}
        </button>
      </div>

      {/* RISULTATI SQUADRE */}
      {squadreGenerate && (
        <div className="risultati-squadre">
          <h3>🎉 Squadre Generate</h3>
          
          {/* INDICATORE BILANCIAMENTO */}
          <div className="bilanciamento-indicator">
            <div className="bilanciamento-score">
              <strong>{squadreGenerate.bilanciamento.valutazione}</strong> - 
              Bilanciamento: <strong>{squadreGenerate.bilanciamento.percentualeBilanciamento}%</strong>
            </div>
            <div className="bilanciamento-dettaglio">
              Squadra A: {squadreGenerate.bilanciamento.totaleA} pts | 
              Squadra B: {squadreGenerate.bilanciamento.totaleB} pts | 
              Differenza: {squadreGenerate.bilanciamento.differenza} pts
            </div>
          </div>

          <div className="squadre-grid">
            {/* SQUADRA A */}
            <div className="squadra-card squadra-a">
              <div className="squadra-header">
                <h4>🟥 Squadra A</h4>
                <span className="punti-totale">{squadreGenerate.bilanciamento.totaleA} pts</span>
              </div>
              <div className="squadra-giocatori">
                {squadreGenerate.squadraA.map((giocatore, index) => (
                  <div key={giocatore.id} className="giocatore-squadra">
                    <span className="posizione">{index + 1}.</span>
                    <span className="nome">{giocatore.nome}</span>
                    <span className="livello">{giocatore.livello}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SQUADRA B */}
            <div className="squadra-card squadra-b">
              <div className="squadra-header">
                <h4>🟦 Squadra B</h4>
                <span className="punti-totale">{squadreGenerate.bilanciamento.totaleB} pts</span>
              </div>
              <div className="squadra-giocatori">
                {squadreGenerate.squadraB.map((giocatore, index) => (
                  <div key={giocatore.id} className="giocatore-squadra">
                    <span className="posizione">{index + 1}.</span>
                    <span className="nome">{giocatore.nome}</span>
                    <span className="livello">{giocatore.livello}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="azioni-risultati">
            <button onClick={rigeneraSquadre} className="btn-secondary">🔄 Rigenera</button>
            <button onClick={copiaRisultati} className="btn-primary">📋 Copia Risultati</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneraSquadre;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

function GeneraSquadre() {
  const [giocatori, setGiocatori] = useState([]);
  const [giocatoriSelezionati, setGiocatoriSelezionati] = useState([]);
  const [squadreGenerate, setSquadreGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bilanciaLivello, setBilanciaLivello] = useState(true);

  // Carica giocatori dal database
  useEffect(() => {
    caricaGiocatori();
  }, []);

  const caricaGiocatori = async () => {
    try {
      // Prima carichiamo dalla tabella classifiche
      const { data: giocatoriClassifica, error } = await supabase
        .from('classifiche')
        .select('*')
        .order('punti', { ascending: false });

      if (error) throw error;

      if (giocatoriClassifica && giocatoriClassifica.length > 0) {
        // Usa i giocatori dalla classifica
        const giocatoriMappati = giocatoriClassifica.map(g => ({
          id: g.id,
          nome: g.nome || g.username || `Giocatore ${g.id}`,
          livello: g.punti || 50, // Usa i punti come livello
          selezionato: false
        }));
        setGiocatori(giocatoriMappati);
      } else {
        // Se non ci sono giocatori in classifica, usa dati mock per test
        const giocatoriMock = [
          { id: 1, nome: 'Marco', livello: 80, selezionato: false },
          { id: 2, nome: 'Luca', livello: 75, selezionato: false },
          { id: 3, nome: 'Giovanni', livello: 90, selezionato: false },
          { id: 4, nome: 'Andrea', livello: 70, selezionato: false },
          { id: 5, nome: 'Matteo', livello: 85, selezionato: false },
          { id: 6, nome: 'Francesco', livello: 65, selezionato: false },
          { id: 7, nome: 'Alessandro', livello: 95, selezionato: false },
          { id: 8, nome: 'Stefano', livello: 60, selezionato: false },
        ];
        setGiocatori(giocatoriMock);
      }
    } catch (error) {
      console.error('Errore caricamento giocatori:', error);
      // Fallback a dati mock in caso di errore
      const giocatoriMock = [
        { id: 1, nome: 'Marco', livello: 80, selezionato: false },
        { id: 2, nome: 'Luca', livello: 75, selezionato: false },
        { id: 3, nome: 'Giovanni', livello: 90, selezionato: false },
        { id: 4, nome: 'Andrea', livello: 70, selezionato: false },
      ];
      setGiocatori(giocatoriMock);
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

  const generaSquadre = () => {
    setLoading(true);
    
    // Simula un breve caricamento per l'effetto
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
        // Ordina per livello e dividi in modo bilanciato
        giocatoriDaDividere.sort((a, b) => b.livello - a.livello);
        
        const squadraA = [];
        const squadraB = [];
        
        // Algoritmo di bilanciamento: migliore con secondo migliore in squadre diverse
        for (let i = 0; i < giocatoriDaDividere.length; i += 2) {
          if (i % 4 === 0 || i % 4 === 3) {
            squadraA.push(giocatoriDaDividere[i]);
            if (giocatoriDaDividere[i + 1]) {
              squadraB.push(giocatoriDaDividere[i + 1]);
            }
          } else {
            squadraB.push(giocatoriDaDividere[i]);
            if (giocatoriDaDividere[i + 1]) {
              squadraA.push(giocatoriDaDividere[i + 1]);
            }
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
    }, 1000);
  };

  const calcolaBilanciamento = (squadraA, squadraB) => {
    const totaleA = squadraA.reduce((sum, g) => sum + g.livello, 0);
    const totaleB = squadraB.reduce((sum, g) => sum + g.livello, 0);
    const differenza = Math.abs(totaleA - totaleB);
    const percentualeBilanciamento = 100 - (differenza / Math.max(totaleA, totaleB) * 100);
    
    return {
      totaleA,
      totaleB,
      differenza,
      percentualeBilanciamento: Math.round(percentualeBilanciamento)
    };
  };

  const giocatoriSelezionatiCount = giocatori.filter(g => g.selezionato).length;

  return (
    <div className="genera-squadre-container">
      <div className="genera-squadre-header">
        <h2>👥 Genera Squadre</h2>
        <p>Seleziona i giocatori e genera squadre bilanciate</p>
      </div>

      {/* CONTROLLI RAPIDI */}
      <div className="controlli-rapidi">
        <div className="stats-rapide">
          <span className="stat">Giocatori: {giocatori.length}</span>
          <span className="stat">Selezionati: {giocatoriSelezionatiCount}</span>
        </div>
        
        <div className="azioni-rapide">
          <button onClick={selezionaTutti} className="btn-secondary">
            Seleziona Tutti
          </button>
          <button onClick={deselezionaTutti} className="btn-secondary">
            Deseleziona Tutti
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
          <span>⚖️ Bilanciamento Automatico per Livello</span>
        </label>
      </div>

      {/* LISTA GIOCATORI */}
      <div className="lista-giocatori">
        <h3>Seleziona Giocatori ({giocatoriSelezionatiCount} selezionati)</h3>
        
        <div className="giocatori-grid">
          {giocatori.map(giocatore => (
            <div 
              key={giocatore.id} 
              className={`giocatore-card ${giocatore.selezionato ? 'selezionato' : ''}`}
              onClick={() => toggleSelezioneGiocatore(giocatore.id)}
            >
              <div className="giocatore-info">
                <h4>{giocatore.nome}</h4>
                <div className="livello">Livello: {giocatore.livello}</div>
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
          {loading ? '🎲 Generando...' : `🎯 Genera Squadre (${giocatoriSelezionatiCount} giocatori)`}
        </button>
      </div>

      {/* RISULTATI SQUADRE */}
      {squadreGenerate && (
        <div className="risultati-squadre">
          <h3>🎉 Squadre Generate</h3>
          
          {/* INDICATORE BILANCIAMENTO */}
          <div className="bilanciamento-indicator">
            <div className="bilanciamento-score">
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
            <button className="btn-secondary">🔄 Rigenera</button>
            <button className="btn-primary">📋 Copia Risultati</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneraSquadre;

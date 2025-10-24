import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

function GeneraSquadre() {
  const [giocatori, setGiocatori] = useState([]);
  const [squadreGenerate, setSquadreGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bilanciaLivello, setBilanciaLivello] = useState(true);
  const [caricamentoGiocatori, setCaricamentoGiocatori] = useState(true);
  const [errore, setErrore] = useState('');
  const [modalVoti, setModalVoti] = useState(false);
  const [votiTemporanei, setVotiTemporanei] = useState({});
  const [salvataggioVoti, setSalvataggioVoti] = useState(false);

  // Carica giocatori con dati reali dalla classifica
  useEffect(() => {
    caricaGiocatoriConClassifica();
  }, []);

  const caricaGiocatoriConClassifica = async () => {
    try {
      setCaricamentoGiocatori(true);
      setErrore('');
      
      console.log('📡 Caricamento giocatori dalla classifica...');
      
      // Carica dalla classifica con join ai profili
      let { data: giocatoriDB, error } = await supabase
        .from('classifiche')
        .select(`
          *,
          profili_utenti:giocatore_id (
            id,
            nome_completo,
            nickname,
            livello_scarparo,
            email,
            telefono
          )
        `)
        .order('punteggio_calcolato', { ascending: false });

      // Se errore o classifica vuota, carica dai profili
      if (error || !giocatoriDB || giocatoriDB.length === 0) {
        console.log('🔄 Classifica vuota o errore, carico dai profili...');
        await caricaDaProfiliUtenti();
        return;
      }

      console.log('✅ Dati classifica caricati:', giocatoriDB);

      // Mappa i giocatori con i dati reali
      const giocatoriMappati = giocatoriDB.map(record => {
        // Calcola livello basato sul punteggio_calcolato (voto reale)
        let livello = 50; // Default
        if (record.punteggio_calcolato) {
          // Converti il voto in livello (es: voto 7.5 -> livello 75)
          livello = Math.round(record.punteggio_calcolato * 10);
        }

        // Limita il livello tra 30 e 100
        livello = Math.max(30, Math.min(100, livello));

        // Ottieni il nome
        const nomeCompleto = record.profili_utenti?.nome_completo 
          || record.profili_utenti?.nickname
          || `Giocatore ${record.giocatore_id}`;

        return {
          id: record.id,
          giocatore_id: record.giocatore_id,
          nome: nomeCompleto,
          livello: livello,
          voto_attuale: record.punteggio_calcolato, // Usa il voto reale come voto attuale
          selezionato: false,
          // Dati dalla classifica
          punteggio_calcolato: record.punteggio_calcolato,
          media_voto: record.media_voto,
          partite_giocate: record.partite_giocate,
          gol_segnati: record.gol_segnati,
          assist: record.assist,
          punti_classifica: record.punti_classifica,
          // Ruoli
          ruolo: {
            portiere: record.portiere,
            difensore: record.difensore,
            centrocampista: record.centrocampista,
            attaccante: record.attaccante,
            jolly: record.jolly
          },
          stagione: record.stagione,
          da_classifica: true
        };
      });

      setGiocatori(giocatoriMappati);
      setErrore(`✅ Caricati ${giocatoriMappati.length} giocatori dalla classifica`);

    } catch (error) {
      console.error('❌ Errore caricamento classifica:', error);
      setErrore(`Errore caricamento: ${error.message}`);
      await caricaDaProfiliUtenti();
    } finally {
      setCaricamentoGiocatori(false);
    }
  };

  // Fallback: carica dai profili utenti
  const caricaDaProfiliUtenti = async () => {
    try {
      console.log('🔄 Caricamento da profili_utenti...');
      
      const { data: profiliDB, error } = await supabase
        .from('profili_utenti')
        .select('*')
        .eq('tipo_profilo', 'giocatore')
        .order('nome_completo', { ascending: true });

      if (error) throw error;

      if (!profiliDB || profiliDB.length === 0) {
        setErrore('Nessun giocatore trovato nel database');
        return;
      }

      // Mappa i giocatori dai profili
      const giocatoriMappati = profiliDB.map(profilo => {
        const livelli = {
          'principiante': 40,
          'intermedio': 65,
          'avanzato': 85,
          'decentrato': 50,
          'scarso': 35
        };
        
        const livello = livelli[profilo.livello_scarparo] || 50;

        return {
          id: profilo.id,
          giocatore_id: profilo.id,
          nome: profilo.nome_completo || profilo.nickname || `Giocatore ${profilo.id}`,
          livello: livello,
          voto_attuale: null, // Nessun voto dai profili
          selezionato: false,
          livello_scarparo: profilo.livello_scarparo,
          ruolo: {
            portiere: profilo.portiere,
            difensore: profilo.difensore,
            centrocampista: profilo.centrocampista,
            attaccante: profilo.attaccante
          },
          da_profili: true
        };
      });

      setGiocatori(giocatoriMappati);
      setErrore(`✅ Caricati ${giocatoriMappati.length} giocatori dai profili (classifica vuota)`);

    } catch (error) {
      console.error('❌ Errore caricamento profili:', error);
      setErrore(`Errore caricamento profili: ${error.message}`);
    }
  };

  // APRI MODAL PER INSERIMENTO VOTI
  const apriModalVoti = () => {
    const votiIniziali = {};
    giocatori.forEach(giocatore => {
      votiIniziali[giocatore.giocatore_id || giocatore.id] = giocatore.voto_attuale || '';
    });
    setVotiTemporanei(votiIniziali);
    setModalVoti(true);
  };

  // AGGIORNA VOTO TEMPORANEO
  const aggiornaVotoTemporaneo = (giocatoreId, voto) => {
    if (voto === '' || (voto >= 1 && voto <= 10)) {
      setVotiTemporanei(prev => ({
        ...prev,
        [giocatoreId]: voto === '' ? '' : Number(voto)
      }));
    }
  };

  // SALVA TUTTI I VOTI NEL DATABASE
  const salvaVoti = async () => {
    try {
      setSalvataggioVoti(true);
      
      const votiDaSalvare = Object.entries(votiTemporanei)
        .filter(([_, voto]) => voto !== '' && voto !== null)
        .map(([giocatoreId, voto]) => ({
          giocatore_id: giocatoreId,
          voto: voto,
          creato_da: 'admin'
        }));

      console.log('💾 Salvando voti:', votiDaSalvare);

      if (votiDaSalvare.length === 0) {
        alert('⚠️ Nessun voto da salvare!');
        setModalVoti(false);
        return;
      }

      // Inserisci i nuovi voti
      const { error } = await supabase
        .from('voti_giocatori')
        .insert(votiDaSalvare);

      if (error) throw error;

      console.log('✅ Voti salvati con successo!');
      alert(`✅ ${votiDaSalvare.length} voti salvati con successo!`);
      
      // Ricarica i giocatori per aggiornare i voti
      await caricaGiocatoriConClassifica();
      setModalVoti(false);

    } catch (error) {
      console.error('❌ Errore salvataggio voti:', error);
      alert(`❌ Errore nel salvataggio dei voti: ${error.message}`);
    } finally {
      setSalvataggioVoti(false);
    }
  };

  // FUNZIONI PER SELEZIONE GIOCATORI
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

  // GENERA SQUADRE
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
        // Bilanciamento per livello
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
${squadreGenerate.squadraA.map((g, i) => `${i + 1}. ${g.nome} - Lvl ${g.livello}${g.voto_attuale ? ` - Voto: ${g.voto_attuale}` : ''}`).join('\n')}

🟦 SQUADRA B (${squadreGenerate.bilanciamento.totaleB} pts):
${squadreGenerate.squadraB.map((g, i) => `${i + 1}. ${g.nome} - Lvl ${g.livello}${g.voto_attuale ? ` - Voto: ${g.voto_attuale}` : ''}`).join('\n')}

Bilanciamento: ${squadreGenerate.bilanciamento.percentualeBilanciamento}% 
${squadreGenerate.bilanciamento.valutazione}
Differenza: ${squadreGenerate.bilanciamento.differenza} punti
    `.trim();

    navigator.clipboard.writeText(testo);
    alert('📋 Risultati copiati negli appunti!');
  };

  // STATISTICHE
  const giocatoriSelezionatiCount = giocatori.filter(g => g.selezionato).length;
  const giocatoriConVoto = giocatori.filter(g => g.voto_attuale !== null).length;
  const livelloMedio = giocatori.length > 0 
    ? Math.round(giocatori.reduce((sum, g) => sum + g.livello, 0) / giocatori.length)
    : 0;
  const votoMedio = giocatori.length > 0 
    ? (giocatori.reduce((sum, g) => sum + (g.voto_attuale || 0), 0) / giocatori.filter(g => g.voto_attuale).length).toFixed(2)
    : 0;

  if (caricamentoGiocatori) {
    return (
      <div className="genera-squadre-container">
        <div className="loading">
          <h3>🔄 Caricamento giocatori dal database...</h3>
          <p>Sto leggendo la classifica con i voti reali</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genera-squadre-container">
      <div className="genera-squadre-header">
        <h2>👥 Genera Squadre</h2>
        <p>Basato sui giocatori reali con voti dalla classifica</p>
      </div>

      {/* MESSAGGIO ERRORE */}
      {errore && (
        <div className="error-message">
          <h4>⚠️ Informazione</h4>
          <p>{errore}</p>
        </div>
      )}

      {/* CONTROLLI RAPIDI */}
      <div className="controlli-rapidi">
        <div className="stats-rapide">
          <span className="stat">Giocatori: {giocatori.length}</span>
          <span className="stat">Selezionati: {giocatoriSelezionatiCount}</span>
          <span className="stat">Con voto: {giocatoriConVoto}</span>
          <span className="stat">Livello medio: {livelloMedio}</span>
          {votoMedio > 0 && <span className="stat">Voto medio: {votoMedio}</span>}
        </div>
        
        <div className="azioni-rapide">
          <button onClick={apriModalVoti} className="btn-primary">
            📝 Inserisci Voti
          </button>
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
          <button onClick={() => selezionaNumero(16)} className="btn-secondary">
            Seleziona 16
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
          <span>⚖️ Bilanciamento Automatico</span>
        </label>
        <small>Crea squadre equilibrate basate sui livelli dei giocatori</small>
      </div>

      {/* LISTA GIOCATORI CON VOTI */}
      <div className="lista-giocatori">
        <h3>
          {giocatori.length > 0 && giocatori[0].da_profili 
            ? 'Giocatori dai Profili Utenti' 
            : 'Giocatori dalla Classifica'
          } 
          ({giocatoriSelezionatiCount} selezionati, {giocatoriConVoto} con voto)
        </h3>
        
        {giocatori.length === 0 ? (
          <div className="empty-state">
            <h4>📭 Nessun giocatore trovato</h4>
            <p>Il database non contiene giocatori</p>
          </div>
        ) : (
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
                    {giocatore.voto_attuale && (
                      <span className="voto-attuale">⭐ Voto: {giocatore.voto_attuale}</span>
                    )}
                    {giocatore.partite_giocate && (
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
        )}
      </div>

      {/* BOTTONE GENERA */}
      {giocatori.length > 0 && (
        <div className="genera-actions">
          <button 
            onClick={generaSquadre}
            disabled={loading || giocatoriSelezionatiCount < 2}
            className="btn-primary large"
          >
            {loading ? '🎲 Generando Squadre...' : `🎯 Genera Squadre (${giocatoriSelezionatiCount} giocatori)`}
          </button>
        </div>
      )}

      {/* MODAL INSERIMENTO VOTI */}
      {modalVoti && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📝 Inserisci Voti Giocatori</h3>
              <button 
                onClick={() => setModalVoti(false)}
                className="btn-close"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p>Inserisci i voti da 1 a 10 per ogni giocatore:</p>
              
              <div className="voti-grid">
                {giocatori.map(giocatore => (
                  <div key={giocatore.giocatore_id || giocatore.id} className="voto-item">
                    <label>{giocatore.nome}</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={votiTemporanei[giocatore.giocatore_id || giocatore.id] || ''}
                      onChange={(e) => aggiornaVotoTemporaneo(
                        giocatore.giocatore_id || giocatore.id, 
                        e.target.value
                      )}
                      placeholder="Voto (1-10)"
                    />
                    {giocatore.voto_attuale && (
                      <span className="voto-precedente">
                        Attuale: {giocatore.voto_attuale}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setModalVoti(false)}
                className="btn-secondary"
              >
                Annulla
              </button>
              <button 
                onClick={salvaVoti}
                disabled={salvataggioVoti}
                className="btn-primary"
              >
                {salvataggioVoti ? '💾 Salvando...' : '💾 Salva Tutti i Voti'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    {giocatore.voto_attuale && (
                      <span className="voto">⭐ {giocatore.voto_attuale}</span>
                    )}
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
                    {giocatore.voto_attuale && (
                      <span className="voto">⭐ {giocatore.voto_attuale}</span>
                    )}
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

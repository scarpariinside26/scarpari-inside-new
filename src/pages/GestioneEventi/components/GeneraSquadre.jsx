import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

function GeneraSquadre() {
  const [giocatori, setGiocatori] = useState([]);
  const [squadreGenerate, setSquadreGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bilanciaLivello, setBilanciaLivello] = useState(true);
  const [caricamentoGiocatori, setCaricamentoGiocatori] = useState(true);
  const [errore, setErrore] = useState('');

  // Carica giocatori DAL TUO DATABASE con gestione errori RLS
  useEffect(() => {
    caricaGiocatoriDatabase();
  }, []);

  const caricaGiocatoriDatabase = async () => {
    try {
      setCaricamentoGiocatori(true);
      setErrore('');
      
      console.log('📡 Caricamento giocatori dal database...');
      
      // PRIMA prova con JOIN
      let { data: giocatoriDB, error } = await supabase
        .from('classifiche')
        .select(`
          *,
          profili_utenti:giocatore_id (
            id,
            nome_completo,
            nickname,
            livello_scarparo,
            portiere,
            difensore,
            centrocampista,
            attaccante
          )
        `)
        .order('punteggio_calcolato', { ascending: false });

      // Se errore di ricorsione RLS, usa approccio alternativo
      if (error && (error.message.includes('recursion') || error.message.includes('policy'))) {
        console.log('🔄 Errore RLS rilevato, uso approccio alternativo...');
        await caricaConApproccioAlternativo();
        return;
      }

      if (error) {
        console.error('❌ Errore query:', error);
        setErrore(`Errore database: ${error.message}`);
        throw error;
      }

      console.log('✅ Dati caricati:', giocatoriDB);

      if (!giocatoriDB || giocatoriDB.length === 0) {
        console.log('⚠️ Nessun giocatore nella classifica');
        setErrore('Nessun giocatore trovato nella classifica. La tabella "classifiche" potrebbe essere vuota.');
        
        // Prova a caricare direttamente dai profili utenti
        await caricaDaProfiliUtenti();
        return;
      }

      // Mappa i giocatori con i dati corretti
      const giocatoriMappati = giocatoriDB.map(giocatore => {
        // Calcola il livello basato sul punteggio_calcolato o livello_scarparo
        let livello = 50; // Default
        
        if (giocatore.punteggio_calcolato) {
          livello = Math.round((giocatore.punteggio_calcolato - 4) * 20);
        } else if (giocatore.profili_utenti?.livello_scarparo) {
          // Mappa livello_scarparo a numero
          const livelli = {
            'principiante': 40,
            'intermedio': 65,
            'avanzato': 85
          };
          livello = livelli[giocatore.profili_utenti.livello_scarparo] || 50;
        }

        // Ottieni il nome dal profilo utente
        const nomeCompleto = giocatore.profili_utenti?.nome_completo 
          || giocatore.profili_utenti?.nickname
          || `Giocatore ${giocatore.id}`;

        return {
          id: giocatore.id,
          nome: nomeCompleto,
          livello: Math.max(30, Math.min(100, livello)), // Limita tra 30 e 100
          selezionato: false,
          // Dettagli aggiuntivi
          punteggio_calcolato: giocatore.punteggio_calcolato,
          media_voto: giocatore.media_voto,
          partite_giocate: giocatore.partite_giocate,
          gol_segnati: giocatore.gol_segnati,
          livello_scarparo: giocatore.profili_utenti?.livello_scarparo,
          ruolo: {
            portiere: giocatore.portiere || giocatore.profili_utenti?.portiere,
            difensore: giocatore.difensore || giocatore.profili_utenti?.difensore,
            centrocampista: giocatore.centrocampista || giocatore.profili_utenti?.centrocampista,
            attaccante: giocatore.attaccante || giocatore.profili_utenti?.attaccante
          }
        };
      });

      console.log('🎯 Giocatori mappati:', giocatoriMappati);
      setGiocatori(giocatoriMappati);

    } catch (error) {
      console.error('❌ Errore caricamento giocatori:', error);
      setErrore(`Errore: ${error.message}`);
    } finally {
      setCaricamentoGiocatori(false);
    }
  };

  // APPROCCIO ALTERNATIVO per evitare problemi RLS
  const caricaConApproccioAlternativo = async () => {
    try {
      console.log('🔄 Caricamento con approccio alternativo...');
      
      // Carica classifiche e profili SEPARATAMENTE
      const { data: classifica, error: errorClassifica } = await supabase
        .from('classifiche')
        .select('*')
        .order('punteggio_calcolato', { ascending: false });

      if (errorClassifica) throw errorClassifica;

      if (!classifica || classifica.length === 0) {
        await caricaDaProfiliUtenti();
        return;
      }

      // Carica ID unici dei giocatori
      const giocatoreIds = [...new Set(classifica.map(c => c.giocatore_id))];
      
      // Carica profili separatamente
      const { data: profili, error: errorProfili } = await supabase
        .from('profili_utenti')
        .select('*')
        .in('id', giocatoreIds);

      if (errorProfili) {
        console.warn('⚠️ Errore caricamento profili, continuo senza...', errorProfili);
        // Continua senza dati profili
      }

      console.log('📊 Classifica:', classifica);
      console.log('👤 Profili:', profili);

      // Combina manualmente i dati
      const giocatoriCombinati = classifica.map(record => {
        const profilo = profili?.find(p => p.id === record.giocatore_id);
        
        // Calcola livello
        let livello = 50;
        if (record.punteggio_calcolato) {
          livello = Math.round((record.punteggio_calcolato - 4) * 20);
        } else if (profilo?.livello_scarparo) {
          const livelli = {
            'principiante': 40,
            'intermedio': 65,
            'avanzato': 85
          };
          livello = livelli[profilo.livello_scarparo] || 50;
        }

        // Nome
        const nomeCompleto = profilo?.nome_completo 
          || profilo?.nickname
          || `Giocatore ${record.giocatore_id}`;

        return {
          id: record.id,
          nome: nomeCompleto,
          livello: Math.max(30, Math.min(100, livello)),
          selezionato: false,
          punteggio_calcolato: record.punteggio_calcolato,
          media_voto: record.media_voto,
          partite_giocate: record.partite_giocate,
          gol_segnati: record.gol_segnati,
          livello_scarparo: profilo?.livello_scarparo,
          ruolo: {
            portiere: profilo?.portiere,
            difensore: profilo?.difensore,
            centrocampista: profilo?.centrocampista,
            attaccante: profilo?.attaccante
          },
          da_profili: false,
          approccio_alternativo: true // Flag per identificare questo approccio
        };
      });

      console.log('✅ Giocatori combinati:', giocatoriCombinati);
      setGiocatori(giocatoriCombinati);
      setErrore(`Caricati ${giocatoriCombinati.length} giocatori (modalità alternativa)`);

    } catch (error) {
      console.error('❌ Errore approccio alternativo:', error);
      setErrore(`Errore caricamento: ${error.message}`);
      // Fallback finale
      await caricaDaProfiliUtenti();
    }
  };

  // Fallback: carica direttamente dai profili utenti se classifica è vuota
  const caricaDaProfiliUtenti = async () => {
    try {
      console.log('🔄 Tentativo caricamento da profili_utenti...');
      
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

      console.log('✅ Profili utenti caricati:', profiliDB);

      const giocatoriMappati = profiliDB.map(profilo => {
        // Mappa livello_scarparo a numero
        const livelli = {
          'principiante': 40,
          'intermedio': 65,
          'avanzato': 85,
          'decentrato': 50
        };
        
        const livello = livelli[profilo.livello_scarparo] || 50;

        return {
          id: profilo.id,
          nome: profilo.nome_completo || profilo.nickname || `Giocatore ${profilo.id}`,
          livello: livello,
          selezionato: false,
          livello_scarparo: profilo.livello_scarparo,
          ruolo: {
            portiere: profilo.portiere,
            difensore: profilo.difensore,
            centrocampista: profilo.centrocampista,
            attaccante: profilo.attaccante
          },
          da_profili: true // Flag per identificare che viene dai profili
        };
      });

      setGiocatori(giocatoriMappati);
      setErrore(`Caricati ${giocatoriMappati.length} giocatori dai profili (classifica vuota)`);

    } catch (error) {
      console.error('❌ Errore caricamento profili:', error);
      setErrore(`Errore caricamento profili: ${error.message}`);
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
          <p>Sto leggendo la classifica e i profili utenti</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genera-squadre-container">
      <div className="genera-squadre-header">
        <h2>👥 Genera Squadre</h2>
        <p>Basato sui giocatori reali del database</p>
      </div>

      {/* MESSAGGIO ERRORE */}
      {errore && (
        <div className="error-message">
          <h4>⚠️ Informazione</h4>
          <p>{errore}</p>
          <small>
            {errore.includes('modalità alternativa') && 
              'Sto usando un approccio alternativo per evitare problemi di sicurezza del database.'}
          </small>
        </div>
      )}

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
          <span>⚖️ Bilanciamento Automatico</span>
        </label>
        <small>Crea squadre equilibrate basate sui livelli dei giocatori</small>
      </div>

      {/* LISTA GIOCATORI */}
      <div className="lista-giocatori">
        <h3>
          {giocatori.length > 0 && giocatori[0].da_profili 
            ? 'Giocatori dai Profili Utenti' 
            : giocatori.length > 0 && giocatori[0].approccio_alternativo
            ? 'Giocatori (Modalità Alternativa)'
            : 'Giocatori dalla Classifica'
          } 
          ({giocatoriSelezionatiCount} selezionati)
        </h3>
        
        {giocatori.length === 0 ? (
          <div className="empty-state">
            <h4>📭 Nessun giocatore trovato</h4>
            <p>Il database non contiene giocatori o la classifica è vuota</p>
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
                    {giocatore.livello_scarparo && (
                      <span className="livello-scarparo">({giocatore.livello_scarparo})</span>
                    )}
                    {giocatore.punteggio_calcolato && (
                      <span className="punteggio">Punteggio: {giocatore.punteggio_calcolato}</span>
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

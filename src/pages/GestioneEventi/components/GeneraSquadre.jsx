import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

function GeneraSquadre() {
  const [giocatori, setGiocatori] = useState([]);
  const [giocatoriFiltrati, setGiocatoriFiltrati] = useState([]);
  const [squadreGenerate, setSquadreGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bilanciaLivello, setBilanciaLivello] = useState(true);
  const [bilanciaRuoli, setBilanciaRuoli] = useState(true);
  const [caricamentoGiocatori, setCaricamentoGiocatori] = useState(true);
  const [errore, setErrore] = useState('');
  const [ricerca, setRicerca] = useState('');

  useEffect(() => {
    caricaGiocatoriConClassifica();
  }, []);

  useEffect(() => {
    if (ricerca) {
      const filtrati = giocatori.filter(giocatore =>
        giocatore.nome.toLowerCase().includes(ricerca.toLowerCase())
      );
      setGiocatoriFiltrati(filtrati);
    } else {
      setGiocatoriFiltrati(giocatori);
    }
  }, [ricerca, giocatori]);

  const caricaGiocatoriConClassifica = async () => {
    try {
      setCaricamentoGiocatori(true);
      setErrore('');
      
      let { data: giocatoriDB, error } = await supabase
        .from('classifiche')
        .select(`
          *,
          profili_utenti:giocatore_id (
            id,
            nome_completo,
            nickname,
            portiere,
            difensore,
            centrocampista,
            attaccante
          )
        `)
        .order('punteggio_calcolato', { ascending: false });

      if (error || !giocatoriDB || giocatoriDB.length === 0) {
        await caricaSoloProfili();
        return;
      }

      const giocatoriMappati = giocatoriDB.map(record => {
        const nomeCompleto = record.profili_utenti?.nome_completo 
          || record.profili_utenti?.nickname
          || `Giocatore ${record.giocatore_id}`;

        // Determina il ruolo principale
        const ruoli = [];
        if (record.portiere || record.profili_utenti?.portiere) ruoli.push('portiere');
        if (record.difensore || record.profili_utenti?.difensore) ruoli.push('difensore');
        if (record.centrocampista || record.profili_utenti?.centrocampista) ruoli.push('centrocampista');
        if (record.attaccante || record.profili_utenti?.attaccante) ruoli.push('attaccante');
        
        const ruoloPrincipale = ruoli.length > 0 ? ruoli[0] : 'centrocampista';

        return {
          id: record.id,
          giocatore_id: record.giocatore_id,
          nome: nomeCompleto,
          voto: record.punteggio_calcolato,
          partite_giocate: record.partite_giocate,
          selezionato: false,
          ruolo: ruoloPrincipale,
          ruoliMultipli: ruoli,
          da_classifica: true
        };
      });

      giocatoriMappati.sort((a, b) => a.nome.localeCompare(b.nome));
      setGiocatori(giocatoriMappati);
      setGiocatoriFiltrati(giocatoriMappati);

    } catch (error) {
      console.error('❌ Errore:', error);
      setErrore(`Errore: ${error.message}`);
      await caricaSoloProfili();
    } finally {
      setCaricamentoGiocatori(false);
    }
  };

  const caricaSoloProfili = async () => {
    try {
      const { data: profiliDB, error } = await supabase
        .from('profili_utenti')
        .select('*')
        .eq('tipo_profilo', 'giocatore')
        .order('nome_completo', { ascending: true });

      if (error) throw error;

      const giocatoriMappati = profiliDB.map(profilo => {
        const ruoli = [];
        if (profilo.portiere) ruoli.push('portiere');
        if (profilo.difensore) ruoli.push('difensore');
        if (profilo.centrocampista) ruoli.push('centrocampista');
        if (profilo.attaccante) ruoli.push('attaccante');
        
        const ruoloPrincipale = ruoli.length > 0 ? ruoli[0] : 'centrocampista';

        return {
          id: profilo.id,
          giocatore_id: profilo.id,
          nome: profilo.nome_completo || profilo.nickname || `Giocatore ${profilo.id}`,
          voto: null,
          partite_giocate: 0,
          selezionato: false,
          ruolo: ruoloPrincipale,
          ruoliMultipli: ruoli,
          da_profili: true
        };
      });

      setGiocatori(giocatoriMappati);
      setGiocatoriFiltrati(giocatoriMappati);
      setErrore('⚠️ Solo nomi dai profili (nessun voto)');

    } catch (error) {
      console.error('❌ Errore caricamento profili:', error);
      setErrore('Errore caricamento profili');
    }
  };

  // FUNZIONI SELEZIONE
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

  // GENERA SQUADRE CON BILANCIAMENTO RUOLI
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

      let squadraA = [];
      let squadraB = [];
      
      if (bilanciaRuoli) {
        // 🎯 BILANCIAMENTO CON RUOLI
        const risultato = generaSquadreBilanciate(giocatoriSelez);
        squadraA = risultato.squadraA;
        squadraB = risultato.squadraB;
      } else if (bilanciaLivello) {
        // Bilanciamento solo per livello
        const giocatoriOrdinati = [...giocatoriSelez].sort((a, b) => (b.voto || 0) - (a.voto || 0));
        for (let i = 0; i < giocatoriOrdinati.length; i++) {
          if (i % 2 === 0) {
            squadraA.push(giocatoriOrdinati[i]);
          } else {
            squadraB.push(giocatoriOrdinati[i]);
          }
        }
      } else {
        // Divisione casuale
        const giocatoriCasuali = [...giocatoriSelez].sort(() => Math.random() - 0.5);
        const meta = giocatoriCasuali.length / 2;
        squadraA = giocatoriCasuali.slice(0, meta);
        squadraB = giocatoriCasuali.slice(meta);
      }
      
      setSquadreGenerate({
        squadraA,
        squadraB,
        bilanciamento: calcolaBilanciamento(squadraA, squadraB),
        distribuzioneRuoli: analizzaDistribuzioneRuoli(squadraA, squadraB)
      });
      
      setLoading(false);
    }, 500);
  };

  // 🎯 ALGORITMO AVANZATO PER BILANCIAMENTO RUOLI
  const generaSquadreBilanciate = (giocatoriSelez) => {
    // Separa i giocatori per ruolo
    const portieri = giocatoriSelez.filter(g => g.ruolo === 'portiere');
    const difensori = giocatoriSelez.filter(g => g.ruolo === 'difensore');
    const centrocampisti = giocatoriSelez.filter(g => g.ruolo === 'centrocampista');
    const attaccanti = giocatoriSelez.filter(g => g.ruolo === 'attaccante');
    
    const squadraA = [];
    const squadraB = [];
    
    // Distribuisci i portieri (massimo 1 per squadra)
    distribuisciGiocatori(portieri, squadraA, squadraB, 1);
    
    // Distribuisci gli altri ruoli in modo bilanciato
    const maxPerSquadra = (giocatoriSelez.length - (squadraA.length + squadraB.length)) / 2;
    const difPerSquadra = Math.min(Math.ceil(difensori.length / 2), Math.floor(maxPerSquadra * 0.4));
    const cenPerSquadra = Math.min(Math.ceil(centrocampisti.length / 2), Math.floor(maxPerSquadra * 0.4));
    const attPerSquadra = Math.min(Math.ceil(attaccanti.length / 2), Math.floor(maxPerSquadra * 0.2));
    
    distribuisciGiocatori(difensori, squadraA, squadraB, difPerSquadra);
    distribuisciGiocatori(centrocampisti, squadraA, squadraB, cenPerSquadra);
    distribuisciGiocatori(attaccanti, squadraA, squadraB, attPerSquadra);
    
    // Aggiungi i giocatori rimanenti
    const tuttiGiocatori = [...giocatoriSelez];
    const giaAssegnati = [...squadraA, ...squadraB];
    const rimanenti = tuttiGiocatori.filter(g => !giaAssegnati.find(ga => ga.id === g.id));
    
    // Distribuisci i rimanenti bilanciando i livelli
    rimanenti.sort((a, b) => (b.voto || 0) - (a.voto || 0));
    rimanenti.forEach((giocatore, index) => {
      if (index % 2 === 0) {
        squadraA.push(giocatore);
      } else {
        squadraB.push(giocatore);
      }
    });
    
    return { squadraA, squadraB };
  };

  const distribuisciGiocatori = (giocatori, squadraA, squadraB, maxPerSquadra) => {
    const ordinati = [...giocatori].sort((a, b) => (b.voto || 0) - (a.voto || 0));
    
    for (let i = 0; i < ordinati.length; i++) {
      if (squadraA.filter(g => g.ruolo === ordinati[i].ruolo).length < maxPerSquadra && 
          squadraA.length < squadraB.length) {
        squadraA.push(ordinati[i]);
      } else if (squadraB.filter(g => g.ruolo === ordinati[i].ruolo).length < maxPerSquadra) {
        squadraB.push(ordinati[i]);
      } else if (squadraA.filter(g => g.ruolo === ordinati[i].ruolo).length < maxPerSquadra) {
        squadraA.push(ordinati[i]);
      } else {
        // Se entrambe le squadre hanno raggiunto il massimo, assegna alla squadra con meno giocatori
        if (squadraA.length <= squadraB.length) {
          squadraA.push(ordinati[i]);
        } else {
          squadraB.push(ordinati[i]);
        }
      }
    }
  };

  const analizzaDistribuzioneRuoli = (squadraA, squadraB) => {
    const contaRuoli = (squadra) => {
      return {
        portiere: squadra.filter(g => g.ruolo === 'portiere').length,
        difensore: squadra.filter(g => g.ruolo === 'difensore').length,
        centrocampista: squadra.filter(g => g.ruolo === 'centrocampista').length,
        attaccante: squadra.filter(g => g.ruolo === 'attaccante').length
      };
    };
    
    return {
      squadraA: contaRuoli(squadraA),
      squadraB: contaRuoli(squadraB)
    };
  };

  const calcolaBilanciamento = (squadraA, squadraB) => {
    const totaleA = squadraA.reduce((sum, g) => sum + (g.voto || 0), 0);
    const totaleB = squadraB.reduce((sum, g) => sum + (g.voto || 0), 0);
    const differenza = Math.abs(totaleA - totaleB);
    const percentualeBilanciamento = totaleA + totaleB > 0 ? 100 - (differenza / Math.max(totaleA, totaleB) * 100) : 0;
    
    let valutazione = '🎯 Ottimo';
    if (differenza > 2) valutazione = '⚠️ Accettabile';
    if (differenza > 4) valutazione = '📉 Da migliorare';
    
    return {
      totaleA: Math.round(totaleA * 10) / 10,
      totaleB: Math.round(totaleB * 10) / 10,
      differenza: Math.round(differenza * 10) / 10,
      percentualeBilanciamento: Math.round(percentualeBilanciamento),
      valutazione
    };
  };

  const rigeneraSquadre = () => {
    generaSquadre();
  };

  const copiaRisultati = () => {
    if (!squadreGenerate) return;
    
    const ruoliA = squadreGenerate.distribuzioneRuoli.squadraA;
    const ruoliB = squadreGenerate.distribuzioneRuoli.squadraB;
    
    const testo = `
🟥 SQUADRA A (${squadreGenerate.bilanciamento.totaleA} pts):
${squadreGenerate.squadraA.map((g, i) => `${i + 1}. ${g.nome} - ${g.ruolo}${g.voto ? ` - Voto: ${g.voto}` : ''}`).join('\n')}

🟦 SQUADRA B (${squadreGenerate.bilanciamento.totaleB} pts):
${squadreGenerate.squadraB.map((g, i) => `${i + 1}. ${g.nome} - ${g.ruolo}${g.voto ? ` - Voto: ${g.voto}` : ''}`).join('\n')}

Bilanciamento: ${squadreGenerate.bilanciamento.percentualeBilanciamento}% 
${squadreGenerate.bilanciamento.valutazione}
Differenza: ${squadreGenerate.bilanciamento.differenza} punti

DISTRIBUZIONE RUOLI:
Squadra A - P:${ruoliA.portiere} D:${ruoliA.difensore} C:${ruoliA.centrocampista} A:${ruoliA.attaccante}
Squadra B - P:${ruoliB.portiere} D:${ruoliB.difensore} C:${ruoliB.centrocampista} A:${ruoliB.attaccante}
    `.trim();

    navigator.clipboard.writeText(testo);
    alert('📋 Risultati copiati negli appunti!');
  };

  const giocatoriSelezionatiCount = giocatori.filter(g => g.selezionato).length;
  const giocatoriConVoto = giocatori.filter(g => g.voto !== null).length;

  if (caricamentoGiocatori) {
    return (
      <div className="genera-squadre-container">
        <div className="loading">
          <h3>🔄 Caricamento giocatori...</h3>
          <p>Sto leggendo i dati con i ruoli</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genera-squadre-container">
      <div className="genera-squadre-header">
        <h2>👥 Genera Squadre</h2>
        <p>Con bilanciamento livelli e ruoli</p>
      </div>

      {errore && (
        <div className="error-message">
          <h4>⚠️ Informazione</h4>
          <p>{errore}</p>
        </div>
      )}

      <div className="controlli-rapidi">
        <div className="stats-rapide">
          <span className="stat">Giocatori: {giocatori.length}</span>
          <span className="stat">Selezionati: {giocatoriSelezionatiCount}</span>
          <span className="stat">Con voto: {giocatoriConVoto}</span>
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
          <button onClick={() => selezionaNumero(16)} className="btn-secondary">
            Seleziona 16
          </button>
        </div>
      </div>

      <div className="barra-ricerca">
        <input
          type="text"
          placeholder="🔍 Cerca giocatore..."
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          className="input-ricerca"
        />
        {ricerca && (
          <button onClick={() => setRicerca('')} className="pulisci-ricerca">
            ✕
          </button>
        )}
      </div>

      {/* OPZIONI DI BILANCIAMENTO */}
      <div className="opzioni-generazione">
        <div className="opzioni-grid">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={bilanciaLivello}
              onChange={(e) => setBilanciaLivello(e.target.checked)}
              disabled={giocatoriConVoto === 0}
            />
            <span>⚖️ Bilanciamento Livelli</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={bilanciaRuoli}
              onChange={(e) => setBilanciaRuoli(e.target.checked)}
            />
            <span>🎯 Bilanciamento Ruoli</span>
          </label>
        </div>
        <small>
          {bilanciaRuoli 
            ? 'Crea squadre equilibrate con distribuzione intelligente dei ruoli' 
            : 'Divisione casuale o solo per livello'
          }
        </small>
      </div>

      <div className="lista-giocatori">
        <h3>
          Giocatori ({giocatoriSelezionatiCount} selezionati)
          {ricerca && ` - Trovati: ${giocatoriFiltrati.length}`}
        </h3>
        
        {giocatori.length === 0 ? (
          <div className="empty-state">
            <h4>📭 Nessun giocatore trovato</h4>
            <p>Il database non contiene giocatori</p>
          </div>
        ) : giocatoriFiltrati.length === 0 ? (
          <div className="empty-state">
            <h4>🔍 Nessun giocatore trovato</h4>
            <p>Prova con un altro nome</p>
          </div>
        ) : (
          <div className="giocatori-grid">
            {giocatoriFiltrati.map(giocatore => (
              <div 
                key={giocatore.id} 
                className={`giocatore-card ${giocatore.selezionato ? 'selezionato' : ''} ${giocatore.voto ? 'con-voto' : 'senza-voto'} ruolo-${giocatore.ruolo}`}
                onClick={() => toggleSelezioneGiocatore(giocatore.id)}
              >
                <div className="giocatore-info">
                  <h4>{giocatore.nome}</h4>
                  <div className="giocatore-dettagli">
                    <span className={`ruolo-badge ruolo-${giocatore.ruolo}`}>
                      {giocatore.ruolo === 'portiere' ? '🥅' : 
                       giocatore.ruolo === 'difensore' ? '🛡️' :
                       giocatore.ruolo === 'centrocampista' ? '⚙️' : '⚽'} {giocatore.ruolo}
                    </span>
                    {giocatore.voto && (
                      <span className="voto">⭐ {giocatore.voto}</span>
                    )}
                    {giocatore.partite_giocate > 0 && (
                      <span className="partite">🎯 {giocatore.partite_giocate}</span>
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

      {squadreGenerate && (
        <div className="risultati-squadre">
          <h3>🎉 Squadre Generate</h3>
          
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

          {/* DISTRIBUZIONE RUOLI */}
          {bilanciaRuoli && (
            <div className="distribuzione-ruoli">
              <h4>📊 Distribuzione Ruoli:</h4>
              <div className="ruoli-grid">
                <div className="ruoli-squadra">
                  <strong>🟥 Squadra A:</strong>
                  <span>🥅 {squadreGenerate.distribuzioneRuoli.squadraA.portiere}</span>
                  <span>🛡️ {squadreGenerate.distribuzioneRuoli.squadraA.difensore}</span>
                  <span>⚙️ {squadreGenerate.distribuzioneRuoli.squadraA.centrocampista}</span>
                  <span>⚽ {squadreGenerate.distribuzioneRuoli.squadraA.attaccante}</span>
                </div>
                <div className="ruoli-squadra">
                  <strong>🟦 Squadra B:</strong>
                  <span>🥅 {squadreGenerate.distribuzioneRuoli.squadraB.portiere}</span>
                  <span>🛡️ {squadreGenerate.distribuzioneRuoli.squadraB.difensore}</span>
                  <span>⚙️ {squadreGenerate.distribuzioneRuoli.squadraB.centrocampista}</span>
                  <span>⚽ {squadreGenerate.distribuzioneRuoli.squadraB.attaccante}</span>
                </div>
              </div>
            </div>
          )}

          <div className="squadre-grid">
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
                    <span className={`ruolo ruolo-${giocatore.ruolo}`}>
                      {giocatore.ruolo === 'portiere' ? '🥅' : 
                       giocatore.ruolo === 'difensore' ? '🛡️' :
                       giocatore.ruolo === 'centrocampista' ? '⚙️' : '⚽'}
                    </span>
                    {giocatore.voto && (
                      <span className="voto">⭐ {giocatore.voto}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
                    <span className={`ruolo ruolo-${giocatore.ruolo}`}>
                      {giocatore.ruolo === 'portiere' ? '🥅' : 
                       giocatore.ruolo === 'difensore' ? '🛡️' :
                       giocatore.ruolo === 'centrocampista' ? '⚙️' : '⚽'}
                    </span>
                    {giocatore.voto && (
                      <span className="voto">⭐ {giocatore.voto}</span>
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

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

function GeneraSquadre() {
  const [giocatori, setGiocatori] = useState([]);
  const [giocatoriFiltrati, setGiocatoriFiltrati] = useState([]);
  const [squadreGenerate, setSquadreGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bilanciaLivello, setBilanciaLivello] = useState(true);
  const [caricamentoGiocatori, setCaricamentoGiocatori] = useState(true);
  const [errore, setErrore] = useState('');
  const [ricerca, setRicerca] = useState('');

  // Carica giocatori con dati REALI dalla classifica
  useEffect(() => {
    caricaGiocatoriConClassifica();
  }, []);

  // Filtra giocatori quando cambia la ricerca
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
      
      console.log('📡 Caricamento giocatori dalla classifica...');
      
      let { data: giocatoriDB, error } = await supabase
        .from('classifiche')
        .select(`
          *,
          profili_utenti:giocatore_id (
            id,
            nome_completo,
            nickname
          )
        `)
        .order('punteggio_calcolato', { ascending: false });

      if (error || !giocatoriDB || giocatoriDB.length === 0) {
        console.log('🔄 Classifica vuota, carico dai profili...');
        await caricaDaProfiliUtenti();
        return;
      }

      console.log('✅ Dati classifica REALI:', giocatoriDB);

      // 🎯 SOLO DATI REALI - NESSUNA CONVERSIONE
      const giocatoriMappati = giocatoriDB.map(record => {
        const nomeCompleto = record.profili_utenti?.nome_completo 
          || record.profili_utenti?.nickname
          || `Giocatore ${record.giocatore_id}`;

        return {
          id: record.id,
          giocatore_id: record.giocatore_id,
          nome: nomeCompleto,
          // 🎯 VOTO REALE - quello che hai caricato
          voto: record.punteggio_calcolato,
          // 🎯 PARTITE REALI - quelle che hai caricato
          partite_giocate: record.partite_giocate,
          selezionato: false,
          da_classifica: true
        };
      });

      // 🎯 ORDINE ALFABETICO
      giocatoriMappati.sort((a, b) => a.nome.localeCompare(b.nome));

      setGiocatori(giocatoriMappati);
      setGiocatoriFiltrati(giocatoriMappati);
      setErrore(`✅ Caricati ${giocatoriMappati.length} giocatori con dati REALI`);

    } catch (error) {
      console.error('❌ Errore caricamento classifica:', error);
      setErrore(`Errore caricamento: ${error.message}`);
    } finally {
      setCaricamentoGiocatori(false);
    }
  };

  const caricaDaProfiliUtenti = async () => {
    try {
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

      const giocatoriMappati = profiliDB.map(profilo => ({
        id: profilo.id,
        giocatore_id: profilo.id,
        nome: profilo.nome_completo || profilo.nickname || `Giocatore ${profilo.id}`,
        voto: null,
        partite_giocate: 0,
        selezionato: false,
        da_profili: true
      }));

      setGiocatori(giocatoriMappati);
      setGiocatoriFiltrati(giocatoriMappati);
      setErrore(`✅ Caricati ${giocatoriMappati.length} giocatori dai profili`);

    } catch (error) {
      console.error('❌ Errore caricamento profili:', error);
      setErrore(`Errore caricamento profili: ${error.message}`);
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
        // 🎯 Bilanciamento per VOTO REALE
        giocatoriDaDividere.sort((a, b) => (b.voto || 0) - (a.voto || 0));
        
        const squadraA = [];
        const squadraB = [];
        
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
    // 🎯 Calcola basandoti sui VOTI REALI
    const totaleA = squadraA.reduce((sum, g) => sum + (g.voto || 0), 0);
    const totaleB = squadraB.reduce((sum, g) => sum + (g.voto || 0), 0);
    const differenza = Math.abs(totaleA - totaleB);
    const percentualeBilanciamento = 100 - (differenza / Math.max(totaleA, totaleB) * 100);
    
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
    
    const testo = `
🟥 SQUADRA A (${squadreGenerate.bilanciamento.totaleA} pts):
${squadreGenerate.squadraA.map((g, i) => `${i + 1}. ${g.nome} - Voto: ${g.voto || 'N/D'}`).join('\n')}

🟦 SQUADRA B (${squadreGenerate.bilanciamento.totaleB} pts):
${squadreGenerate.squadraB.map((g, i) => `${i + 1}. ${g.nome} - Voto: ${g.voto || 'N/D'}`).join('\n')}

Bilanciamento: ${squadreGenerate.bilanciamento.percentualeBilanciamento}% 
${squadreGenerate.bilanciamento.valutazione}
Differenza: ${squadreGenerate.bilanciamento.differenza} punti
    `.trim();

    navigator.clipboard.writeText(testo);
    alert('📋 Risultati copiati negli appunti!');
  };

  // STATISTICHE SEMPLIFICATE
  const giocatoriSelezionatiCount = giocatori.filter(g => g.selezionato).length;
  const giocatoriConVoto = giocatori.filter(g => g.voto !== null).length;
  const votoMedio = giocatori.length > 0 
    ? (giocatori.reduce((sum, g) => sum + (g.voto || 0), 0) / giocatori.filter(g => g.voto).length).toFixed(2)
    : 0;

  if (caricamentoGiocatori) {
    return (
      <div className="genera-squadre-container">
        <div className="loading">
          <h3>🔄 Caricamento giocatori...</h3>
          <p>Sto leggendo i dati REALI dalla classifica</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genera-squadre-container">
      <div className="genera-squadre-header">
        <h2>👥 Genera Squadre</h2>
        <p>Basato sui VOTI REALI dei giocatori</p>
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
          {votoMedio > 0 && <span className="stat">Voto medio: {votoMedio}</span>}
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

      {/* 🎯 BARRA DI RICERCA */}
      <div className="barra-ricerca">
        <input
          type="text"
          placeholder="🔍 Cerca giocatore..."
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          className="input-ricerca"
        />
        {ricerca && (
          <button 
            onClick={() => setRicerca('')}
            className="pulisci-ricerca"
          >
            ✕
          </button>
        )}
      </div>

      <div className="opzioni-generazione">
        <label className="checkbox-option large">
          <input
            type="checkbox"
            checked={bilanciaLivello}
            onChange={(e) => setBilanciaLivello(e.target.checked)}
          />
          <span>⚖️ Bilanciamento Automatico</span>
        </label>
        <small>Crea squadre equilibrate basate sui VOTI dei giocatori</small>
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
                className={`giocatore-card ${giocatore.selezionato ? 'selezionato' : ''}`}
                onClick={() => toggleSelezioneGiocatore(giocatore.id)}
              >
                <div className="giocatore-info">
                  <h4>{giocatore.nome}</h4>
                  <div className="giocatore-dettagli">
                    {/* 🎯 SOLO VOTO E PARTITE REALI - NIENTE GOL */}
                    {giocatore.voto && (
                      <span className="voto">⭐ Voto: {giocatore.voto}</span>
                    )}
                    {giocatore.partite_giocate > 0 && (
                      <span className="partite">🎯 Partite: {giocatore.partite_giocate}</span>
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
                    <span className="voto">⭐ {giocatore.voto || 'N/D'}</span>
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
                    <span className="voto">⭐ {giocatore.voto || 'N/D'}</span>
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

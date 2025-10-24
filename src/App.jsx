import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [activeMenu, setActiveMenu] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEventi = async () => {
    setLoading(true);
    setMessage('🎯 Caricamento eventi...');
    setActiveMenu('eventi');
    
    try {
      // RIMOSSO .order('data') perché la colonna non esiste
      const { data: eventi, error } = await supabase
        .from('eventi')
        .select('*');
      
      console.log('Eventi risultato:', eventi); // DEBUG
      
      if (error) throw error;
      
      setData(eventi);
      setMessage(`🎯 Trovati ${eventi?.length || 0} eventi`);
    } catch (error) {
      setMessage(`❌ Errore eventi: ${error.message}`);
      console.error('Error eventi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneraSquadre = async () => {
    setLoading(true);
    setMessage('👥 Generazione squadre...');
    setActiveMenu('squadre');
    
    try {
      // Prendi i giocatori dalla tabella classifiche
      const { data: giocatori, error } = await supabase
        .from('classifiche')
        .select('*');
      
      console.log('Giocatori per squadre:', giocatori); // DEBUG
      
      if (error) throw error;

      if (!giocatori || giocatori.length === 0) {
        setMessage('❌ Nessun giocatore trovato nella classifica');
        return;
      }

      // Mescola i giocatori
      const giocatoriMescolati = [...giocatori].sort(() => Math.random() - 0.5);
      
      // Dividi in due squadre
      const meta = Math.ceil(giocatoriMescolati.length / 2);
      const squadraA = giocatoriMescolati.slice(0, meta);
      const squadraB = giocatoriMescolati.slice(meta);
      
      setData({ squadraA, squadraB });
      setMessage(`👥 Squadre generate: ${squadraA.length} vs ${squadraB.length} giocatori`);
    } catch (error) {
      setMessage(`❌ Errore generazione squadre: ${error.message}`);
      console.error('Error squadre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScarparometro = async () => {
    setLoading(true);
    setMessage('📊 Caricamento classifica...');
    setActiveMenu('scarparometro');
    
    try {
      // RIMOSSO .order('punti') perché la colonna non esiste
      const { data: giocatori, error } = await supabase
        .from('classifiche')
        .select('*');
      
      console.log('Classifiche risultato:', giocatori); // DEBUG
      
      if (error) throw error;
      
      setData(giocatori);
      setMessage(`📊 Classifica di ${giocatori?.length || 0} giocatori`);
    } catch (error) {
      setMessage(`❌ Errore classifica: ${error.message}`);
      console.error('Error classifica:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilo = async () => {
    setLoading(true);
    setMessage('👤 Caricamento profilo...');
    setActiveMenu('profilo');
    
    try {
      // TABELLA CORRETTA: profili_utenti (non profil_utenti)
      const { data: profilo, error } = await supabase
        .from('profili_utenti')
        .select('*')
        .limit(1);
      
      console.log('Profilo risultato:', profilo); // DEBUG
      
      if (error) throw error;
      
      setData(profilo);
      setMessage('👤 Profilo caricato');
    } catch (error) {
      setMessage(`❌ Errore profilo: ${error.message}`);
      console.error('Error profilo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImpostazioni = async () => {
    setLoading(true);
    setMessage('⚙️ Caricamento impostazioni...');
    setActiveMenu('impostazioni');
    
    try {
      const { data: impostazioni, error } = await supabase
        .from('parametri_sistema')
        .select('*');
      
      console.log('Impostazioni risultato:', impostazioni); // DEBUG
      
      if (error) throw error;
      
      setData(impostazioni);
      setMessage('⚙️ Impostazioni caricate');
    } catch (error) {
      setMessage(`❌ Errore impostazioni: ${error.message}`);
      console.error('Error impostazioni:', error);
    } finally {
      setLoading(false);
    }
  };

  // Componente per visualizzare i dati
  const renderData = () => {
    if (!data) return null;
    
    if (activeMenu === 'eventi' && Array.isArray(data)) {
      return (
        <div className="data-container">
          <h3>Eventi</h3>
          {data.map((evento, index) => (
            <div key={evento.id || index} className="data-item">
              <pre>{JSON.stringify(evento, null, 2)}</pre>
            </div>
          ))}
        </div>
      );
    }
    
    if (activeMenu === 'scarparometro' && Array.isArray(data)) {
      return (
        <div className="data-container">
          <h3>Classifica Giocatori</h3>
          {data.map((giocatore, index) => (
            <div key={giocatore.id || index} className="data-item">
              <span className="posizione">#{index + 1}</span>
              <span className="nome">{giocatore.nome || giocatore.username || 'N/A'}</span>
              {/* Mostra qualsiasi campo punti/score se esiste */}
              {giocatore.punti && <span className="punti">{giocatore.punti} punti</span>}
              {giocatore.score && <span className="punti">{giocatore.score} punti</span>}
            </div>
          ))}
        </div>
      );
    }
    
    if (activeMenu === 'squadre' && data.squadraA) {
      return (
        <div className="data-container">
          <h3>Squadre Generate</h3>
          <div className="squadre-grid">
            <div className="squadra">
              <h4>🟥 Squadra A</h4>
              {data.squadraA.map((g, index) => (
                <div key={g.id || index} className="giocatore">
                  {g.nome || g.username || `Giocatore ${index + 1}`}
                </div>
              ))}
            </div>
            <div className="squadra">
              <h4>🟦 Squadra B</h4>
              {data.squadraB.map((g, index) => (
                <div key={g.id || index} className="giocatore">
                  {g.nome || g.username || `Giocatore ${index + 1}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeMenu === 'profilo' && Array.isArray(data)) {
      return (
        <div className="data-container">
          <h3>Il Mio Profilo</h3>
          {data.map((profilo, index) => (
            <div key={profilo.id || index} className="data-item">
              <pre>{JSON.stringify(profilo, null, 2)}</pre>
            </div>
          ))}
        </div>
      );
    }

    if (activeMenu === 'impostazioni' && Array.isArray(data)) {
      return (
        <div className="data-container">
          <h3>Impostazioni Sistema</h3>
          {data.map((parametro, index) => (
            <div key={parametro.id || index} className="data-item">
              <pre>{JSON.stringify(parametro, null, 2)}</pre>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <img 
            src="/Scarpari Inside simplelogo_2023.png" 
            alt="Scarpari Inside" 
            className="logo-image"
          />
          <h1 className="logo">SCARPARI INSIDE</h1>
          <p className="slogan">Il tempio del calcetto</p>
        </header>

        {/* Messaggio di stato */}
        {(message || loading) && (
          <div className="message-box">
            {loading ? '⏳ Caricamento...' : message}
          </div>
        )}

        {/* Menu Principale */}
        <main className="main">
          <div className="menu-grid">
            <button className="menu-btn" onClick={handleEventi} disabled={loading}>
              <span className="icon">🗓️</span>
              <span className="text">EVENTI</span>
            </button>

            <button className="menu-btn" onClick={handleGeneraSquadre} disabled={loading}>
              <span className="icon">👥</span>
              <span className="text">GENERA SQUADRE</span>
            </button>

            <button className="menu-btn" onClick={handleScarparometro} disabled={loading}>
              <span className="icon">📊</span>
              <span className="text">SCARPAROMETRO</span>
            </button>

            <button className="menu-btn" onClick={handleProfilo} disabled={loading}>
              <span className="icon">👤</span>
              <span className="text">IL MIO PROFILO</span>
            </button>

            <button className="menu-btn" onClick={handleImpostazioni} disabled={loading}>
              <span className="icon">⚙️</span>
              <span className="text">IMPOSTAZIONI</span>
            </button>
          </div>

          {/* Visualizzazione Dati */}
          {renderData()}
        </main>

        <footer className="footer">
          <p>- proudly made with rabbia in Veneto -</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

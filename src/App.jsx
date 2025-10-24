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
      const { data: eventi, error } = await supabase
        .from('eventi')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      
      setData(eventi);
      setMessage(`🎯 Trovati ${eventi.length} eventi`);
    } catch (error) {
      setMessage('❌ Errore nel caricamento eventi');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneraSquadre = async () => {
    setLoading(true);
    setMessage('👥 Generazione squadre...');
    setActiveMenu('squadre');
    
    try {
      // Prima prendi tutti i giocatori
      const { data: giocatori, error } = await supabase
        .from('giocatori')
        .select('*');
      
      if (error) throw error;

      // Mescola i giocatori
      const giocatoriMescolati = [...giocatori].sort(() => Math.random() - 0.5);
      
      // Dividi in due squadre
      const meta = Math.ceil(giocatoriMescolati.length / 2);
      const squadraA = giocatoriMescolati.slice(0, meta);
      const squadraB = giocatoriMescolati.slice(meta);
      
      setData({ squadraA, squadraB });
      setMessage('👥 Squadre generate con successo!');
    } catch (error) {
      setMessage('❌ Errore nella generazione squadre');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScarparometro = async () => {
    setLoading(true);
    setMessage('📊 Caricamento classifica...');
    setActiveMenu('scarparometro');
    
    try {
      const { data: giocatori, error } = await supabase
        .from('giocatori')
        .select('*')
        .order('punti', { ascending: false });
      
      if (error) throw error;
      
      setData(giocatori);
      setMessage(`📊 Classifica di ${giocatori.length} giocatori`);
    } catch (error) {
      setMessage('❌ Errore nel caricamento classifica');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilo = () => {
    setMessage('👤 IL MIO PROFILO - Caricamento dati...');
    setActiveMenu('profilo');
    // Da implementare
  };

  const handleImpostazioni = () => {
    setMessage('⚙️ IMPOSTAZIONI - Configurazione...');
    setActiveMenu('impostazioni');
    // Da implementare
  };

  // Componente per visualizzare i dati
  const renderData = () => {
    if (!data) return null;
    
    if (activeMenu === 'eventi' && Array.isArray(data)) {
      return (
        <div className="data-container">
          <h3>Ultimi Eventi</h3>
          {data.map(evento => (
            <div key={evento.id} className="data-item">
              <strong>{evento.nome}</strong> - {new Date(evento.data).toLocaleDateString('it-IT')}
              {evento.descrizione && <div className="descrizione">{evento.descrizione}</div>}
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
            <div key={giocatore.id} className="data-item">
              <span className="posizione">#{index + 1}</span>
              <span className="nome">{giocatore.nome}</span>
              <span className="punti">{giocatore.punti} punti</span>
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
              {data.squadraA.map(g => (
                <div key={g.id} className="giocatore">{g.nome}</div>
              ))}
            </div>
            <div className="squadra">
              <h4>🟦 Squadra B</h4>
              {data.squadraB.map(g => (
                <div key={g.id} className="giocatore">{g.nome}</div>
              ))}
            </div>
          </div>
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

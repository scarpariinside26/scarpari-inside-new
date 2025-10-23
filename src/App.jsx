import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationPhase < 5) {
        setAnimationPhase(animationPhase + 1);
      } else {
        setShowDashboard(true);
      }
    }, animationPhase === 0 ? 1500 : 1200); // 7 secondi totali

    return () => clearTimeout(timer);
  }, [animationPhase]);

  const renderAnimation = () => {
    switch (animationPhase) {
      case 0:
        return <div className="animation-phase phase-1">BENVENUTO NELL'INFERNO DEL CALCETTO</div>;
      case 1:
        return <div className="animation-phase phase-2">QUI LA DIGNITÀ RESTA ALL'INGRESSO</div>;
      case 2:
        return <div className="animation-phase phase-3">SOLO UNA COSA CONTA...</div>;
      case 3:
        return <div className="animation-phase phase-4">IL RISPETTO</div>;
      case 4:
        return <div className="animation-phase phase-5">ACCEDI ALL'INFERNO...</div>;
      case 5:
        return <div className="animation-phase phase-6">3... 2... 1...</div>;
      default:
        return null;
    }
  };

  const renderDashboard = () => (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>SCARPARI INSIDE - IL TEMPIO DEL CALCETTO</h1>
      </header>

      <main className="dashboard-main">
        <div className="menu-grid">
          <div className="menu-card" onClick={() => alert('Eventi aperti!')}>
            <div className="menu-icon">🗓️</div>
            <h3>EVENTI</h3>
            <p>Prossimi match e tornei</p>
          </div>

          <div className="menu-card" onClick={() => alert('Generazione squadre!')}>
            <div className="menu-icon">👥</div>
            <h3>GENERA SQUADRE</h3>
            <p>Random team generator</p>
          </div>

          <div className="menu-card" onClick={() => alert('Scarparometro!')}>
            <div className="menu-icon">📊</div>
            <h3>SCARPAROMETRO</h3>
            <p>Classifica giocatori</p>
          </div>

          <div className="menu-card" onClick={() => alert('Profilo!')}>
            <div className="menu-icon">👤</div>
            <h3>IL MIO PROFILO</h3>
            <p>Statistiche personali</p>
          </div>

          <div className="menu-card" onClick={() => alert('Impostazioni!')}>
            <div className="menu-icon">⚙️</div>
            <h3>IMPOSTAZIONI</h3>
            <p>Configurazione</p>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>- proudly made with rabbia in Veneto -</p>
      </footer>
    </div>
  );

  return (
    <div className="App">
      {showDashboard ? renderDashboard() : renderAnimation()}
    </div>
  );
}

export default App;

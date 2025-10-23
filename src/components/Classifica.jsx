import React from 'react';

export default function Classifica({ onBack }) {
  return (
    <div className="appito-page">
      <header className="page-header">
        <button onClick={onBack} className="back-button">←</button>
        <h1>Classifica</h1>
      </header>
      
      <main className="page-content">
        <div className="info-card">
          <h2>🏆 Classifica</h2>
          <p>Funzionalità in sviluppo - Disponibile prossimamente!</p>
          <p>Qui vedrai la classifica dei giocatori basata su voti e prestazioni.</p>
        </div>
      </main>
    </div>
  );
}

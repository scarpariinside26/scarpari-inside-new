import React from 'react';

function ListaEventi({ onEventoCliccato }) {
  return (
    <div className="lista-eventi-container">
      <div className="filtri-header">
        <div className="filtri-ricerca">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Cerca eventi..."
              className="search-input"
            />
          </div>
          
          <div className="filtri-group">
            <button className="filtro-btn active">📋 Tutti</button>
            <button className="filtro-btn">🗓️ Futuri</button>
            <button className="filtro-btn">☀️ Oggi</button>
            <button className="filtro-btn">📚 Passati</button>
          </div>
        </div>

        <div className="statistiche-rapide">
          <span className="stat">Totali: 0</span>
          <span className="stat">Filtrati: 0</span>
        </div>
      </div>

      <div className="eventi-lista">
        <div className="nessun-evento">
          <div className="empty-state">
            <h3>📭 Nessun evento trovato</h3>
            <p>Crea il primo evento per iniziare!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListaEventi;

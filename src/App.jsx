import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        {/* Header con Logo */}
        <header className="header">
          <h1 className="logo">SCARPARI INSIDE</h1>
          <p className="slogan">Il tempio del calcetto</p>
        </header>

        {/* Menu Principale */}
        <main className="main">
          <div className="menu-grid">
            <button className="menu-btn" onClick={() => alert('Eventi aperti!')}>
              <span className="icon">🗓️</span>
              <span className="text">EVENTI</span>
            </button>

            <button className="menu-btn" onClick={() => alert('Generazione squadre!')}>
              <span className="icon">👥</span>
              <span className="text">GENERA SQUADRE</span>
            </button>

            <button className="menu-btn" onClick={() => alert('Scarparometro!')}>
              <span className="icon">📊</span>
              <span className="text">SCARPAROMETRO</span>
            </button>

            <button className="menu-btn" onClick={() => alert('Profilo!')}>
              <span className="icon">👤</span>
              <span className="text">IL MIO PROFILO</span>
            </button>

            <button className="menu-btn" onClick={() => alert('Impostazioni!')}>
              <span className="icon">⚙️</span>
              <span className="text">IMPOSTAZIONI</span>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>- proudly made with rabbia in Veneto -</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

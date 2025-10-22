import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Componente Homepage - Carosello Schede
function HomePage({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { 
      id: 'eventi', 
      icon: '📅', 
      title: 'Eventi & Partite', 
      description: 'Crea e gestisci gli eventi della squadra',
      color: '#8B5CF6'
    },
    { 
      id: 'giocatori', 
      icon: '👥', 
      title: 'Giocatori', 
      description: 'Gestisci tutti i giocatori e i loro profili',
      color: '#00D4FF'
    },
    { 
      id: 'classifica', 
      icon: '🏆', 
      title: 'Classifica', 
      description: 'Vedi le statistiche e la classifica giocatori',
      color: '#EC4899'
    },
    { 
      id: 'feed', 
      icon: '💬', 
      title: 'Feed Social', 
      description: 'Condividi news e aggiornamenti con la squadra',
      color: '#10B981'
    },
    { 
      id: 'statistiche', 
      icon: '📊', 
      title: 'Statistiche', 
      description: 'Analisi e metriche delle performance',
      color: '#F59E0B'
    },
    { 
      id: 'impostazioni', 
      icon: '⚙️', 
      title: 'Impostazioni', 
      description: 'Gestisci le preferenze del sistema',
      color: '#6B7280'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="homepage">
      <header className="dashboard-header">
        <div className="logo-container">
          <img 
            src="/Scarpari Inside simplelogo_2023.png" 
            alt="Scarpari Inside" 
            className="main-logo"
          />
        </div>
      </header>

      <div className="carosello-container">
        {/* Freccia sinistra */}
        <button className="carosello-arrow left" onClick={prevSlide}>
          ‹
        </button>

        {/* Slide attiva */}
        <div className="carosello-slide active">
          <div 
            className="slide-card"
            style={{ borderLeftColor: slides[currentSlide].color }}
          >
            <div className="slide-icon" style={{ color: slides[currentSlide].color }}>
              {slides[currentSlide].icon}
            </div>
            <h2 className="slide-title">{slides[currentSlide].title}</h2>
            <p className="slide-description">{slides[currentSlide].description}</p>
            <button 
              className="slide-button"
              style={{ backgroundColor: slides[currentSlide].color }}
              onClick={() => onNavigate(slides[currentSlide].id)}
            >
              Apri {slides[currentSlide].title}
            </button>
          </div>
        </div>

        {/* Slide successiva (anteprima) */}
        <div className="carosello-slide next">
          <div className="slide-card preview">
            <div className="slide-icon small">
              {slides[(currentSlide + 1) % slides.length].icon}
            </div>
            <span className="slide-label">
              {slides[(currentSlide + 1) % slides.length].title}
            </span>
          </div>
        </div>

        {/* Freccia destra */}
        <button className="carosello-arrow right" onClick={nextSlide}>
          ›
        </button>
      </div>

      {/* Indicatori */}
      <div className="carosello-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

// [MANTIENI GLI STESSI COMPONENTI PAGINE DI PRIMA...]
// GiocatoriPage, EventiPage, etc...

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'giocatori':
        return <GiocatoriPage onBack={() => setCurrentPage('home')} />;
      case 'eventi':
        return <EventiPage onBack={() => setCurrentPage('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={`app ${currentPage !== 'home' ? 'page-active' : ''}`}>
      {renderPage()}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

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
        <h1 className="app-title">Scarpari Inside</h1>
      </header>

      <div className="carosello-3d">
        <button className="carosello-arrow left" onClick={prevSlide}>
          ‹
        </button>

        <div className="carosello-track">
          {slides.map((slide, index) => {
            const offset = (index - currentSlide + slides.length) % slides.length;
            const position = offset > slides.length / 2 ? offset - slides.length : offset;
            
            return (
              <div
                key={slide.id}
                className={`carosello-slide-3d ${position === 0 ? 'active' : ''}`}
                style={{
                  '--offset': position,
                  '--abs-offset': Math.abs(position),
                  '--direction': Math.sign(position),
                  '--opacity': Math.max(1 - Math.abs(position) * 0.3, 0.2),
                  '--scale': Math.max(1 - Math.abs(position) * 0.2, 0.6),
                  '--rotateY': position * 25,
                  '--z': -Math.abs(position) * 100
                }}
                onClick={() => position === 0 && onNavigate(slide.id)}
              >
                <div 
                  className="slide-card-3d"
                  style={{ borderLeftColor: slide.color }}
                >
                  <div className="slide-icon" style={{ color: slide.color }}>
                    {slide.icon}
                  </div>
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-description">{slide.description}</p>
                  {position === 0 && (
                    <button 
                      className="slide-button"
                      style={{ backgroundColor: slide.color }}
                    >
                      Apri {slide.title}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className="carosello-arrow right" onClick={nextSlide}>
          ›
        </button>
      </div>

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

// [MANTIENI GLI ALTRI COMPONENTI PAGINE...]

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

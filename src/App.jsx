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
      {/* HEADER COMPLETAMENTE RIMOSSO */}
      
      <div className="carosello-3d-cerchio">
        <button className="carosello-arrow left" onClick={prevSlide}>
          ‹
        </button>

        <div className="cerchio-container">
          {slides.map((slide, index) => {
            const angle = (index / slides.length) * 2 * Math.PI;
            const radius = 180;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const rotationY = (angle * 180) / Math.PI;
            
            const isActive = index === currentSlide;
            const distanceFromActive = Math.min(
              Math.abs(index - currentSlide),
              Math.abs(index - currentSlide + slides.length),
              Math.abs(index - currentSlide - slides.length)
            );

            return (
              <div
                key={slide.id}
                className={`slide-3d-cerchio ${isActive ? 'active' : ''}`}
                style={{
                  '--x': `${x}px`,
                  '--z': `${z}px`,
                  '--rotateY': `${rotationY}deg`,
                  '--opacity': Math.max(1 - distanceFromActive * 0.4, 0.3),
                  '--scale': Math.max(1 - distanceFromActive * 0.3, 0.6),
                }}
                onClick={() => isActive && onNavigate(slide.id)}
              >
                <div 
                  className="slide-card-cerchio"
                  style={{ 
                    borderLeftColor: slide.color,
                    backgroundColor: `rgba(255, 255, 255, ${isActive ? 0.15 : 0.08})`
                  }}
                >
                  <div className="slide-icon" style={{ color: slide.color }}>
                    {slide.icon}
                  </div>
                  {isActive && (
                    <>
                      <h2 className="slide-title">{slide.title}</h2>
                      <p className="slide-description">{slide.description}</p>
                      <button 
                        className="slide-button"
                        style={{ backgroundColor: slide.color }}
                      >
                        Apri {slide.title}
                      </button>
                    </>
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

// [MANTIENI GLI ALTRI COMPONENTI...]

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

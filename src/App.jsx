import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [eventi, setEventi] = useState([])
  const [loading, setLoading] = useState(true)
  const [nuovoEvento, setNuovoEvento] = useState({
    nome_evento: '',
    data_ora: '',
    luogo: '',
    max_partecipanti: 12
  })

  // Carica eventi dal database
  const caricaEventi = async () => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .select('*')
        .order('data_ora', { ascending: true })
      
      if (error) throw error
      setEventi(data || [])
    } catch (error) {
      console.error('Errore caricamento eventi:', error)
    } finally {
      setLoading(false)
    }
  }

  // Crea nuovo evento
  const creaEvento = async () => {
    if (!nuovoEvento.nome_evento || !nuovoEvento.data_ora || !nuovoEvento.luogo) {
      alert('Compila tutti i campi!')
      return
    }

    try {
      const { data, error } = await supabase
        .from('eventi')
        .insert([nuovoEvento])
        .select()

      if (error) throw error
      
      setEventi([...eventi, data[0]])
      setNuovoEvento({
        nome_evento: '',
        data_ora: '',
        luogo: '',
        max_partecipanti: 12
      })
      alert('Evento creato con successo!')
      caricaEventi() // Ricarica la lista
    } catch (error) {
      console.error('Errore creazione evento:', error)
      alert('Errore nella creazione dell\'evento')
    }
  }

  // Carica eventi all'avvio
  useEffect(() => {
    caricaEventi()
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '16px',
      color: 'white',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      
      {/* HEADER */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        padding: '32px 20px',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '24px',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        <img 
          src="/Scarpari%20Inside%20simplelogo_2023.png" 
          alt="Scarpari Inside Logo" 
          style={{ 
            height: '100px', 
            marginBottom: '20px',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0, 200, 255, 0.6)',
            border: '2px solid rgba(0, 200, 255, 0.5)'
          }} 
        />
        
        <h1 style={{ 
          fontSize: '2.4rem', 
          fontWeight: '800',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
          fontFamily: '"SF Pro Display", -apple-system, sans-serif'
        }}>
          SCARPARI INSIDE
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.8,
          fontWeight: '400',
          letterSpacing: '0.3px',
          fontFamily: '"SF Pro Display", sans-serif'
        }}>
          Database Eventi Attivo 🗄️
        </p>
      </div>

      {/* GRIGLIA PRINCIPALE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>

        {/* CARD PROSSIMA PARTITA */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '26px',
          borderRadius: '22px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)'
        }}>
          <h3 style={{ 
            marginBottom: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px',
            fontSize: '1.3rem',
            fontWeight: '600',
            letterSpacing: '-0.3px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #32d74b, #64d2ff)',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '20px',
              boxShadow: '0 6px 20px rgba(100, 210, 255, 0.4)'
            }}>⏳</span>
            Prossima Partita
          </h3>
          
          <div style={{ lineHeight: '1.9', marginBottom: '24px', fontSize: '1.05rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ opacity: '0.8', fontSize: '18px' }}>📅</span>
              <div>
                <div style={{ fontWeight: '600' }}>Sabato 15 Novembre</div>
                <div style={{ fontSize: '0.95rem', opacity: '0.7' }}>Tra 3 giorni</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ opacity: '0.8', fontSize: '18px' }}>🕘</span>
              <span>Ore 21:00 • 2 ore</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ opacity: '0.8', fontSize: '18px' }}>📍</span>
              <span>Campo Comunale "R. Sport"</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ opacity: '0.8', fontSize: '18px' }}>👥</span>
              <div>
                <div style={{ fontWeight: '600' }}>8/12 confermati</div>
                <div style={{ fontSize: '0.95rem', opacity: '0.7' }}>4 posti disponibili</div>
              </div>
            </div>
          </div>
          
          <button style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #32d74b 0%, #30d475 100%)',
            border: 'none',
            borderRadius: '14px',
            color: 'white',
            fontSize: '17px',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(50, 215, 75, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.2px'
          }}>
            ✅ Conferma Partecipazione
          </button>
        </div>

        {/* GRIGLIA AZIONI RAPIDE */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '26px',
          borderRadius: '22px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)'
        }}>
          <h3 style={{ 
            marginBottom: '22px',
            fontSize: '1.3rem',
            fontWeight: '600',
            letterSpacing: '-0.3px'
          }}>🚀 Azioni Rapide</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px'
          }}>
            {[
              { icon: '📅', label: 'Nuova Partita' },
              { icon: '👥', label: 'Giocatori' },
              { icon: '🏆', label: 'Classifica' },
              { icon: '⚙️', label: 'Impostazioni' }
            ].map((item, index) => (
              <button 
                key={index}
                onClick={() => {
                  if (item.label === 'Nuova Partita') {
                    document.getElementById('form-nuovo-evento')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    })
                  } else {
                    alert(`${item.label} - Funzionalità in sviluppo!`)
                  }
                }}
                style={{
                  padding: '20px 14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  letterSpacing: '0.1px'
                }}
              >
                <span style={{ 
                  fontSize: '24px',
                  filter: 'drop-shadow(0 4px 12px rgba(255,255,255,0.3))'
                }}>
                  {item.icon}
                </span>
                <span style={{ 
                  fontSize: '15px',
                  fontWeight: '500'
                }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* STATISTICHE PERSONALI */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '26px',
          borderRadius: '22px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)'
        }}>
          <h3 style={{ 
            marginBottom: '22px',
            fontSize: '1.3rem',
            fontWeight: '600',
            letterSpacing: '-0.3px'
          }}>📊 Statistiche Personali</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {[
              { value: '12', label: 'Partite', emoji: '⚽', trend: '+2' },
              { value: '8', label: 'Vittorie', emoji: '🎯', trend: '+3' },
              { value: '15', label: 'Gol', emoji: '⭐', trend: '+5' },
              { value: '3°', label: 'Posizione', emoji: '🏆', trend: '↑1' }
            ].map((stat, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '20px 16px',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <div style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff, #c0c0c0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '6px',
                  letterSpacing: '-0.5px'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontSize: '16px' }}>{stat.emoji}</span>
                  <span>{stat.label}</span>
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#32d74b',
                  fontWeight: '600'
                }}>
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM NUOVO EVENTO */}
        <div 
          id="form-nuovo-evento"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '26px',
            borderRadius: '22px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)'
          }}
        >
          <h3 style={{ 
            marginBottom: '22px',
            fontSize: '1.3rem',
            fontWeight: '600',
            letterSpacing: '-0.3px'
          }}>📅 Crea Nuova Partita</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Nome partita (es: Serata Calcetto)"
              value={nuovoEvento.nome_evento}
              onChange={(e) => setNuovoEvento({...nuovoEvento, nome_evento: e.target.value})}
              style={{
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '16px'
              }}
            />
            
            <input
              type="datetime-local"
              value={nuovoEvento.data_ora}
              onChange={(e) => setNuovoEvento({...nuovoEvento, data_ora: e.target.value})}
              style={{
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '16px'
              }}
            />
            
            <input
              type="text"
              placeholder="Luogo (es: Campo Comunale)"
              value={nuovoEvento.luogo}
              onChange={(e) => setNuovoEvento({...nuovoEvento, luogo: e.target.value})}
              style={{
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '16px'
              }}
            />
            
            <button 
              onClick={creaEvento}
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #0078d4 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🚀 Crea Evento
            </button>
          </div>
        </div>

        {/* LISTA EVENTI */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '26px',
          borderRadius: '22px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)'
        }}>
          <h3 style={{ 
            marginBottom: '22px',
            fontSize: '1.3rem',
            fontWeight: '600',
            letterSpacing: '-0.3px'
          }}>📋 Eventi Programmati</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div>Caricamento eventi...</div>
            </div>
          ) : eventi.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', opacity: 0.7 }}>
              <div>Nessun evento programmato</div>
              <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Crea il primo evento!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {eventi.map((evento) => (
                <div key={evento.id} style={{
                  padding: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>
                    {evento.nome_evento}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
                    <div>📅 {new Date(evento.data_ora).toLocaleString('it-IT')}</div>
                    <div>📍 {evento.luogo}</div>
                    <div>👥 Max {evento.max_partecipanti} giocatori</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default App

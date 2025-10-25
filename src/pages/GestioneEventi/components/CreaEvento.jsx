import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

function CreaEvento({ onSuccess, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // STEP 1: Informazioni base
    nome_evento: '',
    descrizione: '',
    tipo_evento: 'sportivo',
    visibilita: 'pubblico',
    
    // STEP 2: Data e Luogo (SEMPLIFICATO)
    data_ora: '',
    ritrovo_minuti_prima: 15, // 👈 NUOVO - invece di data_ora_ritrovo
    durata_minuti: 90,
    luogo: '',
    indirizzo_gmaps: '',
    
    // STEP 3: Partecipanti e Opzioni
    max_partecipanti: 12,
    allow_chat: true,
    allow_file_upload: true,
    allow_sondaggi: true,
    auto_generate_squadre: true,
    
    // STEP 4: Programmazione
    programma_promemoria: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.nome_evento || !formData.tipo_evento)) {
      setError('Compila nome evento e tipo');
      return;
    }
    if (step === 2 && (!formData.data_ora || !formData.luogo)) {
      setError('Compila data e luogo');
      return;
    }
    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  // Funzione per inviare notifica email
  const inviaNotificaEmail = async (evento) => {
    try {
      console.log('📧 Invio notifica per evento:', evento.nome_evento);
      
      const response = await fetch('/api/send-notifica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evento: evento,
          emailDestinatario: 'giocatore@example.com'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Notifica email inviata:', result);
        
        if (result.testMode) {
          alert(`🛡️ MODALITÀ TEST: Email inviata a TE invece che a: ${result.originalRecipient}`);
        }
      } else {
        console.error('❌ Errore invio email:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Errore chiamata API:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validazione finale
      if (!formData.nome_evento || !formData.data_ora || !formData.luogo) {
        throw new Error('Compila i campi obbligatori: nome evento, data e luogo');
      }

      const eventoData = {
        // Informazioni base
        nome_evento: formData.nome_evento,
        descrizione: formData.descrizione || null,
        tipo_evento: formData.tipo_evento,
        visibilita: formData.visibilita,
        
        // Data e Luogo - SEMPLIFICATO!
        data_ora: new Date(formData.data_ora).toISOString(),
        data_ora_ritrovo: null, // 👈 Non usiamo più questo campo complesso
        durata_minuti: parseInt(formData.durata_minuti) || 90,
        luogo: formData.luogo,
        indirizzo_gmaps: formData.indirizzo_gmaps || null,
        
        // Partecipanti
        max_partecipanti: parseInt(formData.max_partecipanti) || 12,
        
        // Funzionalità
        allow_chat: formData.allow_chat,
        allow_file_upload: formData.allow_file_upload,
        allow_sondaggi: formData.allow_sondaggi,
        auto_generate_squadre: formData.auto_generate_squadre,
        
        // Programmazione
        programma_promemoria: formData.programma_promemoria,
        
        // Metadati
        creato_da: (await supabase.auth.getUser()).data.user?.id,
        stato: 'attivo'
      };

      console.log('📦 Dati evento da inviare:', eventoData);

      const { data, error } = await supabase
        .from('eventi')
        .insert([eventoData])
        .select()
        .single();

      if (error) {
        console.error('❌ Errore Supabase:', error);
        throw error;
      }

      console.log('✅ Evento creato:', data);
      
      // 🎯 INVIA NOTIFICA EMAIL DOPO CREAZIONE EVENTO
      console.log('📧 Invio notifica email...');
      await inviaNotificaEmail(data);
      
      alert('✅ Evento avanzato creato con successo! Notifica inviata.');
      onSuccess();

    } catch (error) {
      console.error('❌ Errore creazione evento:', error);
      setError(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h3>📝 Informazioni Base</h3>
            
            <div className="form-group">
              <label>Nome Evento *</label>
              <input
                type="text"
                name="nome_evento"
                value={formData.nome_evento}
                onChange={handleChange}
                placeholder="Es: Partita calcetto amichevole"
                required
              />
            </div>

            <div className="form-group">
              <label>Descrizione</label>
              <textarea
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                placeholder="Descrivi l'evento..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Tipo Evento *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipo_evento"
                    value="sportivo"
                    checked={formData.tipo_evento === 'sportivo'}
                    onChange={handleChange}
                  />
                  <span>⚽ Sportivo</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipo_evento"
                    value="sociale"
                    checked={formData.tipo_evento === 'sociale'}
                    onChange={handleChange}
                  />
                  <span>🎉 Sociale</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Visibilità</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="visibilita"
                    value="pubblico"
                    checked={formData.visibilita === 'pubblico'}
                    onChange={handleChange}
                  />
                  <span>🌍 Pubblico</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="visibilita"
                    value="privato"
                    checked={formData.visibilita === 'privato'}
                    onChange={handleChange}
                  />
                  <span>🔒 Privato</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h3>📅 Data e Luogo</h3>

            <div className="form-group">
              <label>Data e Ora Evento *</label>
              <input
                type="datetime-local"
                name="data_ora"
                value={formData.data_ora}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ritrovo (minuti prima)</label>
              <select name="ritrovo_minuti_prima" value={formData.ritrovo_minuti_prima} onChange={handleChange}>
                <option value={0}>All'orario dell'evento</option>
                <option value={15}>15 minuti prima</option>
                <option value={30}>30 minuti prima</option>
                <option value={45}>45 minuti prima</option>
                <option value={60}>1 ora prima</option>
              </select>
              <small>Quando ci si ritrova prima dell'evento</small>
            </div>

            <div className="form-group">
              <label>Durata Evento</label>
              <select name="durata_minuti" value={formData.durata_minuti} onChange={handleChange}>
                <option value={60}>1 ora</option>
                <option value={90}>1 ora e 30</option>
                <option value={120}>2 ore</option>
                <option value={180}>3 ore</option>
              </select>
            </div>

            <div className="form-group">
              <label>Luogo *</label>
              <input
                type="text"
                name="luogo"
                value={formData.luogo}
                onChange={handleChange}
                placeholder="Es: Campo Sportivo Comunale"
                required
              />
            </div>

            <div className="form-group">
              <label>Indirizzo Google Maps (opzionale)</label>
              <input
                type="text"
                name="indirizzo_gmaps"
                value={formData.indirizzo_gmaps}
                onChange={handleChange}
                placeholder="Incolla link Google Maps"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h3>👥 Partecipanti e Funzionalità</h3>

            <div className="form-group">
              <label>Numero Massimo Partecipanti</label>
              <input
                type="number"
                name="max_partecipanti"
                value={formData.max_partecipanti}
                onChange={handleChange}
                min="2"
                max="100"
              />
            </div>

            <div className="advanced-options">
              <div className="option-group">
                <h4>🎯 Funzionalità Attive</h4>
                
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="allow_chat"
                    checked={formData.allow_chat}
                    onChange={handleChange}
                  />
                  <span>💬 Chat Evento</span>
                </label>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="allow_file_upload"
                    checked={formData.allow_file_upload}
                    onChange={handleChange}
                  />
                  <span>📎 Upload File</span>
                </label>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="allow_sondaggi"
                    checked={formData.allow_sondaggi}
                    onChange={handleChange}
                  />
                  <span>🗳️ Sondaggi</span>
                </label>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="auto_generate_squadre"
                    checked={formData.auto_generate_squadre}
                    onChange={handleChange}
                  />
                  <span>👥 Auto-generazione Squadre</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h3>⏰ Programmazione</h3>

            <div className="form-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="programma_promemoria"
                  checked={formData.programma_promemoria}
                  onChange={handleChange}
                />
                <span>🔔 Invio Promemoria Automatici</span>
              </label>
              <small>Invio promemoria 24 ore prima dell'evento</small>
            </div>

            <div className="form-group">
              <label>Note Aggiuntive (opzionale)</label>
              <textarea
                name="note_aggiuntive"
                value={formData.note_aggiuntive}
                onChange={handleChange}
                placeholder="Altre informazioni utili per i partecipanti..."
                rows="2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="crea-evento-container">
      <div className="crea-evento-header">
        <h2>🎯 Crea Evento Avanzato</h2>
        <p>Crea eventi con tutte le funzionalità intelligenti</p>
        
        <div className="step-indicator">
          <span className={step >= 1 ? 'active' : ''}>1. Info</span>
          <span className={step >= 2 ? 'active' : ''}>2. Data/Luogo</span>
          <span className={step >= 3 ? 'active' : ''}>3. Partecipanti</span>
          <span className={step >= 4 ? 'active' : ''}>4. Programmazione</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="crea-evento-form">
        {error && <div className="error-message">❌ {error}</div>}

        {renderStep()}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              ← Indietro
            </button>
          )}
          
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Avanti →
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '🎲 Creazione...' : '🎉 Crea Evento Avanzato'}
            </button>
          )}
          
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreaEvento;

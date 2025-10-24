import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

function CreaEvento({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    tipo_evento: 'sportivo',
    titolo: '',
    descrizione: '',
    data_ora_evento: '',
    data_ora_ritrovo: '',
    durata_minuti: 90,
    luogo: '',
    indirizzo_gmaps: '',
    max_partecipanti: 10,
    visibilita: 'pubblico',
    ricorrente: false,
    tipo_ricorrenza: 'settimanale',
    fine_ricorrenza: '',
    programma_invio: '',
    programma_promemoria: true,
    allow_chat: true,
    allow_file_upload: true,
    auto_generate_squadre: true,
    allow_sondaggi: true
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.titolo || !formData.data_ora_evento || !formData.luogo) {
        throw new Error('Compila i campi obbligatori: titolo, data e luogo');
      }

      const eventoData = {
        tipo_evento: formData.tipo_evento,
        titolo: formData.titolo,
        descrizione: formData.descrizione,
        data_ora_evento: new Date(formData.data_ora_evento).toISOString(),
        data_ora_ritrovo: formData.data_ora_ritrovo ? new Date(formData.data_ora_ritrovo).toISOString() : null,
        durata_minuti: formData.durata_minuti,
        luogo: formData.luogo,
        indirizzo_gmaps: formData.indirizzo_gmaps,
        max_partecipanti: formData.max_partecipanti,
        visibilita: formData.visibilita,
        ricorrente: formData.ricorrente,
        tipo_ricorrenza: formData.tipo_ricorrenza,
        fine_ricorrenza: formData.fine_ricorrenza ? new Date(formData.fine_ricorrenza).toISOString() : null,
        programma_invio: formData.programma_invio ? new Date(formData.programma_invio).toISOString() : null,
        programma_promemoria: formData.programma_promemoria,
        allow_chat: formData.allow_chat,
        allow_file_upload: formData.allow_file_upload,
        auto_generate_squadre: formData.auto_generate_squadre,
        allow_sondaggi: formData.allow_sondaggi,
        organizzatore_id: (await supabase.auth.getUser()).data.user?.id,
        stato: 'attivo'
      };

      const { data, error } = await supabase
        .from('eventi')
        .insert([eventoData])
        .select()
        .single();

      if (error) throw error;
      onSuccess();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crea-evento-container">
      <div className="crea-evento-header">
        <h2>Crea Nuovo Evento</h2>
        <div className="step-indicator">
          <span className={step >= 1 ? 'active' : ''}>1. Base</span>
          <span className={step >= 2 ? 'active' : ''}>2. Date</span>
          <span className={step >= 3 ? 'active' : ''}>3. Luogo</span>
          <span className={step >= 4 ? 'active' : ''}>4. Avanzate</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="crea-evento-form">
        {error && <div className="error-message">❌ {error}</div>}

        {/* STEP 1: INFORMAZIONI BASE */}
        {step === 1 && (
          <div className="form-step">
            <h3>Informazioni Base</h3>
            
            <div className="form-group">
              <label>Tipo Evento *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="tipo_evento" value="sportivo" checked={formData.tipo_evento === 'sportivo'} onChange={handleChange} />
                  <span>⚽ Sportivo</span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="tipo_evento" value="community" checked={formData.tipo_evento === 'community'} onChange={handleChange} />
                  <span>🎉 Community</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Titolo Evento *</label>
              <input type="text" name="titolo" value={formData.titolo} onChange={handleChange} placeholder="Es: Partita calcetto amichevole" required />
            </div>

            <div className="form-group">
              <label>Descrizione</label>
              <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrivi l'evento..." rows="4" />
            </div>

            <div className="form-group">
              <label>Visibilità</label>
              <select name="visibilita" value={formData.visibilita} onChange={handleChange}>
                <option value="pubblico">🌍 Pubblico</option>
                <option value="privato">🔒 Privato</option>
                <option value="gruppo">👥 Solo Gruppo</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="btn-secondary">Annulla</button>
              <button type="button" onClick={nextStep} className="btn-primary">Avanti →</button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE E ORARI */}
        {step === 2 && (
          <div className="form-step">
            <h3>Date e Orari</h3>

            <div className="form-group">
              <label>Data e Ora Evento *</label>
              <input type="datetime-local" name="data_ora_evento" value={formData.data_ora_evento} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Data e Ora Ritrovo</label>
              <input type="datetime-local" name="data_ora_ritrovo" value={formData.data_ora_ritrovo} onChange={handleChange} />
              <small>Se diverso dall'orario dell'evento</small>
            </div>

            <div className="form-group">
              <label>Durata Evento (minuti)</label>
              <input type="number" name="durata_minuti" value={formData.durata_minuti} onChange={handleChange} min="30" max="480" />
            </div>

            <div className="form-group">
              <label className="checkbox-option">
                <input type="checkbox" name="ricorrente" checked={formData.ricorrente} onChange={handleChange} />
                <span>Evento ricorrente</span>
              </label>
            </div>

            {formData.ricorrente && (
              <>
                <div className="form-group">
                  <label>Tipo Ricorrenza</label>
                  <select name="tipo_ricorrenza" value={formData.tipo_ricorrenza} onChange={handleChange}>
                    <option value="settimanale">Settimanale</option>
                    <option value="bisettimanale">Bisettimanale</option>
                    <option value="mensile">Mensile</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fine Ricorrenza</label>
                  <input type="date" name="fine_ricorrenza" value={formData.fine_ricorrenza} onChange={handleChange} />
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">← Indietro</button>
              <button type="button" onClick={nextStep} className="btn-primary">Avanti →</button>
            </div>
          </div>
        )}

        {/* STEP 3: LUOGO E PARTECIPANTI */}
        {step === 3 && (
          <div className="form-step">
            <h3>Luogo e Partecipanti</h3>

            <div className="form-group">
              <label>Luogo *</label>
              <input type="text" name="luogo" value={formData.luogo} onChange={handleChange} placeholder="Es: Campo Sportivo Comunale" required />
            </div>

            <div className="form-group">
              <label>Indirizzo Google Maps</label>
              <input type="text" name="indirizzo_gmaps" value={formData.indirizzo_gmaps} onChange={handleChange} placeholder="Incolla link Google Maps" />
            </div>

            <div className="form-group">
              <label>Numero Massimo Partecipanti *</label>
              <input type="number" name="max_partecipanti" value={formData.max_partecipanti} onChange={handleChange} min="2" max="100" required />
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">← Indietro</button>
              <button type="button" onClick={nextStep} className="btn-primary">Avanti →</button>
            </div>
          </div>
        )}

        {/* STEP 4: OPZIONI AVANZATE */}
        {step === 4 && (
          <div className="form-step">
            <h3>Opzioni Avanzate</h3>

            <div className="advanced-options">
              <div className="option-group">
                <h4>🎯 Funzionalità Evento</h4>
                <label className="checkbox-option">
                  <input type="checkbox" name="allow_chat" checked={formData.allow_chat} onChange={handleChange} />
                  <span>Attiva Chat Evento</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" name="allow_file_upload" checked={formData.allow_file_upload} onChange={handleChange} />
                  <span>Upload File Multimediali</span>
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" name="allow_sondaggi" checked={formData.allow_sondaggi} onChange={handleChange} />
                  <span>Sondaggi Real-time</span>
                </label>
                {formData.tipo_evento === 'sportivo' && (
                  <label className="checkbox-option">
                    <input type="checkbox" name="auto_generate_squadre" checked={formData.auto_generate_squadre} onChange={handleChange} />
                    <span>Auto-generazione Squadre</span>
                  </label>
                )}
              </div>

              <div className="option-group">
                <h4>⏰ Programmazione</h4>
                <label className="checkbox-option">
                  <input type="checkbox" name="programma_promemoria" checked={formData.programma_promemoria} onChange={handleChange} />
                  <span>Invio Promemoria Automatici</span>
                </label>
                <div className="form-group">
                  <label>Programma Invio Notifica</label>
                  <input type="datetime-local" name="programma_invio" value={formData.programma_invio} onChange={handleChange} />
                  <small>Quando inviare la notifica dell'evento</small>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">← Indietro</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creazione...' : '🎉 Crea Evento'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreaEvento;

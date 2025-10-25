import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';  // ✅

function CreaEvento({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome_evento: '',
    descrizione: '',
    data_ora: '',
    luogo: '',
    indirizzo_gmaps: '',
    max_partecipanti: 10,
    allow_chat: true,
    allow_file_upload: true,
    allow_sondaggi: true,
    auto_generate_squadre: true,
    programma_promemoria: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.nome_evento || !formData.data_ora || !formData.luogo) {
        throw new Error('Compila i campi obbligatori: nome evento, data e luogo');
      }

      const eventoData = {
        nome_evento: formData.nome_evento,
        data_ora: new Date(formData.data_ora).toISOString(),
        luogo: formData.luogo,
        indirizzo_gmaps: formData.indirizzo_gmaps,
        max_partecipanti: formData.max_partecipanti,
        allow_chat: formData.allow_chat,
        allow_file_upload: formData.allow_file_upload,
        allow_sondaggi: formData.allow_sondaggi,
        auto_generate_squadre: formData.auto_generate_squadre,
        programma_promemoria: formData.programma_promemoria,
        creato_da: (await supabase.auth.getUser()).data.user?.id,
        stato: 'attivo'
      };

      const { data, error } = await supabase
        .from('eventi')
        .insert([eventoData])
        .select()
        .single();

      if (error) throw error;
      
      alert('✅ Evento creato con successo!');
      onSuccess();

    } catch (error) {
      console.error('Errore creazione evento:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crea-evento-container">
      <div className="crea-evento-header">
        <h2>Crea Nuovo Evento</h2>
        <p>Crea eventi con tutte le funzionalità avanzate</p>
      </div>

      <form onSubmit={handleSubmit} className="crea-evento-form">
        {error && <div className="error-message">❌ {error}</div>}

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
            rows="4"
          />
        </div>

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
          <label>Indirizzo Google Maps</label>
          <input
            type="text"
            name="indirizzo_gmaps"
            value={formData.indirizzo_gmaps}
            onChange={handleChange}
            placeholder="Incolla link Google Maps"
          />
        </div>

        <div className="form-group">
          <label>Numero Massimo Partecipanti *</label>
          <input
            type="number"
            name="max_partecipanti"
            value={formData.max_partecipanti}
            onChange={handleChange}
            min="2"
            max="100"
            required
          />
        </div>

        <div className="advanced-options">
          <div className="option-group">
            <h4>🎯 Funzionalità Avanzate</h4>
            
            <label className="checkbox-option">
              <input
                type="checkbox"
                name="allow_chat"
                checked={formData.allow_chat}
                onChange={handleChange}
              />
              <span>💬 Attiva Chat Evento</span>
            </label>

            <label className="checkbox-option">
              <input
                type="checkbox"
                name="allow_file_upload"
                checked={formData.allow_file_upload}
                onChange={handleChange}
              />
              <span>📎 Upload File Multimediali</span>
            </label>

            <label className="checkbox-option">
              <input
                type="checkbox"
                name="allow_sondaggi"
                checked={formData.allow_sondaggi}
                onChange={handleChange}
              />
              <span>🗳️ Sondaggi Real-time</span>
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

          <div className="option-group">
            <h4>⏰ Programmazione</h4>
            
            <label className="checkbox-option">
              <input
                type="checkbox"
                name="programma_promemoria"
                checked={formData.programma_promemoria}
                onChange={handleChange}
              />
              <span>🔔 Invio Promemoria Automatici</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annulla
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creazione...' : '🎉 Crea Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreaEvento;

import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';

function CreaEvento({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    tipo_evento: 'sportivo',
    titolo: '',
    descrizione: '',
    data_ora_evento: '',
    luogo: '',
    indirizzo_gmaps: '',
    max_partecipanti: 10,
    visibilita: 'pubblico'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validazione
      if (!formData.titolo || !formData.data_ora_evento || !formData.luogo) {
        throw new Error('Compila i campi obbligatori: titolo, data e luogo');
      }

      // Prepara dati per Supabase (solo campi esistenti)
      const eventoData = {
        tipo_evento: formData.tipo_evento,
        titolo: formData.titolo,
        descrizione: formData.descrizione,
        data_ora_evento: new Date(formData.data_ora_evento).toISOString(),
        luogo: formData.luogo,
        indirizzo_gmaps: formData.indirizzo_gmaps,
        max_partecipanti: formData.max_partecipanti,
        visibilita: formData.visibilita,
        organizzatore_id: (await supabase.auth.getUser()).data.user?.id,
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
        <p>Crea il tuo primo evento con i campi base</p>
      </div>

      <form onSubmit={handleSubmit} className="crea-evento-form">
        {error && <div className="error-message">❌ {error}</div>}

        <div className="form-group">
          <label>Tipo Evento *</label>
          <select name="tipo_evento" value={formData.tipo_evento} onChange={handleChange}>
            <option value="sportivo">⚽ Sportivo</option>
            <option value="community">🎉 Community</option>
          </select>
        </div>

        <div className="form-group">
          <label>Titolo Evento *</label>
          <input
            type="text"
            name="titolo"
            value={formData.titolo}
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
            name="data_ora_evento"
            value={formData.data_ora_evento}
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

        <div className="form-group">
          <label>Visibilità</label>
          <select name="visibilita" value={formData.visibilita} onChange={handleChange}>
            <option value="pubblico">🌍 Pubblico</option>
            <option value="privato">🔒 Privato</option>
          </select>
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

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ProfiloUtente() {
  const [profilo, setProfilo] = useState({
    // Dati anagrafici di base
    nome_completo: '',
    email: '',
    telefono: '',
    data_nascita: '',
    
    // Dati geografici (OBBLIGATORI per completamento)
    provincia: '',
    comune: '',
    indirizzo: '',
    
    // Ruoli di gioco
    portiere: false,
    difensore: false,
    centrocampista: false,
    attaccante: false,
    livello_scarparo: 'intermedio',
    
    // Caratteristiche fisiche (OPZIONALI)
    piede_preferito: '',
    altezza_cm: '',
    peso_kg: '',
    numero_scarpe: '',
    
    // Social e identità (OPZIONALI)
    nickname: '',
    bestemmia_preferita: '',
    facebook_url: '',
    instagram_handle: '',
    twitter_handle: '',
    
    // Disponibilità (OPZIONALI)
    giorni_disponibili: [],
    fascia_oraria_preferita: '',
    raggio_km: 20,
    
    // Contatti emergenza (OPZIONALI)
    contatto_emergenza_nome: '',
    contatto_emergenza_telefono: '',
    
    // Dati medici (OPZIONALI)
    allergie: '',
    condizioni_mediche: '',
    
    // Settings privacy
    profilo_pubblico: true,
    mostra_telefono: false,
    mostra_email: false,
    mostra_bestemmia: false,
    mostra_social: false,
    mostra_caratteristiche_fisiche: false,
    mostra_nickname: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carica il profilo
  useEffect(() => {
    caricaProfilo();
  }, []);

  const caricaProfilo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profili_utenti')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfilo(data);
      }
    } catch (error) {
      console.error('Errore caricamento profilo:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvaProfilo = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non loggato');

      const { error } = await supabase
        .from('profili_utenti')
        .upsert({
          ...profilo,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Profilo salvato con successo!');
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('Errore nel salvataggio del profilo');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfilo(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setProfilo(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  if (loading) return <div className="loading">Caricamento profilo...</div>;

  return (
    <div className="profilo-utente">
      <h1>Il Mio Profilo</h1>

      {/* SEZIONE 1: Dati Anagrafici */}
      <section className="sezione">
        <h2>📝 Dati Anagrafici</h2>
        <div className="grid-2">
          <input
            type="text"
            placeholder="Nome Completo *"
            value={profilo.nome_completo}
            onChange={(e) => handleChange('nome_completo', e.target.value)}
          />
          <input
            type="email"
            placeholder="Email *"
            value={profilo.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefono"
            value={profilo.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
          />
          <input
            type="date"
            placeholder="Data di Nascita"
            value={profilo.data_nascita}
            onChange={(e) => handleChange('data_nascita', e.target.value)}
          />
        </div>
      </section>

      {/* SEZIONE 2: Dati Geografici (OBBLIGATORI) */}
      <section className="sezione">
        <h2>📍 Dati Geografici</h2>
        <div className="grid-3">
          <select 
            value={profilo.provincia} 
            onChange={(e) => handleChange('provincia', e.target.value)}
          >
            <option value="">Seleziona Provincia *</option>
            <option value="PD">Padova</option>
            <option value="VE">Venezia</option>
            <option value="VI">Vicenza</option>
            {/* Aggiungi altre province */}
          </select>
          
          <select 
            value={profilo.comune} 
            onChange={(e) => handleChange('comune', e.target.value)}
          >
            <option value="">Seleziona Comune *</option>
            <option value="Padova">Padova</option>
            <option value="Venezia">Venezia</option>
            <option value="Vicenza">Vicenza</option>
            {/* Aggiungi altri comuni */}
          </select>
          
          <input
            type="text"
            placeholder="Indirizzo"
            value={profilo.indirizzo}
            onChange={(e) => handleChange('indirizzo', e.target.value)}
          />
        </div>
      </section>

      {/* SEZIONE 3: Ruoli di Gioco */}
      <section className="sezione">
        <h2>⚽ Ruoli di Gioco</h2>
        <div className="ruoli-grid">
          {['portiere', 'difensore', 'centrocampista', 'attaccante'].map(ruolo => (
            <label key={ruolo} className="checkbox-label">
              <input
                type="checkbox"
                checked={profilo[ruolo]}
                onChange={(e) => handleChange(ruolo, e.target.checked)}
              />
              {ruolo.charAt(0).toUpperCase() + ruolo.slice(1)}
            </label>
          ))}
        </div>
        
        <select 
          value={profilo.livello_scarparo} 
          onChange={(e) => handleChange('livello_scarparo', e.target.value)}
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzato">Avanzato</option>
        </select>
      </section>

      {/* SEZIONE 4: Caratteristiche Fisiche */}
      <section className="sezione">
        <h2>💪 Caratteristiche Fisiche</h2>
        <div className="grid-4">
          <select 
            value={profilo.piede_preferito} 
            onChange={(e) => handleChange('piede_preferito', e.target.value)}
          >
            <option value="">Piede Preferito</option>
            <option value="destro">Destro</option>
            <option value="sinistro">Sinistro</option>
            <option value="ambidestro">Ambidestro</option>
          </select>
          
          <input
            type="number"
            placeholder="Altezza (cm)"
            value={profilo.altezza_cm}
            onChange={(e) => handleChange('altezza_cm', e.target.value)}
          />
          
          <input
            type="number"
            placeholder="Peso (kg)"
            value={profilo.peso_kg}
            onChange={(e) => handleChange('peso_kg', e.target.value)}
          />
          
          <input
            type="number"
            placeholder="Numero Scarpe"
            value={profilo.numero_scarpe}
            onChange={(e) => handleChange('numero_scarpe', e.target.value)}
          />
        </div>
      </section>

      {/* SEZIONE 5: Social e Identità */}
      <section className="sezione">
        <h2>👤 Social e Identità</h2>
        <div className="grid-2">
          <input
            type="text"
            placeholder="Nickname (per i tag @nome)"
            value={profilo.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
          />
          <input
            type="text"
            placeholder="Bestemmia Preferita 😈"
            value={profilo.bestemmia_preferita}
            onChange={(e) => handleChange('bestemmia_preferita', e.target.value)}
          />
          <input
            type="text"
            placeholder="Facebook URL"
            value={profilo.facebook_url}
            onChange={(e) => handleChange('facebook_url', e.target.value)}
          />
          <input
            type="text"
            placeholder="Instagram @handle"
            value={profilo.instagram_handle}
            onChange={(e) => handleChange('instagram_handle', e.target.value)}
          />
          <input
            type="text"
            placeholder="Twitter/X @handle"
            value={profilo.twitter_handle}
            onChange={(e) => handleChange('twitter_handle', e.target.value)}
          />
        </div>
      </section>

      {/* SEZIONE 6: Disponibilità */}
      <section className="sezione">
        <h2>📅 Disponibilità</h2>
        <div className="disponibilita">
          <label>Giorni disponibili:</label>
          <div className="checkbox-group">
            {['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'].map(giorno => (
              <label key={giorno} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={profilo.giorni_disponibili.includes(giorno)}
                  onChange={(e) => handleArrayChange('giorni_disponibili', giorno, e.target.checked)}
                />
                {giorno}
              </label>
            ))}
          </div>
          
          <select 
            value={profilo.fascia_oraria_preferita} 
            onChange={(e) => handleChange('fascia_oraria_preferita', e.target.value)}
          >
            <option value="">Fascia Oraria Preferita</option>
            <option value="mattina">Mattina</option>
            <option value="pomeriggio">Pomeriggio</option>
            <option value="sera">Sera</option>
          </select>
          
          <div className="range-input">
            <label>Raggio di spostamento: {profilo.raggio_km} km</label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={profilo.raggio_km}
              onChange={(e) => handleChange('raggio_km', parseInt(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* SEZIONE 7: Contatti Emergenza e Medici */}
      <section className="sezione">
        <h2>🏥 Contatti Emergenza & Dati Medici</h2>
        <div className="grid-2">
          <input
            type="text"
            placeholder="Contatto Emergenza - Nome"
            value={profilo.contatto_emergenza_nome}
            onChange={(e) => handleChange('contatto_emergenza_nome', e.target.value)}
          />
          <input
            type="tel"
            placeholder="Contatto Emergenza - Telefono"
            value={profilo.contatto_emergenza_telefono}
            onChange={(e) => handleChange('contatto_emergenza_telefono', e.target.value)}
          />
          <input
            type="text"
            placeholder="Allergie"
            value={profilo.allergie}
            onChange={(e) => handleChange('allergie', e.target.value)}
          />
          <input
            type="text"
            placeholder="Condizioni Mediche"
            value={profilo.condizioni_mediche}
            onChange={(e) => handleChange('condizioni_mediche', e.target.value)}
          />
        </div>
      </section>

      {/* SEZIONE 8: Privacy Settings */}
      <section className="sezione">
        <h2>🔒 Impostazioni Privacy</h2>
        <div className="privacy-grid">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.profilo_pubblico}
              onChange={(e) => handleChange('profilo_pubblico', e.target.checked)}
            />
            Profilo pubblico
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.mostra_telefono}
              onChange={(e) => handleChange('mostra_telefono', e.target.checked)}
            />
            Mostra telefono
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.mostra_email}
              onChange={(e) => handleChange('mostra_email', e.target.checked)}
            />
            Mostra email
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.mostra_nickname}
              onChange={(e) => handleChange('mostra_nickname', e.target.checked)}
            />
            Mostra nickname
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.mostra_bestemmia}
              onChange={(e) => handleChange('mostra_bestemmia', e.target.checked)}
            />
            Mostra bestemmia preferita
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.mostra_social}
              onChange={(e) => handleChange('mostra_social', e.target.checked)}
            />
            Mostra social
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={profilo.mostra_caratteristiche_fisiche}
              onChange={(e) => handleChange('mostra_caratteristiche_fisiche', e.target.checked)}
            />
            Mostra caratteristiche fisiche
          </label>
        </div>
      </section>

      {/* BOTTONE SALVA */}
      <div className="azioni">
        <button 
          onClick={salvaProfilo} 
          disabled={saving || !profilo.nome_completo || !profilo.email}
          className="btn-salva"
        >
          {saving ? 'Salvataggio...' : 'Salva Profilo'}
        </button>
        
        {(!profilo.provincia || !profilo.comune) && (
          <div className="avviso-completamento">
            ⚠️ Completa i dati geografici per finire la registrazione
          </div>
        )}
      </div>
    </div>
  );
}

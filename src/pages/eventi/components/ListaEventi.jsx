import React from 'react';

function ListaEventi({ eventi, onEventoCliccato }) {
  const formattaData = (dataOra) => {
    return new Date(dataOra).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatoBadge = (evento) => {
    const now = new Date();
    const dataEvento = new Date(evento.data_ora_evento);
    
    if (evento.stato === 'cancellato') return '❌ Cancellato';
    if (dataEvento < now) return '✅ Completato';
    if (evento.iscrizioni_eventi?.length >= evento.max_partecipanti) return '🔴 Completo';
    return '🟢 Attivo';
  };

  return (
    <div className="lista-eventi">
      <div className="eventi-grid">
        {eventi.length === 0 ? (
          <div className="nessun-evento">
            <h3>Nessun evento programmato</h3>
            <p>Crea il primo evento per iniziare!</p>
          </div>
        ) : (
          eventi.map(evento => (
            <div 
              key={evento.id} 
              className="evento-card"
              onClick={() => onEventoCliccato(evento)}
            >
              <div className="evento-header">
                <h3>{evento.titolo}</h3>
                <span className={`stato ${evento.stato}`}>
                  {getStatoBadge(evento)}
                </span>
              </div>
              
              <div className="evento-info">
                <p>📅 {formattaData(evento.data_ora_evento)}</p>
                <p>📍 {evento.luogo}</p>
                <p>👥 {evento.iscrizioni_eventi?.length || 0}/{evento.max_partecipanti} partecipanti</p>
                <p>📎 {evento.file_eventi?.count || 0} file</p>
              </div>

              <div className="evento-footer">
                <span className="tipo-evento">
                  {evento.tipo_evento === 'sportivo' ? '⚽' : '🎉'} 
                  {evento.tipo_evento}
                </span>
                <span className="visibilita">
                  {evento.visibilita === 'privato' ? '🔒' : '🌍'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListaEventi;

import { supabase } from '$lib/supabase'

export const load = async () => {
  // Carica eventi dal database Supabase
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) {
    console.error('Error loading events:', error)
    return { events: [] }
  }

  // Se non hai eventi nel DB, usa dati mock
  if (!events || events.length === 0) {
    return { 
      events: [
        {
          id: 1,
          title: "Martedì da leoni...CAMPONOGAR...",
          event_date: "2025-10-28",
          event_time: "19:40",
          location: "Scarpari inside",
          level: "Avanzati, Intermedi, Pri...",
          invitation_sent: false,
          current_participants: 12
        },
        {
          id: 2,
          title: "Dai che è Venerdì...CAMPONOGA...",
          event_date: "2025-11-01",
          event_time: "19:40", 
          location: "Scarpari inside",
          level: "Avanzati",
          invitation_sent: false,
          invitation_schedule: "2025-10-30T00:00:00"
        }
      ]
    }
  }

  return { events }
}

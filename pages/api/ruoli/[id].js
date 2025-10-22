import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const { portiere, difensore, centrocampista, attaccante } = req.body

    const { data, error } = await supabase
      .from('ruoli_giocatore')
      .update({
        portiere,
        difensore,
        centrocampista,
        attaccante,
        updated_at: new Date().toISOString()
      })
      .eq('giocatore_id', id)

    if (error) throw error

    res.status(200).json({ success: true, message: 'Ruoli aggiornati' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

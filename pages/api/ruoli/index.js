import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Qui dovresti avere l'autenticazione
    // Per ora prendiamo il giocatore_id dai query params
    const { giocatore_id } = req.query

    if (!giocatore_id) {
      return res.status(400).json({ error: 'giocatore_id required' })
    }

    const { data, error } = await supabase
      .from('ruoli_giocatore')
      .select('*')
      .eq('giocatore_id', giocatore_id)
      .single()

    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

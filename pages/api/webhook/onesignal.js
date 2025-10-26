export default async function handler(req, res) {
  // Configurazione CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { event, user_id, action, notification_id } = req.body;

      console.log('🔔 WEBHOOK RICEVUTO:', { 
        event, 
        user_id, 
        action 
      });

      // Esempio: se qualcuno clicca "conferma"
      if (event === 'notification_clicked' && action === 'conferma') {
        console.log(`✅ ${user_id} ha confermato!`);
        // Qui poi aggiungerai il codice per il database
      }

      // Rispondi a OneSignal che tutto ok
      res.status(200).json({ 
        success: true, 
        message: 'Webhook ricevuto' 
      });

    } catch (error) {
      console.error('❌ Errore webhook:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

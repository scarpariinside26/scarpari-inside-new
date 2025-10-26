export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method === 'POST') {
    try {
      const { event, user_id, action } = request.body;

      console.log('🔔 Webhook ricevuto:', { event, user_id, action });

      // Gestisci le risposte ai pulsanti
      if (event === 'notification_clicked') {
        switch (action) {
          case 'conferma':
            console.log(`✅ ${user_id} ha confermato!`);
            break;
          case 'annulla':
            console.log(`❌ ${user_id} ha annullato!`);
            break;
          default:
            console.log(`🔘 ${user_id} ha cliccato: ${action}`);
        }
      }

      response.status(200).json({ 
        success: true, 
        message: 'Webhook ricevuto' 
      });

    } catch (error) {
      console.error('❌ Errore webhook:', error);
      response.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
}

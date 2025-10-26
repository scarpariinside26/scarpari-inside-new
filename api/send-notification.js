export default async function handler(request, response) {
  // Permetti chiamate dal browser
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method === 'POST') {
    try {
      const { title, message, url, buttons } = request.body;

      console.log('📧 Invio notifica:', { title, message });

      const onesignalResponse = await fetch('https://api.onesignal.com/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: process.env.ONESIGNAL_APP_ID,
          included_segments: ['Subscribed Users'],
          headings: { en: title },
          contents: { en: message },
          url: url || 'https://scarpari-inside-new-gr8n.vercel.app',
          web_buttons: buttons
        })
      });

      const result = await onesignalResponse.json();

      if (result.errors) {
        console.error('❌ Errore OneSignal:', result.errors);
        return response.status(400).json({
          success: false,
          errors: result.errors
        });
      }

      console.log('✅ Notifica inviata:', result.id);
      response.status(200).json({
        success: true,
        message: 'Notifica inviata!',
        id: result.id
      });

    } catch (error) {
      console.error('❌ Errore API:', error);
      response.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
}

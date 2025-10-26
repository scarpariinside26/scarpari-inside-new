export default async function handler(req, res) {
  // Permetti le chiamate dal browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Se è una richiesta OPTIONS, rispondi OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo richieste POST
  if (req.method === 'POST') {
    try {
      const { title, message, url, buttons } = req.body;

      // Chiama OneSignal
      const response = await fetch('https://api.onesignal.com/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          included_segments: ['Subscribed Users'],
          headings: { en: title },
          contents: { en: message },
          url: url || 'https://scarpari-inside-new-gr8n.vercel.app',
          web_buttons: buttons
        })
      });

      const result = await response.json();

      // Se OneSignal da errori
      if (result.errors) {
        return res.status(400).json({
          success: false,
          errors: result.errors
        });
      }

      // Successo!
      res.status(200).json({
        success: true,
        message: 'Notifica inviata!',
        id: result.id
      });

    } catch (error) {
      console.error('Errore:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  } else {
    // Metodo non permesso
    res.status(405).json({ error: 'Method not allowed' });
  }
}

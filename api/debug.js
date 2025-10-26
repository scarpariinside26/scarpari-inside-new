// api/debug.js
module.exports = async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Mostra le variabili ambiente (senza rivelare i valori completi per sicurezza)
  const envInfo = {
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID ? 'PRESENTE (' + process.env.ONESIGNAL_APP_ID.substring(0, 8) + '...)' : 'MANCANTE',
    ONESIGNAL_REST_API_KEY: process.env.ONESIGNAL_REST_API_KEY ? 'PRESENTE (' + process.env.ONESIGNAL_REST_API_KEY.substring(0, 8) + '...)' : 'MANCANTE',
    VITE_ONESIGNAL_APP_ID: process.env.VITE_ONESIGNAL_APP_ID ? 'PRESENTE' : 'MANCANTE'
  };

  console.log('🔍 Debug variabili ambiente:', envInfo);

  response.status(200).json({
    success: true,
    message: 'API Debug funziona!',
    environment: envInfo,
    timestamp: new Date().toISOString()
  });
};
